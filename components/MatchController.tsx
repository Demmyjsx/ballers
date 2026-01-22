
import React from 'react';
import { Team, MatchStatus } from '../types';

interface MatchControllerProps {
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  onScoreA: (s: number) => void;
  onScoreB: (s: number) => void;
  status: MatchStatus;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
}

export const MatchController: React.FC<MatchControllerProps> = ({
  teamA, teamB, scoreA, scoreB, onScoreA, onScoreB, status, isPaused, onTogglePause, onRestart
}) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center text-center">
        <div className="flex-1">
          <div className="text-2xl font-bold text-blue-400 mb-2">{teamA.name}</div>
          <div className="flex flex-wrap justify-center gap-1">
            {teamA.players.map(p => (
              <span key={p.id} className="bg-blue-900/40 text-[10px] px-2 py-1 rounded-full border border-blue-500/30">#{p.number}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="text-6xl font-black mb-4">{scoreA}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => onScoreA(Math.max(0, scoreA - 1))}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center font-bold"
              >-</button>
              <button 
                onClick={() => onScoreA(scoreA + 1)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
        </div>

        <div className="px-6 text-2xl font-black text-gray-600">VS</div>

        <div className="flex-1">
          <div className="text-2xl font-bold text-red-400 mb-2">{teamB.name}</div>
          <div className="flex flex-wrap justify-center gap-1">
            {teamB.players.map(p => (
              <span key={p.id} className="bg-red-900/40 text-[10px] px-2 py-1 rounded-full border border-red-500/30">#{p.number}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div className="text-6xl font-black mb-4">{scoreB}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => onScoreB(Math.max(0, scoreB - 1))}
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center font-bold"
              >-</button>
              <button 
                onClick={() => onScoreB(scoreB + 1)}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 border-t border-gray-700 pt-6">
        <button 
          onClick={onTogglePause}
          className={`px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all ${isPaused ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}
        >
          {isPaused ? (status === 'upcoming' ? 'Start Match' : 'Resume') : 'Pause'}
        </button>
        <button 
          onClick={onRestart}
          className="px-8 py-3 rounded-lg font-bold text-lg bg-gray-700 hover:bg-gray-600 shadow-lg transition-all"
        >
          Reset
        </button>
      </div>
      
      <div className="text-center text-xs text-gray-500 italic">
        * First to 2 goals wins immediately (Golden Goal rule)
      </div>
    </div>
  );
};
