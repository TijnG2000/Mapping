const express = require('express');
const path = require('path');
const ExifReader = require('exifreader');
const fs = require('fs').promises;
const sharp = require('sharp');

const app = express();
const PHOTOS_DIR = path.join(__dirname, 'photos', 'ground');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/photos', express.static(path.join(__dirname, 'photos')));


app.get('/photos/ground/:filename', async (req, res) => {
    try {
        const filePath = path.join(PHOTOS_DIR, req.params.filename);
        const imageBuffer = await fs.readFile(filePath);
        const compressedImage = await sharp(imageBuffer)
            .resize(150, 150)
            .jpeg({ quality: 20 })
            .toBuffer();
        
        res.set('Content-Type', 'image/jpeg');
        res.send(compressedImage);
    } catch (error) {
        console.error('Error serving ground photo:', error);
        res.status(404).send('Image not found');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/photos', async (req, res) => {
    try {
        const files = await fs.readdir(PHOTOS_DIR);
        
        const photos = await Promise.all(
            files
                .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
                .map(async file => {
                    const filePath = path.join(PHOTOS_DIR, file);
                    const imageBuffer = await fs.readFile(filePath);
                    const tags = ExifReader.load(imageBuffer);
                    
                    if (!tags.GPSLatitude || !tags.GPSLongitude) {
                        console.warn(`No GPS data for ${file}`);
                        return null;
                    }

                    try {
                        let latitude = parseFloat(tags.GPSLatitude.description.split(',')[0]);
                        let longitude = parseFloat(tags.GPSLongitude.description.split(',')[0]);

                        if (tags.GPSLatitudeRef?.value[0] === 'S') latitude = -latitude;
                        if (tags.GPSLongitudeRef?.value[0] === 'W') longitude = -longitude;

                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Invalid GPS data for ${file}`);
                            return null;
                        }

                        return {
                            url: `/photos/ground/${file}`,
                            latitude,
                            longitude
                        };
                    } catch (error) {
                        console.warn(`Error parsing GPS data for ${file}:`, error);
                        return null;
                    }
                })
        );
        
        const validPhotos = photos.filter(photo => photo !== null);
        console.log('Valid photos:', validPhotos);
        res.json(validPhotos);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});