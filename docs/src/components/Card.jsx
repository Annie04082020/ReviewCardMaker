import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Card = ({ card, isFlipped: externalIsFlipped, onFlip }) => {
    const [internalIsFlipped, setInternalIsFlipped] = useState(false)

    // Determine if controlled or uncontrolled
    const isControlled = externalIsFlipped !== undefined
    const isFlipped = isControlled ? externalIsFlipped : internalIsFlipped

    const handleFlip = () => {
        if (isControlled) {
            onFlip?.()
        } else {
            setInternalIsFlipped(!internalIsFlipped)
        }
    }

    return (
        <div className="relative w-full max-w-[90%] aspect-video cursor-pointer perspective-1000" onClick={handleFlip}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front of Card (Image + Description) */}
                <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col md:flex-row">
                    <div className="w-full h-2/3 md:w-2/3 md:h-full bg-black flex items-center justify-center relative">
                        {card.imagePath ? (
                            <img
                                src={card.imagePath}
                                alt="Card Content"
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                        {/* Mobile Hint Overlay for Image */}
                        <div className="absolute bottom-2 right-2 md:hidden bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-50">
                            Image
                        </div>
                    </div>
                    <div className="w-full h-1/3 md:w-1/3 md:h-full p-4 md:p-6 flex flex-col justify-center bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700">
                        <h3 className="text-xs md:text-sm uppercase tracking-wider text-gray-400 mb-1 md:mb-2 font-bold">Description</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <p className="text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                {card.description || "No description available."}
                            </p>
                        </div>
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
