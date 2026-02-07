const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img/optimized');
const outputFile = path.join(__dirname, 'image-dimensions.json');

fs.readdir(imgDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const dimensions = {};
    let processedCount = 0;
    const targetFiles = files.filter(f => f.match(/\.webp$/) && !f.startsWith('temp_'));

    if (targetFiles.length === 0) {
        console.log('No matching files found.');
        return;
    }

    targetFiles.forEach(file => {
        sharp(path.join(imgDir, file))
            .metadata()
            .then(metadata => {
                dimensions[file] = { width: metadata.width, height: metadata.height };
                processedCount++;
                if (processedCount === targetFiles.length) {
                    fs.writeFileSync(outputFile, JSON.stringify(dimensions, null, 2));
                    console.log('Dimensions saved to image-dimensions.json');
                }
            })
            .catch(err => {
                console.error(`Error getting metadata for ${file}:`, err);
                processedCount++;
            });
    });
});
