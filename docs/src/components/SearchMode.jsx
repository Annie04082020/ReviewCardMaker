import { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, FileText } from 'lucide-react';
import dictionaryData from '../data/dictionary.json';

const SearchMode = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [dailyWord, setDailyWord] = useState(null);

    // Initial load & Daily Word Logic
    useEffect(() => {
        // Daily Recommendation Logic
        const today = new Date().toDateString();
        const storedDaily = JSON.parse(localStorage.getItem('daily_recommendation'));

        if (storedDaily && storedDaily.date === today) {
            setDailyWord(storedDaily.word);
        } else {
            // Pick a random word from the dictionary
            // We'll collect all titles first
            const allTitles = [];
            dictionaryData.forEach(file => {
                file.pages.forEach(page => {
                    if (page.title && page.title.length < 50) { // Limit length to avoid full sentences
                        allTitles.push(page.title);
                    }
                });
            });

            if (allTitles.length > 0) {
                const randomWord = allTitles[Math.floor(Math.random() * allTitles.length)];
                setDailyWord(randomWord);
                localStorage.setItem('daily_recommendation', JSON.stringify({
                    date: today,
                    word: randomWord
                }));
            }
        }
    }, []);

    // Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const newResults = [];

        dictionaryData.forEach(file => {
            file.pages.forEach(page => {
                // Check if any line matches
                const matches = page.content.some(line => line.toLowerCase().includes(lowerQuery));
                if (matches) {
                    // Find the specific matching lines for snippet
                    const matchingLines = page.content.filter(line => line.toLowerCase().includes(lowerQuery));

                    newResults.push({
                        source: file.source,
                        page: page.page,
                        title: page.title,
                        imagePath: page.imagePath,
                        matches: matchingLines,
                        fullContent: page.content
                    });
                }
            });
        });

        setResults(newResults);
    }, [query]);

    return (
        <div className="h-full w-full flex flex-col items-center p-4 md:p-8 overflow-y-auto">
            <div className="w-full max-w-4xl space-y-8 animate-fade-in pb-20">

                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                        Dictionary Search
                    </h2>
                    <p className="text-gray-400">Find any plant, definition, or detail instantly</p>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                    <div className="relative flex items-center bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl">
                        <Search className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search for plants, terms..."
                            className="bg-transparent border-none outline-none text-white text-lg w-full placeholder-gray-500"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Daily Recommendation */}
                {!query && dailyWord && (
                    <div className="w-full bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-sm cursor-pointer hover:border-indigo-500/60 transition-all"
                        onClick={() => setQuery(dailyWord)}
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-1">Daily Pick</h3>
                                <p className="text-2xl font-bold text-white leading-none">{dailyWord}</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm whitespace-nowrap">
                            Search This
                        </button>
                    </div>
                )}


                {/* Results */}
                <div className="space-y-4">
                    {results.length === 0 && query.trim() ? (
                        <div className="text-center py-12 text-gray-500">
                            No matches found for "{query}"
                        </div>
                    ) : !query.trim() ? (
                        <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                            <BookOpen size={48} className="mb-4 opacity-50" />
                            <p>Enter a term to search the knowledge base.</p>
                        </div>
                    ) : (
                        results.map((result, idx) => (
                            <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:bg-gray-800 transition-colors">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Image Preview */}
                                    <div className="shrink-0">
                                        <div className="md:w-96 aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 relative group">
                                            <img
                                                src={result.imagePath}
                                                alt={`Page ${result.page}`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.style.display = 'none'; // Hide if image fails
                                                }}
                                            />
                                            <a
                                                href={result.imagePath}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity"
                                            >
                                                View Full Image
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-emerald-400">{result.title}</h3>
                                                <span className="text-xs text-gray-500">{result.source} • Page {result.page}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                            {result.matches.slice(0, 3).map((line, i) => (
                                                <p key={i} className="text-sm text-gray-300 mb-1 last:mb-0 font-mono">
                                                    ...{line}...
                                                </p>
                                            ))}
                                        </div>

                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors select-none">
                                                Show Full Text
                                            </summary>
                                            <div className="mt-2 text-gray-300 pl-4 border-l-2 border-gray-700 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                                {result.fullContent.join('\n')}
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchMode;
