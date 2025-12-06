import { useState } from 'react';
import { BarChart2, PieChart, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const StatsMode = () => {
    const [selectedGameIdx, setSelectedGameIdx] = useState(null);

    // Load stats from local storage
    const getStats = () => {
        try {
            return JSON.parse(localStorage.getItem('quiz_stats')) || { gamesPlayed: 0, totalScore: 0, history: [] };
        } catch {
            return { gamesPlayed: 0, totalScore: 0, history: [] };
        }
    };

    const getLastSession = () => {
        try {
            return JSON.parse(localStorage.getItem('last_session_details')) || [];
        } catch {
            return [];
        }
    }

    const stats = getStats();

    // Determine which details to show: Selected game -> Last Session -> Nothing
    // Note: older history items might not have 'details' saved yet, so we handle that.
    const selectedGame = selectedGameIdx !== null ? stats.history[selectedGameIdx] : null;

    // Use selected game details if available, otherwise default to last session if no game selected
    // Note: We need to ensure quizMode saves 'details' into history for this to work for old games.
    // Since we just added that, only NEW games will have details.
    const displayDetails = selectedGame ? (selectedGame.details || []) : getLastSession();

    // Fallback: If viewing a specific game but it has no details (old data), warn user.
    const showDetailsWarning = selectedGame && !selectedGame.details;

    const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

    // Calculate Weakest Deck
    const lastSessionDetails = getLastSession();
    const weakTopics = lastSessionDetails.length > 0 ? lastSessionDetails.find(s => !s.isCorrect)?.source : "None Yet";

    return (
        <div className="w-full h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500 shrink-0">
                Performance Stats
            </h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Games Played</p>
                        <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Average Score</p>
                        <p className="text-2xl font-bold text-white">{averageScore}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4 shadow-lg">
                    <div className="p-3 bg-red-600/20 text-red-400 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Weakest Source</p>
                        <p className="text-xl font-bold text-white truncate max-w-[150px]" title="Play more to detect">
                            {weakTopics || "None Yet"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                {/* History List */}
                <div className="lg:w-1/3 bg-gray-800 rounded-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[500px]">
                    <div className="p-6 border-b border-gray-700 bg-gray-800 shrink-0">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-gray-400" />
                            History
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                    </div>
                    <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
                        {stats.history.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No games played yet.</p>
                        ) : (
                            [...stats.history].reverse().map((game, reverseIdx) => {
                                const realIdx = stats.history.length - 1 - reverseIdx;
                                const isSelected = selectedGameIdx === realIdx;
                                return (
                                    <button
                                        key={realIdx}
                                        onClick={() => setSelectedGameIdx(realIdx)}
                                        className={`w-full flex justify-between items-center p-4 rounded-xl transition-all border
                                            ${isSelected
                                                ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/50'
                                                : 'bg-gray-900/50 border-gray-700 hover:bg-gray-700 hover:border-gray-500'}
                                        `}
                                    >
                                        <div className="text-left">
                                            <p className={`font-bold ${isSelected ? 'text-blue-300' : 'text-white'}`}>
                                                Score: {game.score}
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(game.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                            {game.topic}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Breakdown Table */}
                <div className="lg:w-2/3 bg-gray-800 rounded-2xl border border-gray-700 flex flex-col overflow-hidden max-h-[500px]">
                    <div className="p-6 border-b border-gray-700 bg-gray-800 shrink-0 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-400" />
                            {selectedGame ? "Game Breakdown" : "Last Session Result"}
                        </h3>
                        {selectedGameIdx !== null && (
                            <button
                                onClick={() => setSelectedGameIdx(null)}
                                className="text-xs text-gray-400 hover:text-white underline"
                            >
                                Back to Last Session
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {showDetailsWarning ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                                <AlertCircle size={48} className="mb-4 opacity-50" />
                                <p>Detailed breakdown not available for this legacy game.</p>
                                <p className="text-sm mt-2">New games will have full details saved.</p>
                            </div>
                        ) : displayDetails && displayDetails.length > 0 ? (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-900/50 text-gray-200 uppercase font-medium sticky top-0 backdrop-blur-sm z-10">
                                    <tr>
                                        <th className="px-6 py-3">Question</th>
                                        <th className="px-6 py-3 text-center">Result</th>
                                        <th className="px-6 py-3 text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {displayDetails.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white max-w-[200px]">
                                                <div className="truncate" title={row.question}>{row.question}</div>
                                                <div className="text-xs text-gray-500 truncate">{row.source}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.isCorrect ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
                                                        Correct
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-800">
                                                        Wrong
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-white">
                                                +{row.points}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No details available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsMode;
