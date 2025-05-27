import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ChevronRight, Calendar, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPendingPage = () => {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Redirect non-admin users
  if (user?.role !== "admin") {
    setLocation("/blog");
    return null;
  }

  // Fetch pending blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    select: (data) => {
      return data.filter(post => !post.approved);
    }
  });

  // Approve post mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/admin/blog-posts/${id}/approve`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Post has been approved and published",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve post",
        variant: "destructive",
      });
    },
  });

  // Reject post mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/admin/blog-posts/${id}/reject`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Post has been rejected",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject post",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/blog" className="hover:text-primary transition-colors">
          Blog
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">Pending Posts</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Review Pending Posts</h1>
        <p className="text-muted-foreground max-w-2xl">
          Review and approve or reject user-submitted blog posts before they are published on the site.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden h-[580px]">
              <CardHeader className="pb-3">
                <Skeleton className="h-7 w-4/5 mb-2" />
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4 min-h-[380px]">
                <Skeleton className="h-40 w-full mb-4 rounded-md" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-4/6 mb-4" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Skeleton className="h-10 w-28 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Author ID: {post.authorId}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                {post.images && post.images.length > 0 && (
                  <div className="mb-4 rounded-md overflow-hidden">
                    <img 
                      src={post.images[0]} 
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.summary}
                </div>
                
                <div className="max-h-40 overflow-y-auto text-sm mb-4 border p-3 rounded-md bg-secondary/20">
                  <div className="font-medium mb-1">Preview content:</div>
                  <div className="line-clamp-6">
                    {post.content}
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button
                  onClick={() => handleApprove(post.id)}
                  className="flex-1 mr-2"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReject(post.id)}
                  className="flex-1 ml-2"
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">No pending posts</h3>
          <p className="text-muted-foreground mb-6">
            There are no blog posts waiting for approval at this time.
          </p>
          <Button onClick={() => setLocation("/blog")}>
            Return to Blog
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPendingPage;