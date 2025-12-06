import { useState, useEffect } from 'react'
import Deck from './components/Deck'
import Sidebar from './components/Sidebar'
import QuizMode from './components/QuizMode'
import StatsMode from './components/StatsMode'
import './index.css'
import cardsData from './data/cards.json'

function App() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentTopic, setCurrentTopic] = useState("All")
    const [currentMode, setCurrentMode] = useState("review")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        setCards(cardsData)
        setLoading(false)
    }, [])

    // Extract unique topics
    const topics = [...new Set(cards.map(card => card.source))]

    // Filter cards
    let filteredCards = cards.filter(card => !card.imagePath.includes('_p0.'));

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

    if (cards.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Cards Found</h1>
                    <p>Please run the python script to generate cards.</p>
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
                    {filteredCards.length >= 4 ? (
                        <QuizMode cards={filteredCards} />
                    ) : (
                        <div className="text-center p-8">
                            <h2 className="text-xl font-bold mb-2">Not Enough Cards</h2>
                            <p className="text-gray-400">
                                {currentTopic === "Mistakes"
                                    ? "You need at least 4 mistakes to play a 'Mistakes Quiz'."
                                    : "Please select 'All Cards' or a larger topic to play."}
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
            return (
                <div className="flex-grow flex items-center justify-center text-white text-xl font-bold">
                    Search Mode Coming Soon! 🔍
                </div>
            )
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
