import { useState, useEffect } from 'react';
import { Search, BookOpen, FileText } from 'lucide-react';
import dictionaryData from '../data/dictionary.json';

const SearchMode = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

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
        <div className="w-full h-full flex flex-col p-6 overflow-hidden">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 shrink-0">
                Dictionary Search
            </h2>

            {/* Search Bar */}
            <div className="relative mb-6 shrink-0">
                <input
                    type="text"
                    placeholder="Search for plants, symptoms, or functions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-4 pl-12 bg-gray-800 rounded-xl border border-gray-700 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                {query && results.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        <p>No matches found for "{query}"</p>
                    </div>
                ) : !query ? (
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
                                    <img
                                        src={result.imagePath}
                                        alt={result.title}
                                        className="w-full md:w-96 h-auto rounded-lg border border-gray-600 object-contain bg-black"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-xl text-purple-300 truncate pr-2">
                                                {result.title || "Page " + result.page}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <FileText size={12} />
                                                <span className="truncate">{result.source}</span>
                                                <span className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300">Pg {result.page}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Matches Snippet */}
                                    <div className="space-y-1 mb-3">
                                        {result.matches.slice(0, 3).map((match, mIdx) => (
                                            <p key={mIdx} className="text-sm text-yellow-100 bg-yellow-900/20 p-1 rounded font-mono">
                                                "...{match}..."
                                            </p>
                                        ))}
                                        {result.matches.length > 3 && (
                                            <p className="text-xs text-gray-500">+{result.matches.length - 3} more matches</p>
                                        )}
                                    </div>

                                    {/* Full Context Expand */}
                                    <details className="mt-2 text-sm text-gray-400">
                                        <summary className="cursor-pointer hover:text-white transition-colors select-none">Show Full Page Text</summary>
                                        <div className="mt-2 p-3 bg-gray-900/50 rounded-lg whitespace-pre-wrap leading-relaxed">
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
    );
};

export default SearchMode;
