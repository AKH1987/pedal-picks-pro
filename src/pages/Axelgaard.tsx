import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface RiderStar {
  rider: string;
  stars: string;
}

const Axelgaard = () => {
  const [articleStars, setArticleStars] = useState<RiderStar[]>([]);

  useEffect(() => {
    const savedStars = localStorage.getItem('articleStars');
    if (savedStars) {
      setArticleStars(JSON.parse(savedStars));
    }
  }, []);

  const renderStars = (stars: string) => {
    const starCount = parseInt(stars);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= starCount 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-muted-foreground"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{stars}/5</span>
      </div>
    );
  };

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
            Stjerne anmeldelser
          </Badge>
        </div>

        {/* Star Reviews */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Rytter anmeldelser
              </CardTitle>
            </CardHeader>
            <CardContent>
              {articleStars.length > 0 ? (
                <div className="space-y-4">
                  {articleStars
                    .sort((a, b) => parseInt(b.stars) - parseInt(a.stars))
                    .map((review, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="font-medium">{review.rider}</div>
                        {renderStars(review.stars)}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Ingen stjerne anmeldelser fundet.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Gå til "Picks" for at tilføje stjerne anmeldelser til rytterne.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Axelgaard;