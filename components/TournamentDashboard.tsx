
import React, { useState, useEffect, useRef } from 'react';
import { Team, MatchResult, MatchStatus } from '../types';
import { MatchController } from './MatchController';
import { CoinToss } from './CoinToss';
import { PenaltyShootout } from './PenaltyShootout';

interface DashboardProps {
  teams: Team[];
  currentMatchIds: [string, string] | null;
  queueIds: string[];
  history: MatchResult[];
  onMatchFinish: (result: MatchResult) => void;
  onAddPlayers: (count: number) => void;
}

export const TournamentDashboard: React.FC<DashboardProps> = ({
  teams,
  currentMatchIds,
  queueIds,
  history,
  onMatchFinish,
  onAddPlayers
}) => {
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('upcoming');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isPaused, setIsPaused] = useState(true);
  const [newPlayersCount, setNewPlayersCount] = useState('');
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const teamA = teams.find(t => t.id === currentMatchIds?.[0]);
  const teamB = teams.find(t => t.id === currentMatchIds?.[1]);

  useEffect(() => {
    if (!isPaused && timeLeft > 0 && matchStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, timeLeft, matchStatus]);

  useEffect(() => {
    if ((scoreA >= 2 || scoreB >= 2) && matchStatus === 'playing') {
      finishMatch();
    }
  }, [scoreA, scoreB, matchStatus]);

  useEffect(() => {
    if (timeLeft === 0 && matchStatus === 'playing') {
      finishMatch();
    }
  }, [timeLeft]);

  const finishMatch = () => {
    setIsPaused(true);
    const totalRemaining = queueIds.length + 2;

    if (scoreA === scoreB) {
      if (totalRemaining > 3) {
        handleFinalResult('draw');
      } else {
        setMatchStatus('penalty');
      }
    } else {
      handleFinalResult(scoreA > scoreB ? teamA!.id : teamB!.id);
    }
  };

  const handleFinalResult = (winnerId: string | 'draw') => {
    const result: MatchResult = {
      teamA: teamA!.id,
      teamB: teamB!.id,
      scoreA,
      scoreB,
      winner: winnerId,
      timestamp: Date.now()
    };
    onMatchFinish(result);
    resetMatch();
  };

  const resetMatch = () => {
    setScoreA(0);
    setScoreB(0);
    setTimeLeft(600);
    setIsPaused(true);
    setMatchStatus('upcoming');
  };

  const handlePenaltyFinish = (winnerId: string) => {
    handleFinalResult(winnerId);
  };

  const handleCoinTossFinish = (winnerId: string) => {
    handleFinalResult(winnerId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Live Match
            </h2>
            <div className="text-3xl font-mono font-bold text-blue-400">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>

          {teamA && teamB && (
            <MatchController 
              teamA={teamA}
              teamB={teamB}
              scoreA={scoreA}
              scoreB={scoreB}
              onScoreA={setScoreA}
              onScoreB={setScoreB}
              status={matchStatus}
              isPaused={isPaused}
              onTogglePause={() => {
                setIsPaused(!isPaused);
                if (matchStatus === 'upcoming') setMatchStatus('playing');
              }}
              onRestart={resetMatch}
            />
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Match History</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-gray-500 italic">No matches played yet.</p>
            ) : history.map((res, i) => {
              const tA = teams.find(t => t.id === res.teamA);
              const tB = teams.find(t => t.id === res.teamB);
              return (
                <div key={i} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                      {tA?.logoUrl ? <img src={tA.logoUrl} className="w-full h-full object-cover" /> : <span>⚽</span>}
                    </div>
                    <span className={`font-semibold ${res.winner === res.teamA ? 'text-green-400' : 'text-gray-400'}`}>{tA?.name}</span>
                  </div>
                  <div className="bg-gray-700 px-3 py-1 rounded font-bold text-lg">
                    {res.scoreA} - {res.scoreB}
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <span className={`font-semibold ${res.winner === res.teamB ? 'text-green-400' : 'text-gray-400'}`}>{tB?.name}</span>
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                      {tB?.logoUrl ? <img src={tB.logoUrl} className="w-full h-full object-cover" /> : <span>⚽</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Queue</h2>
          <div className="space-y-2">
            {queueIds.length === 0 ? (
              <p className="text-gray-500 italic">Queue is empty.</p>
            ) : queueIds.map((qid, idx) => {
              const team = teams.find(t => t.id === qid);
              return (
                <div key={idx} className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700 group hover:border-blue-500 transition-colors">
                  <span className="text-xs text-gray-500 font-bold">{idx + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                    {team?.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <span>⚽</span>}
                  </div>
                  <span className="font-medium">{team?.name}</span>
                  <span className="ml-auto text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">Waiting</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">New Players</h2>
          <div className="flex gap-2">
            <input 
              type="number"
              value={newPlayersCount}
              onChange={(e) => setNewPlayersCount(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Count..."
            />
            <button 
              onClick={() => {
                const c = parseInt(newPlayersCount);
                if (c > 0) {
                  onAddPlayers(c);
                  setNewPlayersCount('');
                }
              }}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Standings</h2>
          <div className="space-y-2">
            {[...teams].sort((a, b) => (b.wins * 3 + b.draws) - (a.wins * 3 + a.draws)).map(team => (
              <div key={team.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                    {team.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <span>⚽</span>}
                  </div>
                  <span className="font-semibold">{team.name}</span>
                </div>
                <span className="text-gray-400">
                  <span className="text-green-400 font-bold">{team.wins}</span>W{' '}
                  <span className="text-yellow-400 font-bold">{team.draws}</span>D{' '}
                  <span className="text-red-400 font-bold">{team.losses}</span>L
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {matchStatus === 'penalty' && teamA && teamB && (
        <PenaltyShootout 
          teamA={teamA}
          teamB={teamB}
          onFinish={(winnerId) => {
            if (winnerId === 'draw') setMatchStatus('cointoss');
            else handlePenaltyFinish(winnerId);
          }}
        />
      )}

      {matchStatus === 'cointoss' && teamA && teamB && (
        <CoinToss 
          teamA={teamA}
          teamB={teamB}
          onFinish={handleCoinTossFinish}
        />
      )}
    </div>
  );
};
