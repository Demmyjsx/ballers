
import React, { useState } from 'react';
import { Team } from '../types';

interface Props {
  teamA: Team;
  teamB: Team;
  onFinish: (winnerId: string) => void;
}

export const CoinToss: React.FC<Props> = ({ teamA, teamB, onFinish }) => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);

  const toss = () => {
    setFlipping(true);
    setTimeout(() => {
      const isHeads = Math.random() > 0.5;
      setResult(isHeads ? 'heads' : 'tails');
      setFlipping(false);
      
      // heads = Team A wins, tails = Team B wins
      setTimeout(() => {
        onFinish(isHeads ? teamA.id : teamB.id);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border-2 border-blue-500 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <h2 className="text-3xl font-black text-blue-400 mb-2 italic uppercase">Final Tiebreaker: Coin Toss</h2>
        <p className="text-gray-400 mb-8">Heads: {teamA.name} | Tails: {teamB.name}</p>
        
        <div className="relative h-48 flex items-center justify-center mb-8">
          <div className={`w-32 h-32 rounded-full border-4 border-yellow-500 bg-yellow-400 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)] ${flipping ? 'animate-bounce' : ''}`}>
             {flipping ? (
               <span className="text-5xl">❔</span>
             ) : result ? (
               <span className="text-4xl font-black text-yellow-900 uppercase">{result}</span>
             ) : (
               <img src="https://picsum.photos/seed/coin/100/100" alt="Coin" className="rounded-full w-full h-full object-cover" />
             )}
          </div>
        </div>

        {!flipping && !result && (
          <button 
            onClick={toss}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-xl transition-all shadow-lg active:scale-95"
          >
            TOSS COIN
          </button>
        )}
        
        {result && (
          <div className="text-2xl font-bold animate-bounce text-green-400">
             {result === 'heads' ? teamA.name : teamB.name} WINS!
          </div>
        )}
      </div>
    </div>
  );
};
