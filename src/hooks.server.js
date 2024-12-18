import { query } from '$lib/server/db';

initializeDatabase().catch(console.error);

async function initializeDatabase() {
    await query(`
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            img_src VARCHAR(512) NOT NULL,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            content TEXT NOT NULL,
            email_sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    `);

    await query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_posts_updated_at') THEN
                CREATE TRIGGER update_posts_updated_at
                BEFORE UPDATE ON posts
                FOR EACH ROW
                EXECUTE PROCEDURE update_updated_at_column();
            END IF;
        END;
        $$;
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(512) NOT NULL,
            slug VARCHAR(512) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tags_updated_at') THEN
                CREATE TRIGGER update_tags_updated_at
                BEFORE UPDATE ON tags
                FOR EACH ROW
                EXECUTE PROCEDURE update_updated_at_column();
            END IF;
        END;
        $$;
    `);

    await query(`
        CREATE TABLE IF NOT EXISTS post_tags (
            id SERIAL PRIMARY KEY,
            post_id INT NOT NULL REFERENCES posts(id),
            tag_id INT NOT NULL REFERENCES tags(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_post_tag_unique ON post_tags (post_id, tag_id);
    `);

    await query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_post_tags_updated_at') THEN
                CREATE TRIGGER update_post_tags_updated_at
                BEFORE UPDATE ON post_tags
                FOR EACH ROW
                EXECUTE PROCEDURE update_updated_at_column();
            END IF;
        END;
        $$;
    `);
}
