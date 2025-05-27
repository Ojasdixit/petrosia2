import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Award, Sparkles, PawPrint, Heart, Rocket, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { NewsArticle } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { TypographyH2, TypographyP } from '@/components/ui/typography';

const NewsSection = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const { 
    data: newsArticles, 
    isLoading, 
    error 
  } = useQuery<NewsArticle[]>({
    queryKey: ['/api/news/latest/12'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Helper functions for article categorization
  const isStartupNews = (article: NewsArticle): boolean => {
    return article.categories?.some(cat => 
      cat.toLowerCase().includes('startup') || 
      cat.toLowerCase().includes('business') || 
      cat.toLowerCase().includes('tech')
    ) || article.title.toLowerCase().includes('startup') || 
    article.title.toLowerCase().includes('launch') ||
    article.title.toLowerCase().includes('company');
  };
  
  const isWelfareStory = (article: NewsArticle): boolean => {
    return article.categories?.some(cat => 
      cat.toLowerCase().includes('welfare') || 
      cat.toLowerCase().includes('rescue') || 
      cat.toLowerCase().includes('adoption')
    ) || article.title.toLowerCase().includes('rescue') || 
    article.title.toLowerCase().includes('welfare') ||
    article.title.toLowerCase().includes('shelter');
  };
  
  const isAdventureStory = (article: NewsArticle): boolean => {
    return article.categories?.some(cat => 
      cat.toLowerCase().includes('adventure') || 
      cat.toLowerCase().includes('travel') || 
      cat.toLowerCase().includes('outdoor')
    ) || article.title.toLowerCase().includes('adventure') || 
    article.title.toLowerCase().includes('trip') ||
    article.title.toLowerCase().includes('journey');
  };
  
  const isPetrosiaStory = (article: NewsArticle): boolean => {
    return article.title.toLowerCase().includes('petrosia') || 
    article.content.toLowerCase().includes('petrosia');
  };

  if (isLoading) {
    return (
      <div className="mt-4 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Newspaper className="mr-2 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Pet Community News</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
      </div>
    );
  }

  if (error || !newsArticles || newsArticles.length === 0) {
    return null; // Don't show section if there's an error or no data
  }
  
  // Filter articles based on selected category
  const filteredArticles = newsArticles.filter(article => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'startup' && isStartupNews(article)) return true;
    if (activeFilter === 'welfare' && isWelfareStory(article)) return true;
    if (activeFilter === 'adventure' && isAdventureStory(article)) return true;
    if (activeFilter === 'petrosia' && isPetrosiaStory(article)) return true;
    if (activeFilter === 'care' && !isStartupNews(article) && !isWelfareStory(article) 
        && !isAdventureStory(article) && !isPetrosiaStory(article)) return true;
    return false;
  }).slice(0, 6); // Limit to 6 articles for display

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'petsworld':
        return 'PetMD';
      case 'dogexpress':
        return 'Dogster';
      case 'oliverpetcare':
        return 'The Spruce Pets';
      case 'other':
        return 'Petrosia';
      default:
        return 'News';
    }
  };
  
  // Get icon based on article type
  const getArticleIcon = (article: NewsArticle) => {
    if (isPetrosiaStory(article)) return <Award className="h-4 w-4 text-amber-500" />;
    if (isStartupNews(article)) return <Rocket className="h-4 w-4 text-purple-500" />;
    if (isWelfareStory(article)) return <Heart className="h-4 w-4 text-red-500" />;
    if (isAdventureStory(article)) return <Sparkles className="h-4 w-4 text-blue-500" />;
    return <PawPrint className="h-4 w-4 text-emerald-500" />;
  };

  return (
    <div className="py-12 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <TypographyH2 className="flex items-center justify-center gap-2 mb-2">
            <span className="text-primary">Discover</span> Pet News & Stories
          </TypographyH2>
          <TypographyP className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated on all the latest happenings in the pet world
          </TypographyP>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            className="rounded-full"
            onClick={() => setActiveFilter('all')}
          >
            All News
          </Button>
          <Button 
            variant={activeFilter === 'petrosia' ? 'default' : 'outline'} 
            className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
            onClick={() => setActiveFilter('petrosia')}
          >
            <Award className="h-4 w-4 mr-2" /> Petrosia Stories
          </Button>
          <Button 
            variant={activeFilter === 'startup' ? 'default' : 'outline'} 
            className="rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
            onClick={() => setActiveFilter('startup')}
          >
            <Rocket className="h-4 w-4 mr-2" /> Pet Startups
          </Button>
          <Button 
            variant={activeFilter === 'welfare' ? 'default' : 'outline'} 
            className="rounded-full bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
            onClick={() => setActiveFilter('welfare')}
          >
            <Heart className="h-4 w-4 mr-2" /> Animal Welfare
          </Button>
          <Button 
            variant={activeFilter === 'adventure' ? 'default' : 'outline'} 
            className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
            onClick={() => setActiveFilter('adventure')}
          >
            <Sparkles className="h-4 w-4 mr-2" /> Pet Adventures
          </Button>
          <Button 
            variant={activeFilter === 'care' ? 'default' : 'outline'} 
            className="rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
            onClick={() => setActiveFilter('care')}
          >
            <PawPrint className="h-4 w-4 mr-2" /> Pet Care
          </Button>
        </div>
        
        {filteredArticles.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <Newspaper className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No articles found for this category.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setActiveFilter('all')}
            >
              View all news
            </Button>
          </div>
        ) : (
          <>
            {/* First featured article - larger */}
            {filteredArticles.length > 0 && (
              <div className="mb-8">
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="grid md:grid-cols-5">
                    <div 
                      className="md:col-span-3 h-64 md:h-auto bg-cover bg-center" 
                      style={{ 
                        backgroundImage: `url(${filteredArticles[0].imageUrl || 
                          (isPetrosiaStory(filteredArticles[0]) ? 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg' : 
                          isStartupNews(filteredArticles[0]) ? 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg' : 
                          isWelfareStory(filteredArticles[0]) ? 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg' : 
                          isAdventureStory(filteredArticles[0]) ? 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg' : 
                          'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg')
                        })` 
                      }}
                    />
                    <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={`px-3 py-1 ${
                            isPetrosiaStory(filteredArticles[0]) ? 'bg-amber-100 text-amber-800' : 
                            isStartupNews(filteredArticles[0]) ? 'bg-purple-100 text-purple-800' : 
                            isWelfareStory(filteredArticles[0]) ? 'bg-red-100 text-red-800' : 
                            isAdventureStory(filteredArticles[0]) ? 'bg-blue-100 text-blue-800' : 
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {getArticleIcon(filteredArticles[0])}
                            <span className="ml-1 uppercase text-xs font-semibold tracking-wider">
                              {isPetrosiaStory(filteredArticles[0]) ? 'Petrosia' : 
                               isStartupNews(filteredArticles[0]) ? 'Pet Startups' : 
                               isWelfareStory(filteredArticles[0]) ? 'Animal Welfare' : 
                               isAdventureStory(filteredArticles[0]) ? 'Pet Adventures' : 
                               'Pet Care'}
                            </span>
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(filteredArticles[0].publishedAt), 'dd MMM yyyy')}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          <a 
                            href={filteredArticles[0].sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {filteredArticles[0].title}
                          </a>
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {filteredArticles[0].summary}
                        </p>
                      </div>
                      <a 
                        href={filteredArticles[0].sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center text-sm font-medium"
                      >
                        Read full article <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {/* Rest of the articles in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.slice(1).map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all"
                >
                  <div 
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${article.imageUrl || 
                      (isPetrosiaStory(article) ? 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg' : 
                      isStartupNews(article) ? 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg' : 
                      isWelfareStory(article) ? 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg' : 
                      isAdventureStory(article) ? 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg' : 
                      'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg')
                    })` }}
                  >
                    <div className="absolute top-3 left-3">
                      <Badge className={`px-2 py-1 ${
                        isPetrosiaStory(article) ? 'bg-amber-500 text-white' : 
                        isStartupNews(article) ? 'bg-purple-500 text-white' : 
                        isWelfareStory(article) ? 'bg-red-500 text-white' : 
                        isAdventureStory(article) ? 'bg-blue-500 text-white' : 
                        'bg-emerald-500 text-white'
                      }`}>
                        {isPetrosiaStory(article) ? 'STORIES' : 
                         isStartupNews(article) ? 'STARTUP' : 
                         isWelfareStory(article) ? 'WELFARE' : 
                         isAdventureStory(article) ? 'ADVENTURE' : 
                         'PET CARE'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(article.publishedAt), 'dd MMM yyyy')}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {getSourceLabel(article.source)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      <a 
                        href={article.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </a>
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                    
                    <a 
                      href={article.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center text-sm"
                    >
                      Read more <ChevronRight className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-10 text-center">
          <Link href="/news">
            <Button variant="outline" className="rounded-full px-6">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;