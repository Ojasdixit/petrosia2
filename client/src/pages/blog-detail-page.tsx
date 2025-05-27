import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost, BlogComment } from "@shared/schema";
import { useParams, Link, useLocation } from "wouter";
import { 
  ChevronRight, Calendar, Tag, ThumbsUp, MessageSquare, Share2, 
  Send, Copy, Facebook, Twitter, Linkedin, X
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const BlogDetailPage = () => {
  const params = useParams<{ slug: string }>();
  const [_, setLocation] = useLocation();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Ensure page is scrolled to top when component mounts
  useEffect(() => {
    // Force scroll to top for blog detail pages
    window.scrollTo(0, 0);
    
    // Detect Android back behavior
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.scrollTo(0, 0);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  const [shareUrl, setShareUrl] = useState('');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch blog post data directly by slug
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts/slug', params.slug],
    retry: 1,
  });
  
  // Like/unlike blog post mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!post || !user) return null;
      const res = await apiRequest('POST', `/api/blog-posts/${post.id}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts/slug', params.slug] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to like post: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!post || !user) return null;
      const res = await apiRequest('POST', `/api/blog-posts/${post.id}/comments`, { content });
      return await res.json();
    },
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts/slug', params.slug] });
      toast({
        title: "Success",
        description: "Your comment has been added",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Handle like button click
  const handleLike = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like this post",
        variant: "default",
      });
      setLocation('/auth');
      return;
    }
    likeMutation.mutate();
  };
  
  // Handle comment button click
  const handleCommentClick = () => {
    setShowComments(true);
    // Focus the comment input after a short delay to ensure it's visible
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };
  
  // Handle submitting a comment
  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to comment on this post",
        variant: "default",
      });
      setLocation('/auth');
      return;
    }
    
    commentMutation.mutate(commentText);
  };
  
  // Set up share URL when post data is available
  React.useEffect(() => {
    if (post) {
      setShareUrl(window.location.href);
    }
  }, [post]);
  
  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Post link copied to clipboard",
    });
  };
  
  const handleGoBack = () => {
    setLocation('/blog');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            <Skeleton className="h-4 w-24 inline-block" />
          </span>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-4" />
          
          <div className="flex items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <Skeleton className="h-60 w-full mb-6 rounded-lg" />
          
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack}>
            Return to Blog
          </Button>
        </div>
      </div>
    );
  }
  
  // Format the date
  const publishDate = post.publishedAt 
    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
    : format(new Date(post.createdAt), "MMMM d, yyyy");
  
  // Get the author's initials for avatar fallback
  const getAuthorInitials = () => {
    return "PA"; // Placeholder, will need to fetch actual author data
  };
  
  // Format the content with proper line breaks
  const formattedContent = post.content.split('\n').map((paragraph, index) => (
    <p key={index} className={`mb-4 ${paragraph.trim() === '' ? 'mb-6' : ''}`}>
      {paragraph}
    </p>
  ));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground" dangerouslySetInnerHTML={{ __html: post.title }}></span>
      </div>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: post.title }}></h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="Author" />
                <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">Petrosia Blog</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{publishDate}</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <>
                <div className="hidden md:block w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="rounded-lg overflow-hidden mb-8">
            {Array.isArray(post.images) && post.images.length > 0 ? (
              <img 
                src={post.images[0]} 
                alt={post.title}
                className="w-full max-h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 mb-3"
                    viewBox="0 0 512 512"
                    style={{ transform: 'rotate(45deg)' }}
                    fill="#ff6b00"
                  >
                    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
                  </svg>
                  <span className="text-2xl font-heading font-bold text-primary">
                    Petrosia
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="prose prose-lg max-w-none mb-10">
          {formattedContent}
        </div>
        
        <div className="border-t pt-6 flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex gap-4">
            <Button 
              variant={post.likedBy && user && (post.likedBy as number[]).includes(user.id) ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {post.likeCount ? `${post.likeCount} Likes` : 'Like'}
            </Button>
            
            <Button 
              variant={showComments ? "default" : "outline"} 
              size="sm"
              onClick={handleCommentClick}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {post.comments && (post.comments as BlogComment[]).length > 0 
                ? `${(post.comments as BlogComment[]).length} Comments` 
                : 'Comment'}
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Share this post</h4>
                  <p className="text-sm text-muted-foreground">
                    Share this blog post with your friends and followers
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Facebook className="h-4 w-4" />
                      </Button>
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title.replace(/<[^>]*>/g, ''))}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </a>
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            variant="ghost"
            onClick={handleGoBack}
          >
            Return to Blog
          </Button>
        </div>
        
        {/* Comments section */}
        {showComments && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <div className="space-y-4 mb-6">
              {/* Comment input */}
              <div className="flex flex-col gap-2">
                <Textarea
                  ref={commentInputRef}
                  placeholder="Write a comment..."
                  className="min-h-[100px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitComment} 
                    disabled={commentMutation.isPending || !commentText.trim()}
                    size="sm"
                  >
                    {commentMutation.isPending ? (
                      <>Posting...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Comment list */}
              {post.comments && (post.comments as BlogComment[]).length > 0 ? (
                <div className="space-y-4 pt-4">
                  {(post.comments as BlogComment[]).map((comment, index) => (
                    <Card key={comment.id || index} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.authorName.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium">{comment.authorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetailPage;