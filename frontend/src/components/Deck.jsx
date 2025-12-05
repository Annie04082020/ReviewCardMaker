import { useState } from 'react'
import Card from './Card'
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

const Deck = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length)
    }

    const prevCard = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }

    const shuffleDeck = () => {
        // Simple shuffle just to jump to a random card for now, 
        // or we could actually reorder the array. 
        // Let's just jump to random.
        const randomIndex = Math.floor(Math.random() * cards.length)
        setCurrentIndex(randomIndex)
    }

    if (!cards || cards.length === 0) return null

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <Card card={cards[currentIndex]} />

            <div className="flex items-center gap-6 bg-gray-800 p-4 rounded-full shadow-lg border border-gray-700">
                <button
                    onClick={prevCard}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
                    title="Previous"
                >
                    <ChevronLeft size={24} />
                </button>

                <span className="text-gray-400 font-mono">
                    {currentIndex + 1} / {cards.length}
                </span>

                <button
                    onClick={nextCard}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white"
                    title="Next"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="w-px h-6 bg-gray-700 mx-2"></div>

                <button
                    onClick={shuffleDeck}
                    className="p-2 hover:bg-purple-600 rounded-full transition-colors text-purple-400 hover:text-white"
                    title="Random"
                >
                    <Shuffle size={20} />
                </button>
            </div>
        </div>
    )
}

export default Deck
