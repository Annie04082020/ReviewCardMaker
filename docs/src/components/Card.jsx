import { useState } from 'react'
import { motion } from 'framer-motion'

const Card = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="relative w-full max-w-2xl aspect-video cursor-pointer perspective-1000" onClick={handleFlip}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card (Image + Description) */}
                <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex">
                    <div className="w-2/3 h-full bg-black flex items-center justify-center">
                        {card.imagePath ? (
                            <img
                                src={card.imagePath}
                                alt="Card Content"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                    </div>
                    <div className="w-1/3 p-6 flex flex-col justify-center bg-gray-800 border-l border-gray-700">
                        <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Description</h3>
                        <p className="text-gray-200 text-sm leading-relaxed overflow-y-auto max-h-full">
                            {card.description || "No description available."}
                        </p>
                    </div>
                </div>

                {/* Back of Card (Title/Answer) */}
                <div
                    className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-2xl flex items-center justify-center p-8 text-center"
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                >
                    <div>
                        <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                            {card.title || "Untitled"}
                        </h2>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Card
