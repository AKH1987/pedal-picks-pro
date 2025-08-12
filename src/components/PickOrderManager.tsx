import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

// === KONFIG ===
const DEFAULT_PLAYERS = [
  "Anders",
  "Dennis",
  "Emil",
  "Christian",
  "Tobias",
  "Mathias",
  "Isak",
];

export type StartCounts = Record<string, number>;

export type Race = {
  id: string;
  name: string;
  date?: string; // optional, hvis du har det
  pickOrder?: string[]; // beregnet rækkefølge for runden
};

type Props = {
  players?: string[];
  races: Race[];
  onOrdersComputed?: (racesWithOrders: Race[], updatedStartCounts: StartCounts) => void;
  locked?: boolean;
};

// Utility: roter array så element ved startIndex kommer først
function rotate<T>(arr: T[], startIndex: number): T[] {
  const n = arr.length;
  if (n === 0) return arr;
  const idx = ((startIndex % n) + n) % n;
  return [...arr.slice(idx), ...arr.slice(0, idx)];
}

// Vælg næste startspiller balanceret:
// 1) Find laveste antal starter
// 2) Random blandt dem der har færrest starter (for fairness)
// 3) Returnér navn
function chooseBalancedStarter(players: string[], startCounts: StartCounts): string {
  const counts = players.map((p) => ({ p, c: startCounts[p] ?? 0 }));
  const min = Math.min(...counts.map((x) => x.c));
  const candidates = counts.filter((x) => x.c === min).map((x) => x.p);
  // tilfældig blandt kandidater
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

// Byg rækkefølgen for runden ved at rotere faste players, så starteren står først
function buildRoundOrder(players: string[], starter: string): string[] {
  const startIndex = players.indexOf(starter);
  if (startIndex < 0) return players.slice();
  return rotate(players, startIndex);
}

// Beregn pick-ordre for en liste af races (én runde pr. race)
// - Første race: tilfældig balanceret starter
// - Efterfølgende races: også balanceret (så alle ender med ens antal starter)
// - Rækkefølgen i hver runde = rotation af den faste spillerliste
export function computeOrdersForRaces(
  players: string[],
  races: Race[],
  initialStartCounts?: StartCounts
): { racesWithOrders: Race[]; startCounts: StartCounts } {
  const startCounts: StartCounts = {
    ...Object.fromEntries(players.map((p) => [p, 0])),
    ...(initialStartCounts || {}),
  };

  const out: Race[] = [];
  for (const race of races) {
    const starter = chooseBalancedStarter(players, startCounts);
    const order = buildRoundOrder(players, starter);
    // opdater tælling for starter
    startCounts[starter] = (startCounts[starter] ?? 0) + 1;
    out.push({ ...race, pickOrder: order });
  }
  return { racesWithOrders: out, startCounts };
}

// --- UI-KOMPONENT ---
// Viser knap til at generere ordre + en tabel over resultater
export default function PickOrderManager({
  players = DEFAULT_PLAYERS,
  races,
  onOrdersComputed,
  locked,
}: Props) {
  const [startCounts, setStartCounts] = useState<StartCounts>(() =>
    Object.fromEntries(players.map((p) => [p, 0]))
  );
  const [computed, setComputed] = useState<Race[]>([]);

  const canCompute = useMemo(() => races && races.length > 0, [races]);

  const handleCompute = () => {
    const { racesWithOrders, startCounts: updatedCounts } = computeOrdersForRaces(
      players,
      races,
      startCounts
    );

    setComputed(racesWithOrders);
    setStartCounts(updatedCounts);
    onOrdersComputed?.(racesWithOrders, updatedCounts);
  };

  const handleResetCounts = () => {
    setStartCounts(Object.fromEntries(players.map((p) => [p, 0])));
    setComputed([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={handleCompute} disabled={!canCompute || locked}>
          Generér pick-rækkefølge for rund(er)
        </Button>
        <Button variant="outline" onClick={handleResetCounts} title="Nulstil starter-tællinger">
          Nulstil start-fordeling
        </Button>
      </div>

      {/* Starter-fordeling */}
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Startere (balancering over sæsonen)</h3>
        <ul className="list-disc list-inside grid grid-cols-2 md:grid-cols-3 gap-y-1">
          {players.map((p) => (
            <li key={p}>
              {p}: <strong>{startCounts[p] ?? 0}</strong> starter
            </li>
          ))}
        </ul>
      </div>

      {/* Resultattabel */}
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Pick-rækkefølge pr. runde</h3>
        {computed.length === 0 ? (
          <p className="text-sm opacity-70">Ingen runder genereret endnu.</p>
        ) : (
          <div className="space-y-3">
            {computed.map((r, idx) => (
              <div key={r.id ?? idx} className="border rounded p-2">
                <div className="font-medium">
                  Runde {idx + 1}: {r.name} {r.date ? `• ${r.date}` : ""}
                </div>
                <div className="text-sm mt-1">Rækkefølge: {r.pickOrder?.join(" → ")}</div>
                {r.pickOrder && r.pickOrder.length > 0 && (
                  <div className="text-xs mt-1 opacity-70">
                    Starter: <strong>{r.pickOrder[0]}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
