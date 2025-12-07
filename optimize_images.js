const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img');

fs.readdir(imgDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            const inputFile = path.join(imgDir, file);
            const outputFile = path.join(imgDir, path.basename(file, ext) + '.webp');

            sharp(inputFile)
                .toFile(outputFile)
                .then(info => {
                    console.log(`Converted ${file} to WebP (${info.size} bytes)`);
                })
                .catch(err => {
                    console.error(`Error converting ${file}:`, err);
                });
        }
    });
});
