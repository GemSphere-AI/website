const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        if (path.extname(file) === '.html') {
            const filePath = path.join(srcDir, file);
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    console.error(err);
                    return;
                }

                // regex to find content between Navbar End and Footer Start
                // Note: We want to KEEP the content starting AFTER Navbar End
                // and ending BEFORE Footer Start.

                // Markers
                const startMarker = '<!-- Navbar End -->';
                const endMarker = '<!-- Footer Start -->';

                const startIndex = content.indexOf(startMarker);
                const endIndex = content.indexOf(endMarker);

                if (startIndex !== -1 && endIndex !== -1) {
                    // Extract content
                    let newContent = content.substring(startIndex + startMarker.length, endIndex).trim();

                    // Add a comment to indicate it's a partial content file
                    newContent = `<!-- Page Content -->\n${newContent}`;

                    fs.writeFile(filePath, newContent, (err) => {
                        if (err) console.error(err);
                        else console.log(`Processed ${file}`);
                    });
                } else {
                    console.log(`Skipping ${file} - markers not found`);
                }
            });
        }
    });
});
