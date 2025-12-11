import { useState } from 'react';
import { Menu, X, BookOpen, Gamepad2, Search, Library, BarChart2, AlertCircle, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ topics, currentTopic, onSelectTopic, currentMode, onSelectMode, isOpen, setIsOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const modes = [
        { id: 'review', label: 'Review', icon: BookOpen },
        { id: 'quiz', label: 'Quiz Mode', icon: Gamepad2 },
        { id: 'stats', label: 'Stats', icon: BarChart2 },
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
                bg-gray-900 border-r border-gray-800
                transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isCollapsed ? 'md:w-20' : 'md:w-64'}
                w-64
                flex flex-col h-full
            `}>
                {/* Logo / Header */}
                <div className={`p-6 border-b border-gray-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 whitespace-nowrap">
                            Review Deck
                        </h1>
                    )}
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:block text-gray-400 hover:text-white transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">

                    {/* Modes Section */}
                    <div>
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 fade-in">
                                Modes
                            </h3>
                        )}
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
                                            w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors
                                            ${currentMode === mode.id
                                                ? 'bg-blue-600/20 text-blue-400'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                        `}
                                        title={isCollapsed ? mode.label : ''}
                                    >
                                        <Icon size={20} className="shrink-0" />
                                        {!isCollapsed && <span className="truncate">{mode.label}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Topics Section */}
                    {(currentMode === 'review' || currentMode === 'quiz') && (
                        <div>
                            {!isCollapsed && (
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 fade-in">
                                    Topics
                                </h3>
                            )}
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        onSelectTopic("All");
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors
                                        ${currentTopic === "All"
                                            ? 'bg-purple-600/20 text-purple-400'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                    `}
                                    title="All Cards"
                                >
                                    <Library size={20} className="shrink-0" />
                                    {!isCollapsed && <span className="truncate">All Cards</span>}
                                </button>

                                <button
                                    onClick={() => {
                                        onSelectTopic("Mistakes");
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors
                                        ${currentTopic === "Mistakes"
                                            ? 'bg-red-600/20 text-red-400'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                                    `}
                                    title="My Mistakes"
                                >
                                    <AlertCircle size={20} className="shrink-0" />
                                    {!isCollapsed && <span className="truncate">My Mistakes</span>}
                                </button>

                                {!isCollapsed && (
                                    <>
                                        <div className="h-px bg-gray-800 my-2 mx-2"></div>
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
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Import Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => {
                            onSelectMode('import');
                            setIsOpen(false);
                        }}
                        className={`
                            w-full p-3 rounded-xl flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-colors 
                            ${currentMode === 'import' ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}
                        `}
                        title="Import PDF"
                    >
                        <Upload size={20} className="shrink-0" />
                        {!isCollapsed && <span className="font-medium truncate">Import PDF</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
