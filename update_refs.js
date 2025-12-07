const fs = require('fs');
const path = require('path');

const dirs = [path.join(__dirname, 'src'), path.join(__dirname, 'src', 'partials')];

dirs.forEach(dir => {
    fs.readdir(dir, (err, files) => {
        if (err) return console.error(err);

        files.forEach(file => {
            if (path.extname(file) === '.html') {
                const filePath = path.join(dir, file);
                fs.readFile(filePath, 'utf8', (err, content) => {
                    if (err) return console.error(err);

                    // Replace .jpg, .jpeg, .png with .webp in src attributes
                    // Simple regex: src="img/filename.ext" -> src="img/filename.webp"

                    let newContent = content.replace(/(src=['"]img\/[^'"]+)\.(jpg|jpeg|png)(['"])/gi, '$1.webp$3');

                    // Also handle background-image: url(...) if present in inline styles
                    // newContent = newContent.replace(/(url\(['"]?img\/[^'"\)]+)\.(jpg|jpeg|png)(['"]?\))/gi, '$1.webp$3');

                    if (newContent !== content) {
                        fs.writeFile(filePath, newContent, (err) => {
                            if (err) console.error(err);
                            else console.log(`Updated ${file}`);
                        });
                    }
                });
            }
        });
    });
});
