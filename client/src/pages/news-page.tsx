import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Newspaper, Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet';
import { NewsArticle, NewsSource } from '@shared/schema';

const NewsPage = () => {
  const [activeSource, setActiveSource] = useState<NewsSource | 'all'>('all');
  
  const { 
    data: allNewsArticles, 
    isLoading, 
    error 
  } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getFilteredArticles = () => {
    if (!allNewsArticles) return [];
    if (activeSource === 'all') return allNewsArticles;
    return allNewsArticles.filter(article => article.source === activeSource);
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'petsworld':
        return 'PetMD';
      case 'dogexpress':
        return 'Dogster';
      case 'oliverpetcare':
        return 'The Spruce Pets';
      default:
        return 'News';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Pet Care News</h1>
          <p className="text-muted-foreground mt-2">Stay updated with the latest trends and tips in pet care</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="overflow-hidden h-[320px] animate-pulse">
              <div className="bg-muted h-40"></div>
              <CardHeader className="p-4">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent className="px-4 pb-2">
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !allNewsArticles) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Pet Care News</h1>
          <p className="text-red-500 mt-2">Failed to load news articles. Please try again later.</p>
        </div>
      </div>
    );
  }

  const filteredArticles = getFilteredArticles();

  return (
    <>
      <Helmet>
        <title>Pet Care News - Petrosia</title>
        <meta name="description" content="Stay updated with the latest pet care news, trends, and tips from trusted sources." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <Newspaper className="mr-2 h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Pet Care News</h1>
          </div>
          <p className="text-muted-foreground">Stay updated with the latest trends and tips in pet care</p>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setActiveSource(value as NewsSource | 'all')}>
          <div className="flex items-center mb-3">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mr-4">Filter by source:</span>
          </div>
          <TabsList>
            <TabsTrigger value="all">All Sources</TabsTrigger>
            <TabsTrigger value="dogexpress">Dogster</TabsTrigger>
            <TabsTrigger value="petsworld">PetMD</TabsTrigger>
            <TabsTrigger value="oliverpetcare">The Spruce Pets</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-10">
            <Newspaper className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">There are no articles available for this source.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
                {article.imageUrl ? (
                  <div 
                    className="h-44 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                  />
                ) : (
                  <div className="h-44 bg-muted flex items-center justify-center">
                    <Newspaper className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{getSourceLabel(article.source)}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <CardTitle className="text-base leading-tight line-clamp-2">
                    <a 
                      href={article.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {article.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="px-4 pb-2 flex-grow">
                  <CardDescription className="line-clamp-3">
                    {article.summary}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="px-4 pb-4 pt-2">
                  <a 
                    href={article.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Read full article
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewsPage;