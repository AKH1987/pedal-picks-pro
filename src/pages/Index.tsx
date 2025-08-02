import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

const FIXED_PLAYERS = ["Anders", "Dennis", "Emil", "Christian", "Tobias", "Mathias", "Isak"];
const MAX_5_STAR_PICKS = 5;
const MAX_TOP8_PICKS = 4;
const TOP8_LIST = [
  "Tadej Pogacar", "Remco Evenepoel", "Jasper Disaster", "Ben O'Connor",
  "Mathieu Van der Poel", "Marc Hirschi", "Jonas Vingegaard", "Primoz Roglic"
];

export default function App() {
  const [riderPicks, setRiderPicks] = useState([]);
  const [newPick, setNewPick] = useState("");
  const [stars, setStars] = useState("");
  const [articleStars, setArticleStars] = useState([]);
  const [rider, setRider] = useState("");
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [selectedRaces, setSelectedRaces] = useState([]);
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

  const getNextPicker = (race) => {
    for (let p of FIXED_PLAYERS) {
      if (!race.picks[p]) return p;
    }
    return null;
  };

  const getCountdown = (raceDate) => {
    const raceStart = parseISO(raceDate);
    const deadline = new Date(raceStart.getTime() - 90 * 60 * 1000);
    const timeLeft = formatDistanceToNowStrict(deadline, { addSuffix: true });
    return timeLeft;
  };

  const fetchSimulatedPCSResults = (raceIndex) => {
    const sampleFinishers = [
      "Jonas Vingegaard", "Remco Evenepoel", "Tadej Pogacar",
      "Mads Pedersen (DK)", "Primoz Roglic"
    ];
    const updatedRaces = [...selectedRaces];
    updatedRaces[raceIndex].results = sampleFinishers;
    setSelectedRaces(updatedRaces);
  };

  const triggerAutoPicks = (raceIndex) => {
    const updatedRaces = [...selectedRaces];
    const race = updatedRaces[raceIndex];
    FIXED_PLAYERS.forEach(player => {
      if (!race.picks[player]) {
        const available = articleStars
          .filter(r => !Object.values(race.picks).some((p: any) => p.name === r.rider))
          .sort((a, b) => parseInt(a.stars) - parseInt(b.stars));
        if (available.length > 0) {
          race.picks[player] = { name: available[0].rider, stars: available[0].stars, auto: true };
        }
      }
    });
    race.autoPicksDone = true;
    setSelectedRaces(updatedRaces);
  };

  const calculatePoints = (riderName, race) => {
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cykelspil App</h1>
      <Tabs defaultValue="races">
        <TabsList>
          <TabsTrigger value="races">Løb</TabsTrigger>
          <TabsTrigger value="picks">Picks</TabsTrigger>
          <TabsTrigger value="stars">Axelgaard</TabsTrigger>
          <TabsTrigger value="results">Resultater</TabsTrigger>
        </TabsList>

        <TabsContent value="races">
          <Card><CardContent className="p-4 space-y-4">
            <Label>Løbsnavn</Label>
            <Input value={raceName} onChange={(e) => setRaceName(e.target.value)} placeholder="F.eks. Tour de France - Etape 5" />
            <Label>Startdato og tidspunkt</Label>
            <Input type="datetime-local" value={raceDate} onChange={(e) => setRaceDate(e.target.value)} />
            <Button onClick={handleAddRace}>Tilføj løb</Button>
            <div className="pt-4 space-y-2">
              {selectedRaces.map((race, i) => (
                <div key={i} className="border p-3 rounded">
                  <h2 className="font-semibold">{race.name}</h2>
                  <p>Næste til at vælge: <strong>{getNextPicker(race) || "Alle har valgt"}</strong></p>
                  <p>Deadline for førstevælger: <strong>{getCountdown(race.date)}</strong></p>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="picks">
          <Card><CardContent className="p-4 space-y-4">
            <Label>Tilføj nyt valg</Label>
            <Input placeholder="Rytternavn" value={newPick} onChange={(e) => setNewPick(e.target.value)} />
            <Input placeholder="Stjerner fra Axelgaard (0-5)" value={stars} onChange={(e) => setStars(e.target.value)} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={() => {
              const fiveStarCount = riderPicks.filter((p: any) => p.stars === "5").length;
              const top8Count = riderPicks.filter((p: any) => TOP8_LIST.includes(p.name)).length;
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
            }}>Tilføj</Button>
            <ul className="list-disc list-inside pt-4">
              {riderPicks.map((pick: any, i) => (
                <li key={i}>{pick.name} ({pick.stars} stjerner){pick.auto ? " (auto)" : ""}</li>
              ))}
            </ul>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="stars">
          <Card><CardContent className="p-4 space-y-4">
            <Label>Tilføj Axelgaard vurdering</Label>
            <Input placeholder="Rytternavn" value={rider} onChange={(e) => setRider(e.target.value)} />
            <Input placeholder="Antal stjerner (0-5)" value={stars} onChange={(e) => setStars(e.target.value)} />
            <Button onClick={() => {
              if (rider && stars) {
                setArticleStars([...articleStars, { rider, stars }]);
                setRider("");
                setStars("");
              }
            }}>Tilføj</Button>
            <ul className="list-disc list-inside pt-4">
              {articleStars.map((item, i) => (
                <li key={i}>{item.rider} - {item.stars} stjerner</li>
              ))}
            </ul>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="results">
          <Card><CardContent className="p-4 space-y-6">
            {selectedRaces.map((race, index) => (
              <div key={index} className="space-y-2">
                <h2 className="font-bold">{race.name}</h2>
                <Button onClick={() => fetchSimulatedPCSResults(index)}>Hent PCS Resultater</Button>
                {!race.autoPicksDone && <Button onClick={() => triggerAutoPicks(index)}>Auto-Pick Manglende Spillere</Button>}
                <div className="pt-2">
                  <h3 className="font-semibold">Resultater:</h3>
                  <ol className="list-decimal list-inside">
                    {race.results.map((rider, i) => (
                      <li key={i}>{rider}</li>
                    ))}
                  </ol>
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold">Pointoversigt:</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(race.picks).map(([player, pick]: [string, any], i) => (
                      <li key={i}>{player}: {pick.name} = {calculatePoints(pick.name, race)} point{pick.auto ? " (auto)" : ""}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}