import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Trophy, Clock, Star, Users, Calendar, Target } from "lucide-react";
import cyclingHero from "@/assets/cycling-hero.jpg";

const FIXED_PLAYERS = ["Anders", "Dennis", "Emil", "Christian", "Tobias", "Mathias", "Isak"];
const MAX_5_STAR_PICKS = 5;
const MAX_TOP8_PICKS = 4;
const TOP8_LIST = [
  "Tadej Pogacar", "Remco Evenepoel", "Jasper Disaster", "Ben O'Connor",
  "Mathieu Van der Poel", "Marc Hirschi", "Jonas Vingegaard", "Primoz Roglic"
];

interface RiderPick {
  name: string;
  stars: string;
  auto: boolean;
}

interface ArticleStar {
  rider: string;
  stars: string;
}

interface Race {
  name: string;
  date: string;
  results: string[];
  picks: Record<string, RiderPick>;
  autoPicksDone: boolean;
}

export default function Index() {
  const [riderPicks, setRiderPicks] = useState<RiderPick[]>([]);
  const [newPick, setNewPick] = useState("");
  const [stars, setStars] = useState("");
  const [articleStars, setArticleStars] = useState<ArticleStar[]>([]);
  const [rider, setRider] = useState("");
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [selectedRaces, setSelectedRaces] = useState<Race[]>([]);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddRace = () => {
    if (raceName && raceDate) {
      setSelectedRaces([...selectedRaces, {
        name: raceName,
        date: raceDate,
        results: [],
        picks: {},
        autoPicksDone: false
      }]);
      setRaceName("");
      setRaceDate("");
    }
  };

  const getNextPicker = (race: Race): string | null => {
    for (let p of FIXED_PLAYERS) {
      if (!race.picks[p]) return p;
    }
    return null;
  };

  const getCountdown = (raceDate: string): string => {
    try {
      const raceStart = parseISO(raceDate);
      const deadline = new Date(raceStart.getTime() - 90 * 60 * 1000);
      return formatDistanceToNowStrict(deadline, { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  const fetchSimulatedPCSResults = (raceIndex: number): void => {
    const sampleFinishers = [
      "Jonas Vingegaard", "Remco Evenepoel", "Tadej Pogacar",
      "Mads Pedersen (DK)", "Primoz Roglic"
    ];
    const updatedRaces = [...selectedRaces];
    updatedRaces[raceIndex].results = sampleFinishers;
    setSelectedRaces(updatedRaces);
  };

  const triggerAutoPicks = (raceIndex: number): void => {
    const updatedRaces = [...selectedRaces];
    const race = updatedRaces[raceIndex];
    FIXED_PLAYERS.forEach(player => {
      if (!race.picks[player]) {
        const available = articleStars
          .filter(r => !Object.values(race.picks).some(p => p.name === r.rider))
          .sort((a, b) => parseInt(a.stars) - parseInt(b.stars));
        if (available.length > 0) {
          race.picks[player] = { name: available[0].rider, stars: available[0].stars, auto: true };
        }
      }
    });
    race.autoPicksDone = true;
    setSelectedRaces(updatedRaces);
  };

  const calculatePoints = (riderName: string, race: Race): number => {
    const position = race.results.indexOf(riderName);
    if (position === -1) return 0;
    let basePoints = [6, 4, 3, 2, 1][position] || 0;
    let bonus = 0;
    const ratingEntry = articleStars.find(e => e.rider === riderName);
    const rating = ratingEntry ? parseInt(ratingEntry.stars) : null;
    if (rating === 5) basePoints -= 1;
    else if (rating === 2) bonus = 1;
    else if (rating === 1) bonus = 2;
    else if (rating === 0 || rating == null) bonus = 3;
    if (riderName.includes("(DK)")) bonus += 1;
    return basePoints + bonus;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-cycling overflow-hidden">
        <img 
          src={cyclingHero} 
          alt="Professional cycling race" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2 drop-shadow-lg">
              Cykelspil App
            </h1>
            <p className="text-lg text-primary-foreground/90 drop-shadow-md">
              Professionel cykelkonkurrence management
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6 -mt-8 relative z-20">
        <Tabs defaultValue="races" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card shadow-card">
            <TabsTrigger value="races" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Løb
            </TabsTrigger>
            <TabsTrigger value="picks" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Picks
            </TabsTrigger>
            <TabsTrigger value="stars" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Axelgaard
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Resultater
            </TabsTrigger>
          </TabsList>

          <TabsContent value="races" className="space-y-6 animate-slide-up">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Opret nyt løb
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="raceName">Løbsnavn</Label>
                  <Input 
                    id="raceName"
                    value={raceName} 
                    onChange={(e) => setRaceName(e.target.value)} 
                    placeholder="F.eks. Tour de France - Etape 5"
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raceDate">Startdato og tidspunkt</Label>
                  <Input 
                    id="raceDate"
                    type="datetime-local" 
                    value={raceDate} 
                    onChange={(e) => setRaceDate(e.target.value)}
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                <Button 
                  onClick={handleAddRace} 
                  className="w-full bg-gradient-cycling hover:opacity-90 transition-all duration-300"
                  disabled={!raceName || !raceDate}
                >
                  Tilføj løb
                </Button>
              </CardContent>
            </Card>

            {selectedRaces.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    Aktive løb ({selectedRaces.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedRaces.map((race, i) => (
                    <div key={i} className="border border-border p-4 rounded-lg bg-muted/30 transition-all duration-300 hover:shadow-card">
                      <h3 className="font-semibold text-lg mb-2">{race.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Næste: <strong className="text-foreground">{getNextPicker(race) || "Alle har valgt"}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Deadline: <strong className="text-foreground">{getCountdown(race.date)}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="picks" className="space-y-6 animate-slide-up">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Tilføj nyt valg
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPick">Rytternavn</Label>
                  <Input 
                    id="newPick"
                    placeholder="Rytternavn" 
                    value={newPick} 
                    onChange={(e) => setNewPick(e.target.value)}
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickStars">Stjerner fra Axelgaard (0-5)</Label>
                  <Input 
                    id="pickStars"
                    placeholder="Stjerner fra Axelgaard (0-5)" 
                    value={stars} 
                    onChange={(e) => setStars(e.target.value)}
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}
                <Button 
                  className="w-full bg-gradient-cycling hover:opacity-90 transition-all duration-300"
                  onClick={() => {
                    const fiveStarCount = riderPicks.filter(p => p.stars === "5").length;
                    const top8Count = riderPicks.filter(p => TOP8_LIST.includes(p.name)).length;
                    if (fiveStarCount >= MAX_5_STAR_PICKS && stars === "5") {
                      setError("Du har allerede brugt dine 5 tilladte 5-stjernede valg.");
                      return;
                    }
                    if (TOP8_LIST.includes(newPick) && top8Count >= MAX_TOP8_PICKS) {
                      setError("Du har allerede brugt dine 4 tilladte top-8 valg.");
                      return;
                    }
                    setRiderPicks([...riderPicks, { name: newPick, stars, auto: false }]);
                    setNewPick("");
                    setStars("");
                    setError("");
                  }}
                  disabled={!newPick || !stars}
                >
                  Tilføj valg
                </Button>
              </CardContent>
            </Card>

            {riderPicks.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Dine valg ({riderPicks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {riderPicks.map((pick, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">{pick.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {pick.stars} stjerner
                          </Badge>
                          {pick.auto && <Badge variant="outline">auto</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stars" className="space-y-6 animate-slide-up">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Tilføj Axelgaard vurdering
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rider">Rytternavn</Label>
                  <Input 
                    id="rider"
                    placeholder="Rytternavn" 
                    value={rider} 
                    onChange={(e) => setRider(e.target.value)}
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starRating">Antal stjerner (0-5)</Label>
                  <Input 
                    id="starRating"
                    placeholder="Antal stjerner (0-5)" 
                    value={stars} 
                    onChange={(e) => setStars(e.target.value)}
                    className="transition-all duration-300 focus:shadow-cycling"
                  />
                </div>
                <Button 
                  onClick={() => {
                    if (rider && stars) {
                      setArticleStars([...articleStars, { rider, stars }]);
                      setRider("");
                      setStars("");
                    }
                  }}
                  className="w-full bg-gradient-cycling hover:opacity-90 transition-all duration-300"
                  disabled={!rider || !stars}
                >
                  Tilføj vurdering
                </Button>
              </CardContent>
            </Card>

            {articleStars.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Axelgaard vurderinger ({articleStars.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {articleStars.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="font-medium">{item.rider}</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {item.stars} stjerner
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6 animate-slide-up">
            {selectedRaces.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Ingen løb tilføjet endnu. Gå til "Løb" for at oprette dit første løb.</p>
                </CardContent>
              </Card>
            ) : (
              selectedRaces.map((race, index) => (
                <Card key={index} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      {race.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => fetchSimulatedPCSResults(index)}
                        variant="secondary"
                        className="bg-gradient-secondary transition-all duration-300"
                      >
                        Hent PCS Resultater
                      </Button>
                      {!race.autoPicksDone && (
                        <Button 
                          onClick={() => triggerAutoPicks(index)}
                          variant="outline"
                          className="transition-all duration-300 hover:shadow-card"
                        >
                          Auto-Pick Manglende Spillere
                        </Button>
                      )}
                    </div>

                    {race.results.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          Resultater:
                        </h3>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <ol className="space-y-2">
                            {race.results.map((rider, i) => (
                              <li key={i} className="flex items-center gap-3">
                                <Badge variant={i === 0 ? "default" : "secondary"} className="w-8 h-8 rounded-full flex items-center justify-center">
                                  {i + 1}
                                </Badge>
                                <span className={i === 0 ? "font-semibold text-primary" : ""}>{rider}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}

                    {Object.keys(race.picks).length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          Pointoversigt:
                        </h3>
                        <div className="bg-muted/30 rounded-lg p-4">
                          <div className="space-y-2">
                            {Object.entries(race.picks).map(([player, pick], i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded border border-border/50">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{player}</span>
                                  <span className="text-muted-foreground">{pick.name}</span>
                                  {pick.auto && <Badge variant="outline" className="text-xs">auto</Badge>}
                                </div>
                                <Badge variant="default" className="bg-gradient-cycling">
                                  {calculatePoints(pick.name, race)} point
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}