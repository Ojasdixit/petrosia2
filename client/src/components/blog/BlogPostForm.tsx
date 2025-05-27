import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, ImagePlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { BlogPost } from "@shared/schema";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(500, { message: "Title is too long" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }).max(300, { message: "Summary is too long" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
  publishNow: z.boolean().optional(),
  images: z.array(z.string()).optional()
});

type BlogPostFormProps = {
  initialData: BlogPost | null;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  isAdmin: boolean;
};

export const BlogPostForm = ({ initialData, onSubmit, isSubmitting, isAdmin }: BlogPostFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      summary: initialData.summary,
      content: initialData.content,
      tags: initialData.tags?.join(", ") || "",
      featured: initialData.featured || false,
      approved: initialData.approved || false,
      publishNow: Boolean(initialData.publishedAt),
      images: initialData.images || []
    } : {
      title: "",
      summary: "",
      content: "",
      tags: "",
      featured: false,
      approved: false,
      publishNow: false,
      images: []
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploadLoading(true);
    
    try {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("entity_type", "blog");
      
      // Upload image
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      
      const result = await response.json();
      
      // Add new image URL to state
      setImageUrls([...imageUrls, result.secure_url]);
      
      // Update form values
      form.setValue("images", [...imageUrls, result.secure_url]);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageUploadLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = imageUrls.filter((_, index) => index !== indexToRemove);
    setImageUrls(updatedImages);
    form.setValue("images", updatedImages);
  };

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Process tags string into an array
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    
    // Ensure summary is not longer than 200 characters
    const summary = data.summary.length > 200 
      ? data.summary.substring(0, 197) + '...' 
      : data.summary;
    
    // Prepare final data object
    const finalData = {
      ...data,
      summary,
      tags,
      images: imageUrls,
      // Add author id if creating a new post
      ...(initialData ? {} : { authorId: user?.id })
    };
    
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 max-w-3xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title (HTML links allowed)" {...field} className="text-lg" />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                You can include hyperlinks using HTML, for example: 
                &lt;a href="https://example.com" target="_blank"&gt;Link text&lt;/a&gt;
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a brief summary of your post" 
                  {...field} 
                  className="resize-none h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your blog post content here" 
                  {...field} 
                  className="min-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter tags separated by commas (e.g. dogs, training, health)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Images</h3>
          
          {/* Image Gallery */}
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group rounded-md overflow-hidden border">
                  <img 
                    src={url} 
                    alt={`Blog post image ${index + 1}`} 
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Image Upload */}
          <div className="flex items-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-secondary/50 transition-colors">
                {imageUploadLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                <span>Add Image</span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploadLoading}
              />
            </label>
          </div>
        </div>
        
        {/* Admin only controls */}
        {isAdmin && (
          <div className="p-4 bg-secondary/30 rounded-lg space-y-4">
            <h3 className="font-medium">Admin Controls</h3>
            
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Feature this post</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="approved"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Approve this post</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="publishNow"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Publish now</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Post" : "Submit Post"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};