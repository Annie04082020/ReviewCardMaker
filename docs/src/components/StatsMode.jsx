import { BarChart2, PieChart, TrendingUp, AlertCircle } from 'lucide-react';

const StatsMode = () => {
    // Load stats from local storage
    const getStats = () => {
        try {
            return JSON.parse(localStorage.getItem('quiz_stats')) || { gamesPlayed: 0, totalScore: 0, history: [] };
        } catch {
            return { gamesPlayed: 0, totalScore: 0, history: [] };
        }
    };

    const stats = getStats();
    const averageScore = stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0;

    // Mock data for weak topics (in a real app, we'd calculate this from card IDs)
    const weakTopics = [
        { name: "Biology", accuracy: 45 },
        { name: "Chemistry", accuracy: 60 },
    ];

    return (
        <div className="w-full max-w-4xl h-full flex flex-col p-6 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                Performance Stats
            </h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Games Played</p>
                        <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
                        <BarChart2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Average Score</p>
                        <p className="text-2xl font-bold text-white">{averageScore}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-center gap-4">
                    <div className="p-3 bg-red-600/20 text-red-400 rounded-xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Weakest Area</p>
                        <p className="text-xl font-bold text-white">
                            {weakTopics[0]?.name || "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PieChart size={20} className="text-gray-400" />
                        Recent Games
                    </h3>
                </div>
                <div className="p-6">
                    {stats.history.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No games played yet. Go play a quiz!</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.history.slice(-5).reverse().map((game, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl">
                                    <div>
                                        <p className="font-bold text-white">Score: {game.score}</p>
                                        <p className="text-xs text-gray-400">{new Date(game.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-sm px-3 py-1 bg-gray-700 rounded-full text-gray-300">
                                        {game.topic} Usage
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsMode;
