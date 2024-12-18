import { DO_SPACES_KEY, DO_SPACES_SECRET, DO_FOLDER_NAME, DO_BUCKET_NAME, PRODUCTION } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import fs from 'node-fs';
import path from 'path';
import AWS from 'aws-sdk';

let uploadsDir = 'static/uploads';
if (PRODUCTION === 'true') { {
    uploadsDir = '/home/personal-site/static/uploads';
}

// place files you want to import through the `$lib` alias in this folder.
export const getSlug = (s => {
    return s.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
});

export const storeImages = async content => {
    const imageSources = [];
    const regex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        if (!match[1].includes(`https://${DO_BUCKET_NAME}.nyc3.digitaloceanspaces.com/${DO_FOLDER_NAME}`)) {
            imageSources.push(match[1]);
        }
    }

    const downloadImage = async (url, filepath) => {
        const response = await fetch(url);
        const buffer = await response.buffer();
        fs.writeFileSync(filepath, buffer);
    };

    const spacesEndpoint = new AWS.Endpoint('https://nyc3.digitaloceanspaces.com');
    const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: DO_SPACES_KEY,
        secretAccessKey: DO_SPACES_SECRET
    });

    const newImageLinks = await Promise.all(imageSources.map(async (src, index) => {
        const filename = `image_${uuidv4()}${path.extname(src)}`;
        const filepath = path.join(uploadsDir, filename);
        await downloadImage(src, filepath);

        const fileContent = fs.readFileSync(filepath);
        const params = {
            Bucket: DO_BUCKET_NAME,
            Key: `${DO_FOLDER_NAME}/${filename}`,
            Body: fileContent,
            ACL: 'public-read'
        };

        return new Promise((resolve, reject) => {
            s3.upload(params, function(err, data) {
                if (err) {
                    reject(new Error('Error uploading image: ' + err.message));
                } else {
                    console.log(`Image uploaded successfully at ${data.Location}`);
                    resolve(data.Location);
                }
            });
        });
    }));

    fs.readdir(uploadsDir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(uploadsDir, file), err => {
                if (err) throw err;
            });
        }
    });

    // Replace old image sources with new ones in the content
    let updatedContent = content;
    imageSources.forEach((src, index) => {
        updatedContent = updatedContent.replace(src, newImageLinks[index]);
    });

    return updatedContent;
}