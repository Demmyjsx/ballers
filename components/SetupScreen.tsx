
import React, { useState } from 'react';
import { Team } from '../types';

interface SetupScreenProps {
  onStart: (teams: Team[]) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState<string>('15');
  const [error, setError] = useState<string>('');
  const [generatedTeams, setGeneratedTeams] = useState<Team[] | null>(null);

  const handleGenerate = () => {
    const count = parseInt(playerCount);
    if (isNaN(count) || count < 10) {
      setError('Please enter at least 10 players for a tournament (minimum 2 teams).');
      return;
    }

    const numTeams = Math.floor(count / 5);
    const teams: Team[] = [];
    
    // Create random player pool
    const playerPool = Array.from({ length: count }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);

    for (let i = 0; i < numTeams; i++) {
      const teamName = `Team ${String.fromCharCode(65 + i)}`;
      const players = playerPool.splice(0, 5).map(num => ({
        id: crypto.randomUUID(),
        number: num
      }));
      
      teams.push({
        id: crypto.randomUUID(),
        name: teamName,
        players,
        wins: 0,
        draws: 0,
        losses: 0
      });
    }

    setGeneratedTeams(teams);
    setError('');
  };

  const handleLogoUpload = (teamId: string, file: File | null) => {
    if (!file || !generatedTeams) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setGeneratedTeams(prev => prev ? prev.map(t => 
        t.id === teamId ? { ...t, logoUrl: reader.result as string } : t
      ) : null);
    };
    reader.readAsDataURL(file);
  };

  if (generatedTeams) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400">Customize Teams</h1>
        <p className="text-gray-400 text-center mb-8">Review teams and upload optional logos.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {generatedTeams.map((team) => (
            <div key={team.id} className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="relative w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600 overflow-hidden shrink-0">
                {team.logoUrl ? (
                  <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">⚽</span>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(team.id, e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  title="Upload Logo"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-blue-300">{team.name}</div>
                <div className="text-xs text-gray-500">5 Players assigned</div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onStart(generatedTeams)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
        >
          Start Tournament
        </button>
        <button 
          onClick={() => setGeneratedTeams(null)}
          className="w-full mt-2 text-gray-500 hover:text-gray-400 text-sm py-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-400">5-a-side Manager</h1>
      <p className="text-gray-400 text-center mb-8">Enter the total number of players present to begin team assignment.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Total Players Present</label>
          <input 
            type="number"
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-xl font-bold"
            placeholder="e.g. 15"
          />
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button 
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg transition-colors shadow-lg"
        >
          Generate Teams
        </button>
      </div>

      <div className="mt-8 text-xs text-gray-500 text-center">
        * Every 5 players will be assigned to a team (A, B, C...).
        <br />
        * Numbers will be randomly scattered across teams.
      </div>
    </div>
  );
};
