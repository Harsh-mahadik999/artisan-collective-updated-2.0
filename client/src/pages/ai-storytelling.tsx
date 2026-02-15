import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, Wand2, Copy, Check, Sparkles, FileText, Share2, Loader, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface StoryGenerationResponse {
  description: string;
  captions: string[];
}

export default function AiStorytelling() {
  const [formData, setFormData] = useState({
    productName: "",
    craftType: "",
    heritage: "",
    artisanId: "",
  });
  const [generatedStory, setGeneratedStory] = useState<StoryGenerationResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: () => api.getArtisans(),
  });

  const { data: generations } = useQuery({
    queryKey: ["/api/ai/generations", formData.artisanId],
    queryFn: () => api.getArtisanGenerations(formData.artisanId),
    enabled: !!formData.artisanId,
  });

  const storyMutation = useMutation({
    mutationFn: (data: typeof formData) => api.generateStory(data),
    onSuccess: (response) => {
      setGeneratedStory(response);
      toast({
        title: "Story Generated!",
        description: "Your AI-powered product story is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!formData.productName || !formData.craftType || !formData.artisanId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    storyMutation.mutate(formData);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const craftTypes = [
    { value: "ceramics", label: "Ceramics & Pottery" },
    { value: "textiles", label: "Textiles & Weaving" },
    { value: "woodwork", label: "Woodworking" },
    { value: "jewelry", label: "Jewelry Making" },
    { value: "glasswork", label: "Glasswork" },
    { value: "metalwork", label: "Metalwork" },
    { value: "leatherwork", label: "Leatherwork" },
    { value: "basketry", label: "Basketry" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-accent/20 to-secondary/20 relative overflow-hidden">
        <div className="hero-pattern absolute inset-0 opacity-30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">AI-Powered Storytelling</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Transform Your Craft into Compelling Stories
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our AI understands the heritage and passion behind each handmade piece, creating authentic descriptions 
              and social media captions that connect with buyers and preserve your craft's cultural significance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary-foreground h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Upload & Describe</h3>
              <p className="text-sm text-muted-foreground">
                Share details about your craft and cultural heritage
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="text-accent-foreground h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">AI Generation</h3>
              <p className="text-sm text-muted-foreground">
                Our AI crafts authentic stories that honor your tradition
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="text-secondary-foreground h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Share & Connect</h3>
              <p className="text-sm text-muted-foreground">
                Use across platforms to reach appreciative audiences
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="generator" data-testid="tab-generator">Story Generator</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Generation History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form Section */}
              <Card className="shadow-xl border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wand2 className="h-5 w-5 text-primary" />
                    <span>AI Story Generator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 smooth-transition">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Drop your craft photos here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                    <Button variant="outline" className="mt-4" data-testid="button-upload-photos">
                      Choose Files
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="artisanSelect" className="text-sm font-medium text-foreground">
                        Select Artisan <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.artisanId} onValueChange={(value) => setFormData(prev => ({ ...prev, artisanId: value }))}>
                        <SelectTrigger className="mt-2" data-testid="select-artisan">
                          <SelectValue placeholder="Choose artisan profile..." />
                        </SelectTrigger>
                        <SelectContent>
                          {artisans?.map((artisan: any) => (
                            <SelectItem key={artisan.id} value={artisan.id}>
                              {artisan.name} - {artisan.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="productName" className="text-sm font-medium text-foreground">
                        Product Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="productName"
                        placeholder="e.g., Sunset Ceramic Bowl"
                        value={formData.productName}
                        onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
                        className="mt-2"
                        data-testid="input-product-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="craftType" className="text-sm font-medium text-foreground">
                        Craft Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.craftType} onValueChange={(value) => setFormData(prev => ({ ...prev, craftType: value }))}>
                        <SelectTrigger className="mt-2" data-testid="select-craft-type">
                          <SelectValue placeholder="Select craft type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {craftTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="heritage" className="text-sm font-medium text-foreground">
                        Cultural Heritage
                      </Label>
                      <Input
                        id="heritage"
                        placeholder="e.g., Traditional Portuguese azulejo techniques"
                        value={formData.heritage}
                        onChange={(e) => setFormData(prev => ({ ...prev, heritage: e.target.value }))}
                        className="mt-2"
                        data-testid="input-heritage"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional: Describe the cultural background or traditional techniques
                      </p>
                    </div>

                    <Button 
                      onClick={handleGenerate}
                      disabled={storyMutation.isPending}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition"
                      data-testid="button-generate-story"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      {storyMutation.isPending ? "Generating..." : "Generate Story & Captions"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="shadow-xl border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <span>Generated Content</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {storyMutation.isPending && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full opacity-25 animate-pulse"></div>
                        <Loader className="h-12 w-12 text-accent animate-spin relative" />
                      </div>
                      <p className="text-center font-medium">Crafting your story...</p>
                      <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Our AI is analyzing your craft details and creating authentic, compelling content
                      </p>
                    </div>
                  )}
                  
                  {storyMutation.isError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Failed to generate story. Please check your settings and try again.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!generatedStory && !storyMutation.isPending ? (
                    <div className="text-center py-12">
                      <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Fill out the form and click "Generate" to create your AI-powered story
                      </p>
                    </div>
                  ) : generatedStory ? (
                    <div className="space-y-6 animate-in fade-in-50 duration-500">
                      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Check className="h-5 w-5 text-accent" />
                          <span className="font-medium text-sm text-accent">Story generated successfully!</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Copy any of the content below to use in your product listings or social media
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium text-foreground">Product Description</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedStory.description, -1)}
                            data-testid="button-copy-description"
                          >
                            {copiedIndex === -1 ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Textarea
                          value={generatedStory.description}
                          readOnly
                          className="min-h-24 bg-secondary/30"
                          data-testid="textarea-generated-description"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">
                          Social Media Captions
                        </Label>
                        <div className="space-y-3">
                          {generatedStory.captions.map((caption, index) => (
                            <div key={index} className="relative group">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground font-medium">
                                  Caption {index + 1} {index === 0 && <span className="ml-2 text-xs text-primary">(Inspirational)</span>}
                                  {index === 1 && <span className="ml-2 text-xs text-accent">(Storytelling)</span>}
                                  {index === 2 && <span className="ml-2 text-xs text-secondary">(Product-Focused)</span>}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(caption, index)}
                                  data-testid={`button-copy-caption-${index}`}
                                >
                                  {copiedIndex === index ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                              <Textarea
                                value={caption}
                                readOnly
                                className="min-h-20 text-sm bg-secondary/30 group-hover:bg-secondary/50 smooth-transition"
                                data-testid={`textarea-caption-${index}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1" data-testid="button-save-story">
                          Save Story
                        </Button>
                        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition" data-testid="button-create-product">
                          Create Product Listing
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Your Generation History</CardTitle>
                </CardHeader>
                <CardContent>
                  {!formData.artisanId ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        Select an artisan to view their generation history
                      </p>
                    </div>
                  ) : generations?.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">
                        No stories generated yet for this artisan
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {generations?.map((generation: any) => (
                        <Card key={generation.id} className="p-4" data-testid={`card-generation-${generation.id}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold" data-testid={`text-generation-name-${generation.id}`}>
                              {generation.productName}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(generation.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                              {generation.craftType}
                            </span>
                            {generation.heritage && (
                              <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                                {generation.heritage}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {generation.generatedDescription}
                          </p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" data-testid={`button-view-generation-${generation.id}`}>
                              View Full Story
                            </Button>
                            <Button variant="ghost" size="sm" data-testid={`button-copy-generation-${generation.id}`}>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
