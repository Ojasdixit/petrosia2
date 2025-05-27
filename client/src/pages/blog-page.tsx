import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BlogList } from "@/components/blog/BlogList";
import { BlogCard } from "@/components/blog/BlogCard";
import { ChevronRight, Plus } from "lucide-react";

const BlogPage = () => {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Fetch all blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    select: (data) => {
      // Filter to only show approved posts (unless the user is an admin)
      if (user?.role === "admin") {
        return data;
      }
      return data.filter(post => post.approved);
    }
  });

  // Get featured posts
  const featuredPosts = posts?.filter(post => post.featured) || [];
  const featuredIds = featuredPosts.map(post => post.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Blog</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Petrosia Blog</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover the latest tips, trends, and advice for pet owners. 
            Everything you need to know about pet care, training, and more.
          </p>
        </div>
        
        {user && (user.role === "admin" || user.role === "seller") && (
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => setLocation("/blog/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Write a Post
          </Button>
        )}
      </div>
      
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <BlogList 
          posts={posts || []} 
          loading={isLoading}
          emptyMessage="No blog posts found. Check back soon for new content!"
          featuredIds={featuredIds}
        />
      </div>
      
      {/* Admin-only section for managing posts */}
      {user?.role === "admin" && (
        <div className="mt-10 p-6 border border-dashed rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/blog/manage")}
            >
              Manage All Posts
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/blog/pending")}
            >
              Review Pending Posts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;