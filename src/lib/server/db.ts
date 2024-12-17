import {POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_SSL_MODE} from '$env/static/private';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT),
  database: POSTGRES_DATABASE,
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
      SELECT posts.id, posts.title, posts.description, posts.slug, posts.created_at, posts.updated_at,
             array_agg(tags.tag) AS tags
      FROM posts
      LEFT JOIN tags ON posts.id = tags.post_id
    `;
    
    if (tags && tags.length > 0) {
        queryText += `
        WHERE tags.tag = ANY($1)
        GROUP BY posts.id
        HAVING COUNT(DISTINCT tags.tag) = $2
        `;
    } else {
        queryText += `
        GROUP BY posts.id
        `;
    }

    const result = await query(queryText, tags && tags.length > 0 ? [tags, tags.length] : []);
    return result.rows;
}

export async function insertPost({ title, tags, description, slug, img_src, content }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertPostText = `
      INSERT INTO posts (title, description, slug, img_src, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id
    `;
    const res = await client.query(insertPostText, [title, description, slug, img_src, content]);
    const postId = res.rows[0].id;

    const insertTagText = `
      INSERT INTO tags (post_id, tag)
      VALUES ($1, $2)
    `;
    for (const tag of tags.split(',')) {
      await client.query(insertTagText, [postId, tag.trim()]);
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
    SELECT posts.*, array_agg(tags.tag) as tags
    FROM posts
    LEFT JOIN tags ON posts.id = tags.post_id
    WHERE posts.slug = $1
    GROUP BY posts.id
  `;
    
  const result = await query(queryText, [slug]);
  return result.rows[0];
}
