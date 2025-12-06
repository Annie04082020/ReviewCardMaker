import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizMode = ({ cards, allCards, topic, onExit }) => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, feedback, result
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(15);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    // Settings
    const [settings, setSettings] = useState({
        questionCount: 10,
        timeLimit: 15
    });

    // The shuffled deck for the current game (ensures no repeats)
    const [quizDeck, setQuizDeck] = useState([]);

    // Detailed Session Tracking
    const [sessionHistory, setSessionHistory] = useState([]);

    // Initialize Settings when cards change
    useEffect(() => {
        if (cards && cards.length > 0) {
            setSettings(prev => ({
                ...prev,
                questionCount: Math.min(10, cards.length)
            }));
        }
    }, [cards]);

    // Start Game
    const startGame = () => {
        // Need at least 4 cards total (library wide) for distractors
        const distractorSource = allCards || cards;

        if (!distractorSource || distractorSource.length < 4) {
            alert("Not enough cards in the library to generate options! Need at least 4.");
            return;
        }

        if (!cards || cards.length < 1) {
            alert("No cards in this deck to test!");
            return;
        }

        // 1. Shuffle and Create Unique Deck from the specific topic cards
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        const selectedDeck = shuffled.slice(0, Math.min(settings.questionCount, cards.length));
        setQuizDeck(selectedDeck);

        setScore(0);
        setRound(1);
        setSessionHistory([]);
        setGameState('playing');

        // Pass the first card directly to avoid state delay issues
        generateQuestion(selectedDeck[0], selectedDeck, 1);
    };

    // Generate Question (using pre-shuffled deck)
    const generateQuestion = (cardOverride = null, deckOverride = null, roundOverride = null) => {
        const activeDeck = deckOverride || quizDeck;
        const currentRound = roundOverride || round;
        const cardIndex = cardOverride ? 0 : (currentRound - 1);

        const questionCard = cardOverride || activeDeck[cardIndex];

        if (!questionCard) {
            console.error("No question card found!", currentRound, activeDeck.length);
            setGameState('result');
            return;
        }

        // Generate options (1 correct + 3 distractor)
        const distractors = [];
        // Distractors come from the FULL library (allCards) if available, to allow small decks
        const fullDeck = allCards || cards;

        while (distractors.length < 3) {
            const idx = Math.floor(Math.random() * fullDeck.length);
            const distractor = fullDeck[idx];

            // Ensure unique distractors and not the target answer
            if (distractor.title !== questionCard.title && !distractors.some(d => d.title === distractor.title)) {
                distractors.push(distractor);
            }
        }

        const optionCards = [...distractors, questionCard];
        // Shuffle options
        const shuffledOptions = optionCards.sort(() => Math.random() - 0.5);

        setCurrentQuestion(questionCard);
        setOptions(shuffledOptions);
        setTimeLeft(settings.timeLimit);
        setSelectedOption(null);
        setIsCorrect(false);
    };

    // Timer
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'playing' && timeLeft === 0) {
            handleAnswer(null); // Time out
        }
    }, [timeLeft, gameState]);

    // Handle Answer
    const handleAnswer = (option) => {
        setSelectedOption(option);
        const correct = option && option.title === currentQuestion.title;
        setIsCorrect(correct);

        const timeTaken = settings.timeLimit - timeLeft;
        const points = correct ? (10 + Math.ceil(timeLeft / 2)) : 0;
        if (correct) {
            setScore(score + points);
        }

        // --- Mistake Tracking Logic ---
        const mistakes = JSON.parse(localStorage.getItem('quiz_mistakes')) || [];
        const cardId = currentQuestion.imagePath;

        if (!correct) {
            if (!mistakes.includes(cardId)) {
                mistakes.push(cardId);
            }
        } else {
            const index = mistakes.indexOf(cardId);
            if (index > -1) {
                mistakes.splice(index, 1);
            }
        }
        localStorage.setItem('quiz_mistakes', JSON.stringify(mistakes));
        // -----------------------------

        // --- Detailed History Logic ---
        setSessionHistory(prev => [...prev, {
            question: currentQuestion.title,
            image: currentQuestion.imagePath,
            source: currentQuestion.source,
            isCorrect: correct,
            selected: option ? option.title : "Time Out",
            points: points,
            timeTaken: timeTaken
        }]);
        // ------------------------------

        setGameState('feedback');

        // Next round after delay
        setTimeout(() => {
            if (round >= settings.questionCount) {
                setGameState('result');
            } else {
                const nextRound = round + 1;
                setRound(nextRound);
                setGameState('playing');
                generateQuestion(null, null, nextRound);
            }
        }, 1500);
    };

    // Save stats when game ends
    useEffect(() => {
        if (gameState === 'result') {
            const stats = JSON.parse(localStorage.getItem('quiz_stats')) || { gamesPlayed: 0, totalScore: 0, history: [] };
            stats.gamesPlayed += 1;
            stats.totalScore += score;

            stats.history.push({
                score: score,
                date: new Date().toISOString(),
                topic: topic || "Mixed",
                details: sessionHistory
            });
            localStorage.setItem('quiz_stats', JSON.stringify(stats));
            localStorage.setItem('last_session_details', JSON.stringify(sessionHistory));
        }
    }, [gameState]);

    if (gameState === 'menu') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-8 text-center w-full max-w-2xl bg-gray-800/50 rounded-3xl border border-gray-700 shadow-2xl backdrop-blur-sm m-auto">
                <div className="space-y-2">
                    <h2 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                        Quiz Challenge
                    </h2>
                    <p className="text-gray-400 text-lg">Test your knowledge</p>
                </div>

                {/* Settings Controls */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700 flex flex-col gap-3">
                        <label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Length</label>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setSettings(s => ({ ...s, questionCount: Math.max(1, s.questionCount - 1) }))}
                                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold"
                            >-</button>
                            <span className="text-3xl font-mono font-bold text-white">{settings.questionCount}</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, questionCount: Math.min(cards.length, s.questionCount + 1) }))}
                                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold"
                            >+</button>
                        </div>
                        <p className="text-xs text-gray-500">questions</p>
                    </div>

                    <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700 flex flex-col gap-3">
                        <label className="text-gray-300 text-sm font-bold uppercase tracking-wider">Timer</label>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setSettings(s => ({ ...s, timeLimit: Math.max(5, s.timeLimit - 5) }))}
                                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold"
                            >-</button>
                            <span className="text-3xl font-mono font-bold text-white">{settings.timeLimit}</span>
                            <button
                                onClick={() => setSettings(s => ({ ...s, timeLimit: Math.min(60, s.timeLimit + 5) }))}
                                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold"
                            >+</button>
                        </div>
                        <p className="text-xs text-gray-500">seconds / q</p>
                    </div>
                </div>

                <div className="w-full pt-4">
                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-white font-bold text-2xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Start Quiz
                    </button>
                    <p className="text-xs text-gray-500 mt-4"> Deck size: {cards ? cards.length : 0} cards available</p>
                </div>
            </div>
        );
    }

    if (gameState === 'result') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-fade-in">
                <h2 className="text-3xl font-bold text-white">Game Over!</h2>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                    {score}
                </div>
                <p className="text-gray-400">Final Score</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => setGameState('menu')}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-white font-medium"
                    >
                        Menu
                    </button>
                    <button
                        onClick={startGame}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-medium"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl h-full flex flex-col p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-bold">Progress</span>
                    <span className="text-xl font-bold text-white">{round} <span className="text-gray-500">/ {settings.questionCount}</span></span>
                </div>
                <div className="flex flex-col items-center">
                    <span className={`text-4xl font-mono font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                        {timeLeft}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 uppercase font-bold">Score</span>
                    <span className="text-xl font-bold text-yellow-500">{score}</span>
                </div>
            </div>

            {/* Quiz Content */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8 items-center justify-center w-full">

                {/* Image (Question) */}
                <div className="flex-1 w-full max-w-2xl aspect-video lg:h-[500px] bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-700 relative group">
                    <img
                        src={currentQuestion.imagePath}
                        alt="Quiz Question"
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        source: {currentQuestion.source}
                    </div>
                </div>

                {/* Options */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4">
                    {options.map((option, idx) => {
                        let btnClass = "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200";

                        // Feedback State Styling
                        if (gameState === 'feedback') {
                            if (option.title === currentQuestion.title) {
                                btnClass = "bg-green-600 border-green-500 text-white ring-4 ring-green-500/20";
                            } else if (option === selectedOption) {
                                btnClass = "bg-red-600 border-red-500 text-white";
                            } else {
                                btnClass = "bg-gray-800 opacity-30";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                disabled={gameState === 'feedback'}
                                onClick={() => handleAnswer(option)}
                                className={`
                                    w-full p-6 rounded-2xl text-left border-2 transition-all duration-200 shadow-lg
                                    ${btnClass}
                                    ${gameState !== 'feedback' ? 'hover:-translate-y-1 hover:shadow-xl active:translate-y-0' : ''}
                                `}
                            >
                                <span className="text-lg font-bold">{option.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Feedback Overlay Message */}
            <AnimatePresence>
                {gameState === 'feedback' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`
                            fixed bottom-12 left-1/2 transform -translate-x-1/2 
                            px-8 py-4 rounded-2xl font-black text-2xl shadow-2xl z-50 backdrop-blur-md border border-white/10
                            ${isCorrect ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}
                        `}
                    >
                        {isCorrect ? 'Correct! 🎉' : 'Oops! ❌'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizMode;
