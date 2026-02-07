const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = __dirname;
const partialsDir = path.join(srcDir, 'partials');

// Read Partials
const headerTemplate = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8');
const factTemplate = fs.readFileSync(path.join(partialsDir, 'fact.html'), 'utf8');

fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error("Error reading src directory:", err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === '.html') {
            const filePath = path.join(srcDir, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error(`Error reading ${file}:`, err);
                    return;
                }

                // Dynamic Header: Set Active State
                let currentHeader = headerTemplate;

                // SEO Data
                const pageMeta = require('./metadata.json');

                const meta = pageMeta[file] || pageMeta['index.html']; // Fallback to index if not found
                const baseUrl = 'https://www.gemsphere.ai/';
                const canonicalUrl = baseUrl + (file === 'index.html' ? '' : file);

                currentHeader = currentHeader.replace(/<!-- TITLE -->/g, meta.title);
                currentHeader = currentHeader.replace(/<!-- META_KEYWORDS -->/g, meta.keywords);
                currentHeader = currentHeader.replace(/<!-- META_DESCRIPTION -->/g, meta.description);
                currentHeader = currentHeader.replace(/<!-- CANONICAL_URL -->/g, canonicalUrl);


                // 1. Remove 'active' from all nav links (and text-secondary if strictly coupled)
                // The original code had: class="nav-item nav-link active text-secondary" for Home
                // and class="nav-item nav-link" for others.

                // Regex to strip 'active' and 'text-secondary' from generic nav-links to reset them
                currentHeader = currentHeader.replace(/class="nav-item nav-link[^"]*"/g, 'class="nav-item nav-link"');

                // 2. Add 'active text-secondary' to the specific link
                // Pattern: href="filename" class="nav-item nav-link"
                const activeClass = 'class="nav-item nav-link active text-secondary"';
                const linkRegex = new RegExp(`href="${file}" class="nav-item nav-link"`, 'g');

                if (linkRegex.test(currentHeader)) {
                    currentHeader = currentHeader.replace(linkRegex, `href="${file}" ${activeClass}`);
                    // Try matching strict Home case if file is index.html and regex failed (though step 1 should have normalized it)
                    // or other variations. 
                    // For now, the simple reset + set approach should work if partial usage is consistent.
                }

                // Inject Partials
                if (content.includes('<!-- FACT_PARTIAL -->')) {
                    content = content.replace('<!-- FACT_PARTIAL -->', factTemplate);
                }

                // Combine
                const finalHtml = currentHeader + '\n' + content + '\n' + footerTemplate;

                // Write to root
                fs.writeFile(path.join(outDir, file), finalHtml, (err) => {
                    if (err) console.error(`Error writing ${file}:`, err);
                    else console.log(`Built ${file}`);
                });
            });
        }
    });

    // Generate Sitemap
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files.filter(file => file.endsWith('.html') && file !== '404.html').map(file => `
    <url>
        <loc>https://www.gemsphere.ai/${file}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${file === 'index.html' ? '1.0' : '0.8'}</priority>
    </url>
`).join('')}
</urlset>`;

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapContent);
    console.log('Built sitemap.xml');

    // Generate Robots.txt
    const robotsContent = `User-agent: *
Allow: /
Sitemap: https://www.gemsphere.ai/sitemap.xml`;

    fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsContent);
    console.log('Built robots.txt');

});
