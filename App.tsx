
import React, { useState, useCallback, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { TournamentDashboard } from './components/TournamentDashboard';
import { Team, MatchResult } from './types';

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamQueue, setTeamQueue] = useState<string[]>([]);
  const [currentMatch, setCurrentMatch] = useState<[string, string] | null>(null);
  const [history, setHistory] = useState<MatchResult[]>([]);
  const [isStarted, setIsStarted] = useState(false);

  const startTournament = (newTeams: Team[]) => {
    setTeams(newTeams);
    const ids = newTeams.map(t => t.id);
    if (ids.length >= 2) {
      setCurrentMatch([ids[0], ids[1]]);
      setTeamQueue(ids.slice(2));
    } else {
      setTeamQueue(ids);
    }
    setIsStarted(true);
  };

  const handleMatchFinish = useCallback((result: MatchResult) => {
    setHistory(prev => [result, ...prev]);
    
    setTeams(prevTeams => prevTeams.map(t => {
      if (t.id === result.teamA) {
        return {
          ...t,
          wins: result.winner === result.teamA ? t.wins + 1 : t.wins,
          losses: result.winner === result.teamB ? t.losses + 1 : t.losses,
          draws: result.winner === 'draw' ? t.draws + 1 : t.draws
        };
      }
      if (t.id === result.teamB) {
        return {
          ...t,
          wins: result.winner === result.teamB ? t.wins + 1 : t.wins,
          losses: result.winner === result.teamA ? t.losses + 1 : t.losses,
          draws: result.winner === 'draw' ? t.draws + 1 : t.draws
        };
      }
      return t;
    }));

    // Tournament logic:
    // 1. Winning team stays.
    // 2. If Draw:
    //    - If total teams remaining (queue + field) > 3: both replaced.
    //    - If <= 3: penalty/cointoss (handled inside dashboard)
    
    let nextA: string;
    let nextB: string;
    const newQueue = [...teamQueue];

    if (result.winner === 'draw') {
      // Both teams replaced by next two in queue
      newQueue.push(result.teamA, result.teamB);
      nextA = newQueue.shift()!;
      nextB = newQueue.shift()!;
    } else {
      // Winner stays, loser goes to end of queue
      const loser = result.winner === result.teamA ? result.teamB : result.teamA;
      newQueue.push(loser);
      nextA = result.winner;
      nextB = newQueue.shift()!;
    }

    setCurrentMatch([nextA, nextB]);
    setTeamQueue(newQueue);
  }, [teamQueue]);

  const addPlayers = (count: number) => {
    setTeams(prev => {
      const startLetterCode = 'A'.charCodeAt(0) + prev.length;
      const numTeams = Math.floor(count / 5);
      const newCreatedTeams: Team[] = [];
      
      let playerCounter = prev.reduce((acc, t) => acc + t.players.length, 0) + 1;

      for (let i = 0; i < numTeams; i++) {
        const teamName = `Team ${String.fromCharCode(startLetterCode + i)}`;
        const players = Array.from({ length: 5 }, () => ({
          id: crypto.randomUUID(),
          number: playerCounter++
        }));
        const newTeam = { id: crypto.randomUUID(), name: teamName, players, wins: 0, draws: 0, losses: 0 };
        newCreatedTeams.push(newTeam);
      }
      
      const updatedTeams = [...prev, ...newCreatedTeams];
      setTeamQueue(q => [...q, ...newCreatedTeams.map(t => t.id)]);
      return updatedTeams;
    });
  };

  return (
    <div className="min-h-screen gradient-bg p-4 md:p-8">
      {!isStarted ? (
        <SetupScreen onStart={startTournament} />
      ) : (
        <TournamentDashboard 
          teams={teams}
          currentMatchIds={currentMatch}
          queueIds={teamQueue}
          history={history}
          onMatchFinish={handleMatchFinish}
          onAddPlayers={addPlayers}
        />
      )}
    </div>
  );
};

export default App;
