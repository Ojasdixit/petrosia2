import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { ChevronRight, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const BlogManagePage = () => {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // Redirect non-admin users
  if (user?.role !== "admin") {
    setLocation("/blog");
    return null;
  }

  // Fetch all blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/blog-posts/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post has been deleted",
      });
      setPostToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  // Feature/unfeature post mutation
  const featureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const response = await apiRequest(
        "POST",
        `/api/admin/blog-posts/${id}/feature`,
        { featured }
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Post status updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update post status",
        variant: "destructive",
      });
    },
  });

  // Approve post mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "POST",
        `/api/admin/blog-posts/${id}/approve`
      );
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
      const response = await apiRequest(
        "POST",
        `/api/admin/blog-posts/${id}/reject`
      );
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

  const handleDeleteClick = (id: number) => {
    setPostToDelete(id);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete);
    }
  };

  const handleFeatureToggle = (id: number, currentStatus: boolean) => {
    featureMutation.mutate({ id, featured: !currentStatus });
  };

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    rejectMutation.mutate(id);
  };

  // Filter posts
  const approvedPosts = posts?.filter((post) => post.approved) || [];
  const pendingPosts = posts?.filter((post) => !post.approved) || [];

  const renderPostsTable = (postList: BlogPost[]) => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-6 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-36" />
          </TableCell>
          <TableCell>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }

    if (postList.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
            No posts found
          </TableCell>
        </TableRow>
      );
    }

    return postList.map((post) => (
      <TableRow key={post.id}>
        <TableCell className="font-medium">{post.title}</TableCell>
        <TableCell className="whitespace-nowrap">
          {post.tags && post.tags.length > 0 
            ? post.tags.slice(0, 2).map((tag, i) => (
                <Badge key={i} variant="outline" className="mr-1">
                  {tag}
                </Badge>
              ))
            : <span className="text-muted-foreground text-sm">No tags</span>
          }
          {post.tags && post.tags.length > 2 && (
            <Badge variant="outline">+{post.tags.length - 2}</Badge>
          )}
        </TableCell>
        <TableCell>
          {post.featured ? (
            <Badge variant="default" className="bg-primary">Featured</Badge>
          ) : (
            <Badge variant="outline">Regular</Badge>
          )}
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {post.publishedAt
            ? `Published ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}`
            : `Created ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}`}
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation(`/blog/edit/${post.id}`)}
              title="Edit post"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant={post.featured ? "default" : "outline"}
              size="icon"
              onClick={() => handleFeatureToggle(post.id, post.featured)}
              title={post.featured ? "Unfeature post" : "Feature post"}
              className={post.featured ? "bg-primary" : ""}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(post.id)}
              title="Delete post"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
              title="View post"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {!post.approved && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(post.id)}
                  className="ml-2"
                  title="Approve post"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(post.id)}
                  title="Reject post"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    ));
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
        <span className="font-medium text-foreground">Manage Posts</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Blog Posts</h1>
          <p className="text-muted-foreground max-w-2xl">
            Create, edit, and manage all blog posts. Control which posts are featured and published.
          </p>
        </div>

        <Button
          className="mt-4 md:mt-0"
          onClick={() => setLocation("/blog/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Posts ({posts?.length || 0})</TabsTrigger>
          <TabsTrigger value="published">Published ({approvedPosts.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingPosts.length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({posts?.filter(p => p.featured).length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderPostsTable(posts || [])}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderPostsTable(approvedPosts)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderPostsTable(pendingPosts)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderPostsTable(posts?.filter(p => p.featured) || [])}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={postToDelete !== null} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogManagePage;