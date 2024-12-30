import { DO_SPACES_KEY, DO_SPACES_SECRET, DO_FOLDER_NAME, DO_BUCKET_NAME } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import os from 'os';
import AWS from 'aws-sdk';

let uploadsDir = null;

export const get_header_image_markdown = async (img_src, slug) => {
    if (!img_src || !img_src.match(/^(http|https):\/\/[^ "]+$/)) {
        return '';
    }

    try {
        const headerImageLinks = await create_do_images([img_src]);
        const headerImageLink = headerImageLinks[0];
        const headerImageMarkdown = `![header image](${headerImageLink})\n\n`;
        return {headerImageLink, headerImageMarkdown};
    } catch (error) {
        console.error('Error creating header image:', error);
    }
}

export const create_and_replace_content_image_links = async content => {
    const imageSources = get_image_links(content);
    const newImageLinks = await create_do_images(imageSources);
    return replace_content(content, imageSources, newImageLinks);
}

export const get_image_links = content => {
    const imageSources = [];
    const regex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        if (!match[1].includes(`https://${DO_BUCKET_NAME}.nyc3.digitaloceanspaces.com/${DO_FOLDER_NAME}`)) {
            imageSources.push(match[1]);
        }
    }
    return imageSources;
}

export const create_do_images = async imageSources => {
    // Skip processing if no images
    if (!imageSources || imageSources.length === 0) {
        return [];
    }

    try {
        // Create temp directory
        uploadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uploads-'));
        
        // Ensure directory exists
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const getFileExtension = async (url, response) => {
            const contentType = response.headers.get('content-type');
            if (!contentType) return '';
            
            const mimeToExt = {
                'image/jpeg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp',
                'image/svg+xml': '.svg'
            };
            
            return mimeToExt[contentType.split(';')[0]] || path.extname(url) || '';
        };

        const downloadImage = async (url, filepath) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
                const buffer = await response.buffer();
                fs.writeFileSync(filepath, buffer);
                return response;
            } catch (error) {
                console.error(`Error downloading image from ${url}:`, error);
                throw error;
            }
        };

        const spacesEndpoint = new AWS.Endpoint('https://nyc3.digitaloceanspaces.com');
        const s3 = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: DO_SPACES_KEY,
            secretAccessKey: DO_SPACES_SECRET
        });

        const newImageLinks = await Promise.all(imageSources.map(async (src, index) => {
            const response = await fetch(src); // First fetch to get content type
            const extension = await getFileExtension(src, response);
            const filename = `image_${uuidv4()}${extension}`;
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

        return newImageLinks;
    } catch (error) {
        console.error('Error in create_do_images:', error);
        throw error;
    } finally {
        // Clean up the temporary directory and its contents
        if (uploadsDir && fs.existsSync(uploadsDir)) {
            try {
                const files = fs.readdirSync(uploadsDir);
                for (const file of files) {
                    fs.unlinkSync(path.join(uploadsDir, file));
                }
                fs.rmdirSync(uploadsDir);
            } catch (error) {
                console.error('Error cleaning up temporary directory:', error);
            }
        }
    }
}

export const replace_content = async (content, imageSources, newImageLinks) => {
    let updatedContent = content;
    imageSources.forEach((src, index) => {
        updatedContent = updatedContent.replace(src, newImageLinks[index]);
    });

    return updatedContent;
}