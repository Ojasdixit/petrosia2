import React from "react";
import { BlogPost } from "@shared/schema";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  // Format the date - show as "X days/hours ago"
  const formattedDate = post.publishedAt 
    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) 
    : "Not published yet";

  // Check if there's a cover image or use the Petrosia logo
  // Cast to array and handle nullish values safely
  let coverImage = "";
  if (Array.isArray(post.images) && post.images.length > 0) {
    coverImage = post.images[0];
  }

  // Get the author's initials for avatar fallback
  const getAuthorInitials = () => {
    return "PA"; // Placeholder, will need to fetch actual author data
  };

  return (
    <Card className={`overflow-hidden h-full transition-all duration-300 ${featured ? 'shadow-lg hover:shadow-xl' : 'shadow hover:shadow-md'}`}>
      <div className="relative">
        <div className="h-48 w-full overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 mb-2"
                  viewBox="0 0 512 512"
                  style={{ transform: 'rotate(45deg)' }}
                  fill="#ff6b00"
                >
                  <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
                </svg>
                <span className="text-xl font-heading font-bold text-primary">
                  Petrosia
                </span>
              </div>
            </div>
          )}
        </div>
        
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" alt="Author" />
              <AvatarFallback>{getAuthorInitials()}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">Petrosia Blog</span>
          </div>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <CardTitle className="line-clamp-2 text-lg" dangerouslySetInnerHTML={{ __html: post.title }}></CardTitle>
        <CardDescription className="line-clamp-2 mt-1">{post.summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Link href={`/blog/${post.slug}`} className="text-primary font-medium hover:underline text-sm">
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
};