import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Tag, User, ArrowRight, BookOpen, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: "all", label: "All Stories", icon: BookOpen },
  { id: "Heritage", label: "Cultural Heritage", icon: Heart },
  { id: "Interview", label: "Artisan Interviews", icon: User },
  { id: "Techniques", label: "Craft Techniques", icon: Tag },
  { id: "Events", label: "Community Events", icon: Users },
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: stories, isLoading } = useQuery({
    queryKey: ["/api/stories"],
    queryFn: () => api.getStories(),
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: () => api.getArtisans(),
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

  const getAuthorName = (authorId: string | null) => {
    if (!authorId) return "Community";
    return artisans?.find((a: any) => a.id === authorId)?.name || "Unknown Author";
  };

  // Filter and sort stories
  const filteredStories = stories?.filter((story: any) => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  })?.sort((a: any, b: any) => {
    if (sortBy === "oldest") {
      return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
    }
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  }) || [];

  // Featured story (most recent)
  const featuredStory = stories?.[0];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-secondary/20 to-accent/20 relative overflow-hidden">
        <div className="hero-pattern absolute inset-0 opacity-30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Community Stories</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Stories of Craft & Culture
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Dive into the rich tapestry of artisan traditions, cultural heritage, and inspiring journeys 
              from our global community of craftspeople and culture enthusiasts.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search stories, artisans, or techniques..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
                data-testid="input-search-stories"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Story */}
        {featuredStory && !isLoading && (
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold mb-6">Featured Story</h2>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl smooth-transition" data-testid="card-featured-story">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredStory.coverImage} 
                    alt={featuredStory.title} 
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      <Tag className="h-3 w-3 mr-1" />
                      {featuredStory.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(featuredStory.publishDate)}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4" data-testid="text-featured-story-title">
                    {featuredStory.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed" data-testid="text-featured-story-excerpt">
                    {featuredStory.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>by {getAuthorName(featuredStory.authorId)}</span>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-read-featured">
                      Read Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Filters and Categories */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Browse Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                    data-testid={`button-category-${category.id}`}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold" data-testid="text-stories-count">
                {filteredStories.length} Stories Found
              </h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort-stories">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stories Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
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
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story: any) => (
                  <Card key={story.id} className="overflow-hidden border border-border hover:shadow-lg smooth-transition group" data-testid={`card-story-${story.id}`}>
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="w-full h-32 object-cover group-hover:scale-105 smooth-transition"
                    />
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          <Tag className="h-3 w-3 mr-1" />
                          {story.category}
                        </Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span data-testid={`text-story-date-${story.id}`}>
                            {formatDate(story.publishDate)}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-serif font-semibold mb-3 line-clamp-2" data-testid={`text-story-title-${story.id}`}>
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4" data-testid={`text-story-excerpt-${story.id}`}>
                        {story.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>by {getAuthorName(story.authorId)}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0" data-testid={`button-read-story-${story.id}`}>
                          Read <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 border-0">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-serif font-bold">Share Your Story</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Do you have a craft tradition, cultural heritage story, or artisan journey to share? 
                Join our community and help preserve the world's creative traditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-submit-story">
                  Submit Your Story
                </Button>
                <Button variant="outline" data-testid="button-join-community">
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
