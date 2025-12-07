const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img');
const archiveDir = path.join(imgDir, 'archive');

if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
}

fs.readdir(imgDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            const basename = path.basename(file, ext);
            const webpFile = basename + '.webp';

            // Check if WebP version exists before moving
            if (fs.existsSync(path.join(imgDir, webpFile))) {
                const oldPath = path.join(imgDir, file);
                const newPath = path.join(archiveDir, file);

                fs.rename(oldPath, newPath, (err) => {
                    if (err) console.error(`Error moving ${file}:`, err);
                    else console.log(`Archived ${file}`);
                });
            } else {
                console.log(`Skipping ${file} - No WebP version found`);
            }
        }
    });
});
