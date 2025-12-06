import { useState, useEffect } from 'react'
import Deck from './components/Deck'
import './index.css'
import cardsData from './data/cards.json'
import DeckSelector from './components/DeckSelector'

function App() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentTopic, setCurrentTopic] = useState("All")

    useEffect(() => {
        // In a real scenario, we might fetch this, but importing JSON is fine for Vite
        setCards(cardsData)
        setLoading(false)
    }, [])

    // Extract unique topics
    const topics = [...new Set(cards.map(card => card.source))]

    // Filter cards
    const filteredCards = currentTopic === "All"
        ? cards
        : cards.filter(card => card.source === currentTopic)

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

    return (
        <div className="h-full w-full bg-gray-900 text-white flex flex-col overflow-hidden">
            {/* Header & Tabs Area */}
            <div className="flex-none pt-4 pb-2 px-2 flex flex-col items-center z-10 bg-gray-900/95 backdrop-blur-sm">
                <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Review Deck
                </h1>
                <DeckSelector
                    topics={topics}
                    currentTopic={currentTopic}
                    onSelectTopic={setCurrentTopic}
                />
                <div className="mt-2 text-xs text-gray-500 font-mono">
                    {filteredCards.length} Cards in "{currentTopic}"
                </div>
            </div>

            {/* Main Deck Area - Flex Grow to take remaining space */}
            <div className="flex-grow flex items-center justify-center p-4 relative w-full max-w-5xl mx-auto">
                {/* Key prop ensures Deck resets when topic changes */}
                {filteredCards.length > 0 ? (
                    <Deck key={currentTopic} cards={filteredCards} />
                ) : (
                    <div className="text-gray-500">No cards in this topic</div>
                )}
            </div>
        </div>
    )
}

export default App
