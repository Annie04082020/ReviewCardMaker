import { useState, useEffect } from 'react'
import Deck from './components/Deck'
import './index.css'

// Import data directly if possible, or fetch it. 
// Since we are generating it into src/data, we can import it.
import cardsData from './data/cards.json'

function App() {
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real scenario, we might fetch this, but importing JSON is fine for Vite
        setCards(cardsData)
        setLoading(false)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                Loading...
            </div>
        )
    }

    if (cards.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Cards Found</h1>
                    <p>Please run the python script to generate cards.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Review Deck
            </h1>
            <Deck cards={cards} />
        </div>
    )
}

export default App
