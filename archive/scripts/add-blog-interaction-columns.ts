import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function addBlogInteractionColumns() {
  try {
    console.log("Adding blog interaction columns...");
    
    // Check if like_count column exists
    const likeCountExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'like_count'
      )
    `);
    
    if (!likeCountExists.rows[0].exists) {
      console.log("Adding like_count column to blog_posts table");
      await db.execute(sql`
        ALTER TABLE blog_posts
        ADD COLUMN like_count INTEGER NOT NULL DEFAULT 0
      `);
    } else {
      console.log("like_count column already exists, skipping");
    }
    
    // Check if liked_by column exists
    const likedByExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'liked_by'
      )
    `);
    
    if (!likedByExists.rows[0].exists) {
      console.log("Adding liked_by column to blog_posts table");
      await db.execute(sql`
        ALTER TABLE blog_posts
        ADD COLUMN liked_by JSONB DEFAULT '[]'
      `);
    } else {
      console.log("liked_by column already exists, skipping");
    }
    
    // Check if comments column exists
    const commentsExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'blog_posts'
        AND column_name = 'comments'
      )
    `);
    
    if (!commentsExists.rows[0].exists) {
      console.log("Adding comments column to blog_posts table");
      await db.execute(sql`
        ALTER TABLE blog_posts
        ADD COLUMN comments JSONB DEFAULT '[]'
      `);
    } else {
      console.log("comments column already exists, skipping");
    }
    
    console.log("Blog interaction columns added successfully");
  } catch (error) {
    console.error("Error adding blog interaction columns:", error);
    throw error;
  }
}

addBlogInteractionColumns().catch(console.error);