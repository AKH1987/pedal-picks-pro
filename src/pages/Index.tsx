// GitHub Sync Test - Added on 2025-01-02 at 15:30 UTC
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { Trophy, Clock, Star, Users, Calendar, Target, Medal, Github } from "lucide-react";
import { Link } from "react-router-dom";
import cyclingHero from "@/assets/cycling-hero.jpg";
import PickOrderManager from "@/components/PickOrderManager";

const FIXED_PLAYERS = ["Anders", "Dennis", "Emil", "Christian", "Tobias", "Mathias", "Isak"];
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

const predefinedRaces = [
  { name: "Tour Down Under", date: "2025-01-21T10:00" },
  { name: "Etoile de Bessègues", date: "2025-02-05T10:00" },
  { name: "UAE Tour", date: "2025-02-17T10:00" },
  { name: "Vuelta A Andalucia Ruta Ciclista Del Sol", date: "2025-02-19T10:00" },
  { name: "Omloop", date: "2025-03-01T10:00" },
  { name: "Kuurne - Brussels - Kuurne", date: "2025-03-02T10:00" },
  { name: "Strade Bianche", date: "2025-03-08T10:00" },
  { name: "Paris-Nice", date: "2025-03-09T10:00" },
  { name: "Tireno-Adriatico", date: "2025-03-10T10:00" },
  { name: "Milano Sanremo", date: "2025-03-22T10:00" },
  { name: "Katalonien Rundt", date: "2025-03-24T10:00" },
  { name: "Classic Brugge-De Panne", date: "2025-03-26T10:00" },
  { name: "E3 Lars Seier Classic", date: "2025-03-28T10:00" },
  { name: "Gent-Wevelgem", date: "2025-03-30T10:00" },
  { name: "Dwars door Vlaanderen", date: "2025-04-02T10:00" },
  { name: "Ronde van Vlaanderen", date: "2025-04-06T10:00" },
  { name: "Baskerlandet Rundt", date: "2025-04-07T10:00" },
  { name: "Scheldeprijs", date: "2025-04-09T10:00" },
  { name: "Paris Roubaix", date: "2025-04-13T10:00" },
  { name: "Amstel Gold Race", date: "2025-04-20T10:00" },
  { name: "Fleche Wallone", date: "2025-04-23T10:00" },
  { name: "Liege-Bastogne-Liege", date: "2025-04-27T10:00" },
  { name: "Romandiet Rundt", date: "2025-04-29T10:00" },
  { name: "Eschborn-Frankfurt", date: "2025-05-01T10:00" },
  { name: "Giro d'Italia", date: "2025-05-09T10:00" },
  { name: "9. Etape", date: "2025-05-18T10:00" },
  { name: "13. Etape", date: "2025-05-23T10:00" },
  { name: "20. Etape", date: "2025-05-31T10:00" },
  { name: "4 dage ved Dunkerque", date: "2025-05-14T10:00" },
  { name: "Tour of Norway", date: "2025-05-29T10:00" },
  { name: "Criterium Dauphiné", date: "2025-06-08T10:00" },
  { name: "Tour de Suisse", date: "2025-06-15T10:00" },
  { name: "Copenhagen Sprint", date: "2025-06-22T10:00" },
  { name: "Tour de France", date: "2025-07-05T10:00" },
  { name: "5. Etape", date: "2025-07-09T10:00" },
  { name: "14. Etape", date: "2025-07-17T10:00" },
  { name: "19. etape", date: "2025-07-25T10:00" },
  { name: "Donostia San Sebastian Klasikoa", date: "2025-08-02T10:00" },
  { name: "Tour de pologne", date: "2025-08-04T10:00" },
  { name: "Vuelta a Burgos", date: "2025-08-05T10:00" },
  { name: "Post DK", date: "2025-08-12T10:00" },
  { name: "Renewi Tour", date: "2025-08-20T10:00" },
  { name: "La Vuelta", date: "2025-08-23T10:00" },
  { name: "7. Etape", date: "2025-08-29T10:00" },
  { name: "14. Etape", date: "2025-09-05T10:00" },
  { name: "17. Etape", date: "2025-09-10T10:00" },
  { name: "Bretagne Classic", date: "2025-08-31T10:00" },
  { name: "Grand Prix Cycliste de Qubec", date: "2025-09-12T10:00" },
  { name: "Grand Prix Cycliste de Montreal", date: "2025-09-14T10:00" },
  { name: "VM enkeltstart i Kigali", date: "2025-09-21T10:00" },
  { name: "VM linjeløb i Kigali", date: "2025-09-28T10:00" },
  { name: "Sparkassen Münsterland Giro", date: "2025-10-03T10:00" },
  { name: "EM Guilherand-Granges", date: "2025-10-05T10:00" },
  { name: "Gran Piemonte", date: "2025-10-09T10:00" },
  { name: "Lombardiet Rundt", date: "2025-10-11T10:00" },
  { name: "Paris Tours", date: "2025-10-12T10:00" }
];

export default function Index() {
  
  
  const [articleStars, setArticleStars] = useState<ArticleStar[]>([]);
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [selectedRaces, setSelectedRaces] = useState<Race[]>([]);
  
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

  const handleImportPredefinedRaces = () => {
    const currentTime = new Date();
    const upcomingRaces = predefinedRaces.filter(race => {
      try {
        const raceStart = parseISO(race.date);
        const deadline = new Date(raceStart.getTime() - 90 * 60 * 1000);
        return deadline > currentTime;
      } catch {
        return false;
      }
    });
    
    const racesToImport = upcomingRaces.map(race => ({
      name: race.name,
      date: race.date,
      results: [],
      picks: {},
      autoPicksDone: false
    }));
    setSelectedRaces([...selectedRaces, ...racesToImport]);
  };

  const handleImportFullCalendar = () => {
    // Import ALL races (including past). Avoid duplicates by name+date.
    const existing = new Set(selectedRaces.map(r => `${r.name}|${r.date}`));
    const racesToImport = predefinedRaces
      .filter(r => !existing.has(`${r.name}|${r.date}`))
      .map(race => ({
        name: race.name,
        date: race.date,
        results: [],
        picks: {},
        autoPicksDone: false
      }));
    setSelectedRaces([...selectedRaces, ...racesToImport]);
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

  const isPastDeadline = (raceDate: string): boolean => {
    try {
      const raceStart = parseISO(raceDate);
      const deadline = new Date(raceStart.getTime() - 90 * 60 * 1000);
      return deadline <= now;
    } catch {
      return false;
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

  const updateRacePick = (raceIndex: number, player: string, riderName: string): void => {
    const updated = [...selectedRaces];
    const stars = articleStars.find(s => s.rider === riderName)?.stars || updated[raceIndex].picks[player]?.stars || "3";
    updated[raceIndex].picks[player] = { name: riderName, stars, auto: false };
    setSelectedRaces(updated);
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

  const calculateSeasonStandings = () => {
    const standings: Record<string, { totalPoints: number; races: number }> = {};
    
    // Initialize all players
    FIXED_PLAYERS.forEach(player => {
      standings[player] = { totalPoints: 0, races: 0 };
    });

    // Calculate points for each race
    selectedRaces.forEach(race => {
      if (race.results.length > 0) { // Only count races with results
        Object.entries(race.picks).forEach(([player, pick]) => {
          if (standings[player]) {
            standings[player].totalPoints += calculatePoints(pick.name, race);
            standings[player].races += 1;
          }
        });
      }
    });

    // Convert to array and sort by total points
    return Object.entries(standings)
      .map(([player, data]) => ({
        player,
        totalPoints: data.totalPoints,
        races: data.races,
        average: data.races > 0 ? (data.totalPoints / data.races).toFixed(1) : "0.0"
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const calculatePlayerStats = (playerName: string) => {
    // Get all riders that this specific player has picked across all races
    const playerPickedRiders = new Set<string>();
    selectedRaces.forEach(race => {
      if (race.picks[playerName]) {
        playerPickedRiders.add(race.picks[playerName].name);
      }
    });

    // Count favorits (TOP8_LIST riders) this player has picked
    const playerFavorits = Array.from(playerPickedRiders).filter(rider => 
      TOP8_LIST.includes(rider)
    ).length;

    // Count wonderkids (5-star riders) this player has picked
    const playerWonderkids = Array.from(playerPickedRiders).filter(rider => {
      const riderStar = articleStars.find(star => star.rider === rider);
      return riderStar && riderStar.stars === "5";
    }).length;

    return { favorits: playerFavorits, wonderkids: playerWonderkids };
  };

  const upcomingSelected = selectedRaces
    .filter(r => !isPastDeadline(r.date))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const previousSelected = selectedRaces
    .filter(r => isPastDeadline(r.date))
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

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
            {/* GitHub Sync Test Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4 text-primary-foreground/90 text-sm">
              <Github className="w-4 h-4" />
              <span>GitHub Sync Test Active</span>
            </div>
            
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
          <div className="flex items-stretch w-full mb-6">
            <div className="flex w-full h-10 items-stretch rounded-md bg-muted p-1 text-muted-foreground shadow-card">
              <TabsList className="flex-1 bg-transparent p-0">
                <TabsTrigger value="races" className="w-full justify-center flex-1">
                  <Calendar className="w-4 h-4" />
                  Løb
                </TabsTrigger>
              </TabsList>
              <Link
                to="/axelgaard"
                className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-muted-foreground hover:bg-background hover:text-foreground"
                aria-label="Åbn Axelgaard siden"
              >
                <Github className="w-4 h-4" />
                <span className="ml-2">Axelgaard</span>
              </Link>
              <TabsList className="flex-1 bg-transparent p-0">
                <TabsTrigger value="picks" className="w-full justify-center flex-1">
                  <Target className="w-4 h-4" />
                  Picks
                </TabsTrigger>
              </TabsList>
              <TabsList className="flex-1 bg-transparent p-0">
                <TabsTrigger value="results" className="w-full justify-center flex-1">
                  <Trophy className="w-4 h-4" />
                  Resultater
                </TabsTrigger>
              </TabsList>
              <TabsList className="flex-1 bg-transparent p-0">
                <TabsTrigger value="standings" className="w-full justify-center flex-1">
                  <Medal className="w-4 h-4" />
                  Stillingen
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="races" className="space-y-6 animate-slide-up">
            {selectedRaces.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    Kommende løb ({upcomingSelected.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingSelected.map((race, i) => (
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

            {previousSelected.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    Tidligere løb ({previousSelected.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {previousSelected.map((race, i) => (
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

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  Importer løbskalender
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Importer kommende cykelløb for 2025 sæsonen (kun løb der ikke har overskredet deadline).
                </p>
                <Button 
                  onClick={handleImportPredefinedRaces} 
                  variant="secondary"
                  className="w-full bg-gradient-secondary hover:opacity-90 transition-all duration-300"
                >
                  Importer kommende løb
                </Button>
                <Button 
                  onClick={handleImportFullCalendar} 
                  variant="outline"
                  className="w-full"
                >
                  Importer hele kalenderen (inkl. tidligere)
                </Button>
              </CardContent>
            </Card>

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
          </TabsContent>

          <TabsContent value="picks" className="space-y-6 animate-slide-up">
 
            {upcomingSelected.length > 0 ? (
              (() => {
                const nextRace = upcomingSelected[0];
                const raceIndex = selectedRaces.findIndex(r => r.name === nextRace.name && r.date === nextRace.date);
                if (raceIndex === -1) return null;
                return (
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Picks for næste løb: {nextRace.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Deadline: <strong className="text-foreground ml-1">{getCountdown(nextRace.date)}</strong>
                      </div>
                      <div className="space-y-2">
                        {FIXED_PLAYERS.map((player) => (
                          <div key={player} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 bg-muted/30 rounded-lg">
                            <div className="font-medium">{player}</div>
                            <div className="md:col-span-2 flex items-center gap-2">
                              <Input
                                placeholder="Vælg rytter"
                                value={selectedRaces[raceIndex].picks[player]?.name || ""}
                                onChange={(e) => updateRacePick(raceIndex, player, e.target.value)}
                                className="flex-1"
                              />
                              {selectedRaces[raceIndex].picks[player]?.stars && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Star className="w-3 h-3" />
                                  {selectedRaces[raceIndex].picks[player]?.stars} stjerner
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()
            ) : (
              <Card className="shadow-card">
                <CardContent className="text-sm text-muted-foreground py-6">
                  Ingen kommende løb at lave picks til.
                </CardContent>
              </Card>
            )}

            <div className="mt-6">
              <PickOrderManager
                players={FIXED_PLAYERS}
                races={upcomingSelected.map(r => ({ id: `${r.name}|${r.date}`, name: r.name, date: r.date }))}
              />
            </div>
 
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

          <TabsContent value="standings" className="space-y-6 animate-slide-up">
            {selectedRaces.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="text-center py-8">
                  <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Ingen løb tilføjet endnu. Gå til "Løb" for at oprette dit første løb.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Medal className="w-5 h-5 text-primary" />
                    Sæsonstillingen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const standings = calculateSeasonStandings();
                    const hasFinishedRaces = selectedRaces.some(race => race.results.length > 0);
                    
                    if (!hasFinishedRaces) {
                      return (
                        <div className="text-center py-8">
                          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Ingen afsluttede løb endnu. Tilføj resultater for at se stillingen.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                         <div className="grid grid-cols-6 gap-4 p-3 bg-muted/30 rounded-lg font-semibold text-sm">
                           <span>Position</span>
                           <span>Spiller</span>
                           <span>Point</span>
                           <span>Snit</span>
                           <span>Favoriter</span>
                           <span>Wonderkids</span>
                         </div>
                        <div className="space-y-2">
                           {standings.map((standing, index) => {
                              const playerStats = calculatePlayerStats(standing.player);
                              return (
                                <div 
                                  key={standing.player} 
                                  className={`grid grid-cols-6 gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-card ${
                                    index === 0 ? 'bg-gradient-cycling text-primary-foreground' :
                                    index === 1 ? 'bg-gradient-secondary text-secondary-foreground' :
                                    index === 2 ? 'bg-gradient-accent text-accent-foreground' :
                                    'bg-muted/30'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {index === 0 && <Trophy className="w-4 h-4" />}
                                    {index === 1 && <Medal className="w-4 h-4" />}
                                    {index === 2 && <Medal className="w-4 h-4" />}
                                    <span className="font-bold">{index + 1}</span>
                                  </div>
                                  <span className="font-semibold">{standing.player}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{standing.totalPoints}</span>
                                    <span className="text-sm opacity-75">({standing.races} løb)</span>
                                  </div>
                                  <span className="font-medium">{standing.average}</span>
                                  <span className="text-sm font-medium">{playerStats.favorits} Favoriter</span>
                                  <span className="text-sm font-medium">{playerStats.wonderkids} Wonderkids</span>
                                </div>
                              );
                            })}
                        </div>
                        
                        {standings.length > 0 && (
                          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Statistik
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Totale løb:</span>
                                <span className="ml-2 font-semibold">
                                  {selectedRaces.filter(race => race.results.length > 0).length}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Aktive spillere:</span>
                                <span className="ml-2 font-semibold">
                                  {standings.filter(s => s.races > 0).length}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Højeste point (enkelt løb):</span>
                                <span className="ml-2 font-semibold">
                                  {Math.max(...selectedRaces
                                    .filter(race => race.results.length > 0)
                                    .flatMap(race => 
                                      Object.entries(race.picks).map(([_, pick]) => calculatePoints(pick.name, race))
                                    ), 0
                                  )}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Bedste snit:</span>
                                <span className="ml-2 font-semibold">
                                  {standings.length > 0 ? standings[0].average : "0.0"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}