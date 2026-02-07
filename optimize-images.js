const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img');
const outputDir = path.join(__dirname, 'img/optimized');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(imgDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
            const inputPath = path.join(imgDir, file);
            const outputPath = path.join(outputDir, file);

            sharp(inputPath)
                .resize({ width: 1920, withoutEnlargement: true }) // Resize large images
                .toFormat('webp') // Convert to WebP
                .webp({ quality: 80 }) // Compress
                .toFile(outputPath)
                .then(() => {
                    console.log(`Optimized: ${file} -> ${outputPath}`);
                })
                .catch(err => {
                    console.error(`Error optimizing ${file}:`, err);
                });
        }
    });
});
