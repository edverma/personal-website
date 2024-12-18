import {POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_SSL_MODE} from '$env/static/private';
import pkg from 'pg';
import { getSlug } from '$lib';
const { Pool } = pkg;

const ssl = POSTGRES_SSL_MODE === 'require' ? {
  rejectUnauthorized: false,
  mode: POSTGRES_SSL_MODE,
} : false;

const pool = new Pool({
  user: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT),
  database: POSTGRES_DATABASE,
  ssl: ssl
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getPosts(tags: string[]) {
  let queryText = `
      SELECT posts.id, posts.title, posts.description, posts.slug, posts.email_sent, 
             posts.created_at, posts.updated_at,
             array_agg(tags.slug) AS tags
      FROM posts
      LEFT JOIN post_tags ON posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
    `;

    if (tags && tags.length > 0) {
        queryText += `
        WHERE tags.slug = ANY($1)
        GROUP BY posts.id
        HAVING COUNT(DISTINCT tags.id) = $2
        ORDER BY posts.created_at DESC
        `;
    } else {
        queryText += `
        GROUP BY posts.id
        ORDER BY posts.created_at DESC
        `;
    }

    const result = await query(queryText, tags && tags.length > 0 ? [tags, tags.length] : []);
    return result.rows;
}

export async function insertPost({ title, tags, description, slug, img_src, content }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insert post (this part stays mostly the same)
    const insertPostText = `
      INSERT INTO posts (title, description, slug, img_src, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id
    `;
    const res = await client.query(insertPostText, [title, description, slug, img_src, content]);
    const postId = res.rows[0].id;

    // Insert tags and create relationships
    for (const tagName of tags.split(',')) {
      const trimmedTag = tagName.trim();
      const slugifiedTag = getSlug(trimmedTag);
      
      // Insert tag if it doesn't exist and get its ID
      const upsertTagText = `
        INSERT INTO tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO UPDATE SET name = $1
        RETURNING id
      `;
      const tagResult = await client.query(upsertTagText, [trimmedTag, slugifiedTag]);
      const tagId = tagResult.rows[0].id;

      // Create post_tags relationship
      const insertPostTagText = `
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ($1, $2)
      `;
      await client.query(insertPostTagText, [postId, tagId]);
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getPostBySlug(slug: string) {
  const queryText = `
    SELECT posts.*, array_agg(tags.name) as tags
    FROM posts
    LEFT JOIN post_tags ON posts.id = post_tags.post_id
    LEFT JOIN tags ON post_tags.tag_id = tags.id
    WHERE posts.slug = $1
    GROUP BY posts.id
  `;
    
  const result = await query(queryText, [slug]);
  return result.rows[0];
}

export async function updatePost(originalSlug: string, { title, tags, description, slug, img_src, content }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update post
    const updatePostText = `
      UPDATE posts
      SET title = $1, description = $2, slug = $3, img_src = $4, content = $5, updated_at = NOW()
      WHERE slug = $6
      RETURNING id
    `;
    const res = await client.query(updatePostText, [title, description, slug, img_src, content, originalSlug]);
    const postId = res.rows[0].id;

    // Delete existing post_tags relationships
    const deletePostTagsText = `
      DELETE FROM post_tags WHERE post_id = $1
    `;
    await client.query(deletePostTagsText, [postId]);

    // Insert or get tag IDs and create relationships
    for (const tagName of tags.split(',')) {
      const trimmedTag = tagName.trim();
      const slugifiedTag = trimmedTag.toLowerCase().replace(/\s+/g, '-');
      
      // Insert tag if it doesn't exist and get its ID
      const upsertTagText = `
        INSERT INTO tags (name, slug)
        VALUES ($1, $2)
        ON CONFLICT (slug) DO UPDATE SET name = $1
        RETURNING id
      `;
      const tagResult = await client.query(upsertTagText, [trimmedTag, slugifiedTag]);
      const tagId = tagResult.rows[0].id;

      // Create post_tags relationship
      const insertPostTagText = `
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, tag_id) DO NOTHING
      `;
      await client.query(insertPostTagText, [postId, tagId]);
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function setEmailSent(slug: string) {
  const queryText = `
    UPDATE posts SET email_sent = TRUE WHERE slug = $1
  `;
  await query(queryText, [slug]);
}

export async function deletePost(slug: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const getPostIdText = `
      SELECT id FROM posts WHERE slug = $1
    `;
    const res = await client.query(getPostIdText, [slug]);
    const postId = res.rows[0].id;

    // Delete post_tags relationships first
    const deletePostTagsText = `
      DELETE FROM post_tags WHERE post_id = $1
    `;
    await client.query(deletePostTagsText, [postId]);

    // Delete the post
    const deletePostText = `
      DELETE FROM posts WHERE slug = $1
    `;
    await client.query(deletePostText, [slug]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function getTags() {
  const queryText = `
    SELECT * FROM tags
  `;
  const result = await query(queryText);
  return result.rows;
}
