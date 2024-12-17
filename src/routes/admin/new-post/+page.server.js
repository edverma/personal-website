import { SECRET, DO_SPACES_KEY, DO_SPACES_SECRET, DO_FOLDER_NAME } from '$env/static/private';
import { insertPost } from '$lib/server/db.ts';
import { redirect } from '@sveltejs/kit';
import { getSlug } from '$lib';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

const storeImages = async content => {
    const imageSources = [];
    const regex = /!\[.*?\]\((.*?)\)/g;
    const doSpacesRegex = /https:\/\/nyc3.digitaloceanspaces.com/;
    let match;
    while ((match = regex.exec(content)) !== null) {
        if (!doSpacesRegex.test(match[1])) {
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
        const filepath = path.join('static/uploads', filename);
        await downloadImage(src, filepath);

        const fileContent = fs.readFileSync(filepath);
        const params = {
            Bucket: 'edverma',
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

    const directory = 'static/uploads';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
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

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const reqSecret = data.get('secret');
        if (reqSecret !== SECRET) {
            throw new Error('Unauthorized');
        }

        const title = data.get('title').trim();
        const tags = data.get('tags').trim();
        const description = data.get('description').trim();
        const img_src = data.get('img_src').trim();
        const content = await storeImages(data.get('content'));
        const slug = getSlug(title);

        await insertPost({ title, tags, description, slug, img_src, content });

        return redirect(303, '/admin');
    }
};
