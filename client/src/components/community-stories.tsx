import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityStories() {
  const { data: stories, isLoading } = useQuery({
    queryKey: ["/api/stories/featured"],
    queryFn: api.getFeaturedStories,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-32" />
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-down">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Community Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into the rich tapestry of cultural heritage, traditional techniques, and the inspiring journeys of our artisan community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories?.map((story: any, index: number) => (
            <Card 
              key={story.id} 
              className="overflow-hidden border border-border shadow-md hover:shadow-2xl smooth-transition group animate-fade-in-scale"
              style={{ animationDelay: `${(index % 6) * 0.1}s` }}
              data-testid={`card-story-${story.id}`}
            >
              <div className="relative bg-muted overflow-hidden h-40">
                <img 
                  src={story.coverImage} 
                  alt={story.title} 
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-3 flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-accent/20 text-accent font-medium text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {story.category}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    <span data-testid={`text-story-date-${story.id}`}>
                      {formatDate(story.publishDate)}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-serif font-semibold mb-3 line-clamp-2 group-hover:text-primary smooth-transition" data-testid={`text-story-title-${story.id}`}>
                  {story.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed" data-testid={`text-story-excerpt-${story.id}`}>
                  {story.excerpt}
                </p>
                <Link href={`/community/stories/${story.id}`}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 smooth-transition" 
                    data-testid={`button-read-story-${story.id}`}
                  >
                    Read Story <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 smooth-transition" />
                  </Button>
                </Link>
              </CardContent>

            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-in-up">
          <Link href="/community">
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 smooth-transition shadow-md hover:shadow-lg hover:scale-105" 
              data-testid="button-read-more-stories"
            >
              Read More Stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
