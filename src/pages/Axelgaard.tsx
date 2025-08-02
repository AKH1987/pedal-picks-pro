import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGitHubData } from "@/hooks/useGitHubData";
import { Github, ExternalLink, FileText, Calendar, User, Star, GitFork } from "lucide-react";
import { Link } from "react-router-dom";

const GITHUB_REPO = "AKH1987/pedal-picks-pro";

const Axelgaard = () => {
  const { data: repoData, isLoading, error } = useGitHubData(GITHUB_REPO);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Github className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg text-muted-foreground">Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild>
              <Link to="/">← Back to Main</Link>
            </Button>
            <h1 className="text-3xl font-bold">Axelgaard</h1>
          </div>
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Github className="w-5 h-5" />
                GitHub Repository Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Could not load data from repository: <code className="bg-muted px-2 py-1 rounded">{GITHUB_REPO}</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Error: {error}
              </p>
              <div className="mt-4">
                <Button variant="outline" asChild>
                  <a 
                    href={`https://github.com/${GITHUB_REPO}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to="/">← Back to Main</Link>
          </Button>
          <h1 className="text-3xl font-bold">Axelgaard</h1>
          <Badge variant="secondary" className="ml-auto">
            GitHub Data Only
          </Badge>
        </div>

        {/* Repository Info */}
        {repoData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  {repoData.name}
                  <Button variant="outline" size="sm" asChild className="ml-auto">
                    <a 
                      href={repoData.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {repoData.description && (
                  <p className="text-muted-foreground">{repoData.description}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{repoData.stargazers_count} stars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{repoData.forks_count} forks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{repoData.owner.login}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      {new Date(repoData.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {repoData.language && (
                  <div>
                    <Badge variant="outline">{repoData.language}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Repository Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Repository Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section displays live data from the GitHub repository.
                  No manual data entry is allowed - all content comes directly from GitHub.
                </p>
                
                {repoData.topics && repoData.topics.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {repoData.topics.map((topic: string) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Axelgaard;