
import React, { useState } from 'react';
import { Team } from '../types';

interface Props {
  teamA: Team;
  teamB: Team;
  onFinish: (winnerId: string) => void;
}

export const PenaltyShootout: React.FC<Props> = ({ teamA, teamB, onFinish }) => {
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ a: 0, b: 0 });
  const [currentTurn, setCurrentTurn] = useState<'A' | 'B'>('A');

  const handlePenalty = (scored: boolean) => {
    const newScores = { ...scores };
    if (scored) {
      if (currentTurn === 'A') newScores.a += 1;
      else newScores.b += 1;
    }

    setScores(newScores);

    if (currentTurn === 'A') {
      setCurrentTurn('B');
    } else {
      if (round === 2) {
        // End of 2 penalties
        if (newScores.a === newScores.b) onFinish('draw');
        else onFinish(newScores.a > newScores.b ? teamA.id : teamB.id);
      } else {
        setRound(2);
        setCurrentTurn('A');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border-2 border-yellow-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-black text-yellow-500 mb-2 italic">PENALTY SHOOTOUT</h2>
        <p className="text-gray-400 mb-6">Each team gets 2 penalties. Still tied? Coin toss.</p>
        
        <div className="flex justify-around items-center mb-8">
          <div>
            <div className="text-blue-400 font-bold mb-1">{teamA.name}</div>
            <div className="text-4xl font-black">{scores.a}</div>
          </div>
          <div className="text-2xl font-bold text-gray-600">VS</div>
          <div>
            <div className="text-red-400 font-bold mb-1">{teamB.name}</div>
            <div className="text-4xl font-black">{scores.b}</div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="text-lg font-bold mb-4">
            Turn: <span className={currentTurn === 'A' ? 'text-blue-400' : 'text-red-400'}>
              {currentTurn === 'A' ? teamA.name : teamB.name}
            </span>
            <div className="text-xs text-gray-500">Round {round} of 2</div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => handlePenalty(true)}
              className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-lg font-bold text-xl transition-all shadow-lg"
            >
              ⚽ GOAL
            </button>
            <button 
              onClick={() => handlePenalty(false)}
              className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-lg font-bold text-xl transition-all shadow-lg"
            >
              ❌ MISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
