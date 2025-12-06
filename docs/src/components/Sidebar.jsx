import { useState } from 'react';
import { Menu, X, BookOpen, Gamepad2, Search, Library } from 'lucide-react';

const Sidebar = ({ topics, currentTopic, onSelectTopic, currentMode, onSelectMode, isOpen, setIsOpen }) => {

    const modes = [
        { id: 'review', label: 'Review', icon: BookOpen },
        { id: 'quiz', label: 'Quiz Mode', icon: Gamepad2 },
        { id: 'search', label: 'Search', icon: Search },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg text-white"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40
                w-64 bg-gray-900 border-r border-gray-800
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                flex flex-col h-full
            `}>
                {/* Logo / Header */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Review Deck
                    </h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8">

                    {/* Modes Section */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                            Modes
                        </h3>
                        <div className="space-y-1">
                            {modes.map((mode) => {
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => {
                                            onSelectMode(mode.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                                            ${currentMode === mode.id
                                                ? 'bg-blue-600/20 text-blue-400'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                        `}
                                    >
                                        <Icon size={20} />
                                        <span>{mode.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Topics Section (Only show if in Review or Quiz mode) */}
                    {(currentMode === 'review' || currentMode === 'quiz') && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                                Topics
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        onSelectTopic("All");
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                                        ${currentTopic === "All"
                                            ? 'bg-purple-600/20 text-purple-400'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                    `}
                                >
                                    <Library size={20} />
                                    <span>All Cards</span>
                                </button>
                                {topics.map((topic) => (
                                    <button
                                        key={topic}
                                        onClick={() => {
                                            onSelectTopic(topic);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full text-left px-3 py-2 rounded-lg transition-colors text-sm truncate
                                            ${currentTopic === topic
                                                ? 'bg-purple-600/20 text-purple-400'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                        `}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
