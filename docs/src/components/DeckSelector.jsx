import { motion } from 'framer-motion';

const DeckSelector = ({ topics, currentTopic, onSelectTopic }) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 no-scrollbar">
            <div className="flex space-x-2 px-4">
                <button
                    onClick={() => onSelectTopic("All")}
                    className={`
                        px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300
                        ${currentTopic === "All"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/50"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"}
                    `}
                >
                    All Cards
                </button>
                {topics.map((topic) => (
                    <button
                        key={topic}
                        onClick={() => onSelectTopic(topic)}
                        className={`
                            px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300
                            ${currentTopic === topic
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/50"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"}
                        `}
                    >
                        {topic}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DeckSelector;
