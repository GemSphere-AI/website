const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = __dirname;
const partialsDir = path.join(srcDir, 'partials');

// Read Partials
const headerTemplate = fs.readFileSync(path.join(partialsDir, 'header.html'), 'utf8');
const footerTemplate = fs.readFileSync(path.join(partialsDir, 'footer.html'), 'utf8');
const factTemplate = fs.readFileSync(path.join(partialsDir, 'fact.html'), 'utf8');
const teamTemplate = fs.readFileSync(path.join(partialsDir, 'team.html'), 'utf8');

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
                const pageMeta = {
                    'index.html': {
                        title: 'GemSphere AI - Innovative IT, E-commerce & Supply Chain Solutions',
                        keywords: 'GemSphere AI, IT Solutions, Artificial Intelligence, E-commerce Development, Supply Chain Optimization, Software Development, Bengaluru, Automation',
                        description: 'GemSphere AI delivers premium IT and AI solutions, specializing in custom software, advanced e-commerce platforms, and supply chain automation to help you grow.'
                    },
                    'about.html': {
                        title: 'About Us - GemSphere AI',
                        keywords: 'About GemSphere AI, IT Company Team, Software Engineers, AI Experts, Tech Mission',
                        description: 'Learn about GemSphere AI, our mission, and our expert team of software developers and AI specialists dedicated to transforming businesses.'
                    },
                    'service.html': {
                        title: 'Our Services - GemSphere AI',
                        keywords: 'Web Development, AI Solutions, E-commerce, Supply Chain Management, UI/UX Design, Digital Marketing, App Development, Cyber Security',
                        description: 'Explore our comprehensive IT services including Web Development, AI Integration, E-commerce Solutions, Supply Chain Optimization, and Digital Marketing.'
                    },
                    'project.html': {
                        title: 'Our Projects - GemSphere AI Portfolio',
                        keywords: 'Software Projects, E-commerce Case Studies, Supply Chain Projects, IT Portfolio, App Success Stories, Web Development Examples',
                        description: 'View our portfolio of successful projects, including e-commerce platforms and logistics solutions. See how GemSphere AI has helped businesses achieve their goals.'
                    },
                    'product.html': {
                        title: 'Our Products - GemSphere AI Solutions',
                        keywords: 'AI Products, Business Automation, E-commerce Tools, Supply Chain Analytics, Data Analytics, Cybersecurity Tools, Cloud Platforms',
                        description: 'Explore GemSphere AI\'s innovative product suite including GemAI Core, SecureSphere, and detailed tools for e-commerce and supply chain management.'
                    },
                    'blog.html': {
                        title: 'Latest Insights - GemSphere AI Blog',
                        keywords: 'Tech Blog, AI Trends, Software Development News, IT Tips, Business Tech',
                        description: 'Stay updated with the latest trends in AI, software development, and technology business strategies on the GemSphere AI blog.'
                    },
                    'team.html': {
                        title: 'Meet Our Team - GemSphere AI',
                        keywords: 'GemSphere Team, IT Professionals, Developers, Leadership, Tech Experts',
                        description: 'Meet the expert team behind GemSphere AI. Our dedicated professionals are ready to deliver top-notch IT solutions for your business.'
                    },
                    'testimonial.html': {
                        title: 'Client Testimonials - GemSphere AI',
                        keywords: 'Client Reviews, Customer Feedback, IT Service Reviews, Success Stories',
                        description: 'Read what our clients say about us. GemSphere AI is trusted by businesses for delivering exceptional quality and results.'
                    },
                    'contact.html': {
                        title: 'Contact Us - GemSphere AI',
                        keywords: 'Contact GemSphere AI, Hire Developers, IT Support, Business Inquiry, Bengaluru Office',
                        description: 'Get in touch with GemSphere AI. We are here to answer your questions and discuss how we can help your business grow.'
                    },
                    '404.html': {
                        title: 'Page Not Found - GemSphere AI',
                        keywords: '404, Page Not Found',
                        description: 'The page you are looking for does not exist. Return to GemSphere AI homepage.'
                    },
                    'cookie-policy.html': {
                        title: 'Cookie Policy - GemSphere AI',
                        keywords: 'Cookie Policy, Privacy, Data Usage, Tracking',
                        description: 'Learn how GemSphere AI uses cookies to improve your experience.'
                    },
                    'privacy-policy.html': {
                        title: 'Privacy Policy - GemSphere AI',
                        keywords: 'Privacy Policy, Data Protection, User Data, Security',
                        description: 'Read our Privacy Policy to understand how GemSphere AI collects and uses your data.'
                    },
                    'terms-of-use.html': {
                        title: 'Terms of Use - GemSphere AI',
                        keywords: 'Terms of Use, Legal Agreements, User Rights',
                        description: 'Review the Terms of Use for accessing and using GemSphere AI services.'
                    },
                    'faq.html': {
                        title: 'Frequently Asked Questions - GemSphere AI',
                        keywords: 'FAQ, Support, Help, Common Questions',
                        description: 'Find answers to common questions about GemSphere AI services and support.'
                    },
                    'pricing.html': {
                        title: 'Pricing Plans - GemSphere AI',
                        keywords: 'Pricing, Cost, Plans, Startup, Enterprise',
                        description: 'Flexible pricing plans for businesses of all sizes.'
                    },
                    'careers.html': {
                        title: 'Careers - GemSphere AI',
                        keywords: 'Careers, Jobs, Hiring, AI Jobs, Tech Jobs',
                        description: 'Join the GemSphere AI team and build the future of technology.'
                    },
                    'project-detail.html': {
                        title: 'Project Details - GemSphere AI',
                        keywords: 'Case Study, Project, Success Story',
                        description: 'In-depth look at our successful projects and solutions.'
                    }
                };

                const meta = pageMeta[file] || pageMeta['index.html']; // Fallback to index if not found

                currentHeader = currentHeader.replace('<!-- TITLE -->', meta.title);
                currentHeader = currentHeader.replace('<!-- META_KEYWORDS -->', meta.keywords);
                currentHeader = currentHeader.replace('<!-- META_DESCRIPTION -->', meta.description);


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
                if (content.includes('<!-- TEAM_PARTIAL -->')) {
                    content = content.replace('<!-- TEAM_PARTIAL -->', teamTemplate);
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
});
