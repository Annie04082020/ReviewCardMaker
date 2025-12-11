import { useState, useEffect } from 'react'
import { get as getIDB } from 'idb-keyval'
import Deck from './components/Deck'
import Sidebar from './components/Sidebar'
import QuizMode from './components/QuizMode'
import StatsMode from './components/StatsMode'
import SearchMode from './components/SearchMode'
import ImportMode from './components/ImportMode'
import './index.css'
import cardsData from './data/cards.json'

function App() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentTopic, setCurrentTopic] = useState("All")
    const [currentMode, setCurrentMode] = useState("review")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const refreshData = async () => {
        setLoading(true);
        try {
            // Load static cards
            let allCards = [...cardsData];

            // Load custom cards from IndexedDB
            const customCards = await getIDB('custom_cards');
            if (customCards && Array.isArray(customCards)) {
                allCards = [...allCards, ...customCards];
            }

            setCards(allCards);
        } catch (err) {
            console.error("Failed to load cards", err);
            setCards(cardsData);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, [])

    // Extract unique topics
    const topics = [...new Set(cards.map(card => card.source))]

    // 1. Get all valid cards suitable for quizzing (no cover pages)
    const validCards = cards.filter(card => !card.imagePath.includes('_p0.'));

    // 2. Filter for current topic/mode
    let filteredCards = validCards;

    if (currentTopic === "Mistakes") {
        try {
            const mistakes = JSON.parse(localStorage.getItem('quiz_mistakes')) || [];
            filteredCards = filteredCards.filter(card => mistakes.includes(card.id));
        } catch (e) {
            console.error("Error parsing mistakes", e);
            filteredCards = [];
        }
    } else if (currentTopic !== "All") {
        filteredCards = filteredCards.filter(card => card.source === currentTopic);
    }

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        )
    }

    // Allow empty cards if in Import mode (so user can import to fix empty state)
    if (cards.length === 0 && currentMode !== 'import') {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Cards Found</h1>
                    <p className="mb-4">Please run the python script or import a PDF.</p>
                    <button
                        onClick={() => setCurrentMode('import')}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
                    >
                        Import PDF
                    </button>
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if (currentMode === 'review') {
            return (
                <div className="flex-grow flex items-center justify-center p-4 relative w-full h-full overflow-hidden">
                    {filteredCards.length > 0 ? (
                        <Deck key={currentTopic} cards={filteredCards} />
                    ) : (
                        <div className="text-gray-500 text-center">
                            <p className="text-xl mb-2">No cards in this topic</p>
                            {currentTopic === "Mistakes" && (
                                <p className="text-sm">Great job! You haven't made any mistakes yet (or you fixed them all).</p>
                            )}
                        </div>
                    )}
                </div>
            )
        }
        if (currentMode === 'quiz') {
            return (
                <div className="flex-grow flex items-center justify-center w-full h-full">
                    {/* Allow quiz if we have ANY cards in the filtered deck, provided we have enough TOTAL cards for distractors */}
                    {filteredCards.length > 0 && validCards.length >= 4 ? (
                        <QuizMode cards={filteredCards} allCards={validCards} topic={currentTopic} />
                    ) : (
                        <div className="text-center p-8">
                            <h2 className="text-xl font-bold mb-2">Not Enough Cards</h2>
                            <p className="text-gray-400">
                                {filteredCards.length === 0
                                    ? "No cards available in this deck."
                                    : "You need at least 4 total cards in the library to play (for distractors)."
                                }
                            </p>
                        </div>
                    )}
                </div>
            )
        }
        if (currentMode === 'stats') {
            return <StatsMode />
        }
        if (currentMode === 'search') {
            return <SearchMode />
        }
        if (currentMode === 'import') {
            return <ImportMode onDeckUpdate={refreshData} />
        }
    }

    return (
        <div className="h-screen w-full bg-gray-900 text-white flex overflow-hidden">
            <Sidebar
                topics={topics}
                currentTopic={currentTopic}
                onSelectTopic={setCurrentTopic}
                currentMode={currentMode}
                onSelectMode={setCurrentMode}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-gray-900">
                {renderContent()}
            </div>
        </div>
    )
}

export default App
