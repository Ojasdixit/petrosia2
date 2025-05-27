import React from "react";
import { BlogPost } from "@shared/schema";
import { BlogCard } from "./BlogCard";

interface BlogListProps {
  posts: BlogPost[];
  loading: boolean;
  emptyMessage?: string;
  featuredIds?: number[];
}

export const BlogList: React.FC<BlogListProps> = ({ 
  posts, 
  loading, 
  emptyMessage = "No blog posts found",
  featuredIds = [] 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard 
          key={post.id} 
          post={post} 
          featured={featuredIds.includes(post.id)}
        />
      ))}
    </div>
  );
};