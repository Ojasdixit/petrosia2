import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BlogPost } from "@shared/schema";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { BlogPostForm } from "@/components/blog/BlogPostForm";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BlogNewPostPage = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if we're editing an existing post
  const isEditing = Boolean(params.id);
  
  // Fetch post data if editing
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts', params.id],
    enabled: isEditing,
  });
  
  // Create post mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsSubmitting(true);
      try {
        const response = await apiRequest('POST', '/api/blog-posts', data);
        return await response.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your blog post has been submitted for approval",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setLocation('/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update post mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsSubmitting(true);
      try {
        const response = await apiRequest('PUT', `/api/blog-posts/${params.id}`, data);
        return await response.json();
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your blog post has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setLocation('/blog');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmit = (data: any) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  
  // Redirect if user doesn't have permission
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'seller') {
      setLocation('/blog');
    }
  }, [user, setLocation]);
  
  // Redirect if trying to edit someone else's post (unless admin)
  useEffect(() => {
    if (isEditing && post && user) {
      if (post.authorId !== user.id && user.role !== 'admin') {
        toast({
          title: "Permission Denied",
          description: "You can only edit your own posts",
          variant: "destructive",
        });
        setLocation('/blog');
      }
    }
  }, [isEditing, post, user, setLocation, toast]);
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Please log in to create or edit blog posts.</p>
          <Button onClick={() => setLocation('/auth')}>
            Log In
          </Button>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">
          {isEditing ? 'Edit Post' : 'New Post'}
        </span>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isEditing ? 'Edit Blog Post' : 'Create a New Blog Post'}
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          {isEditing 
            ? 'Update your blog post content below.' 
            : 'Share your pet care knowledge and experiences with our community.'}
        </p>
      </div>
      
      <BlogPostForm 
        initialData={isEditing ? post : null}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isAdmin={user.role === 'admin'}
      />
    </div>
  );
};

export default BlogNewPostPage;