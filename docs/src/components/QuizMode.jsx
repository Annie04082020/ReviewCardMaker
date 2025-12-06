import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizMode = ({ cards, onExit }) => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, feedback, result
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(10);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const TOTAL_ROUNDS = 10;
    const TIME_LIMIT = 15;

    // Start Game
    const startGame = () => {
        setScore(0);
        setRound(1);
        setGameState('playing');
        generateQuestion();
    };

    // Generate Question
    const generateQuestion = () => {
        if (!cards || cards.length < 4) {
            alert("Not enough cards for a quiz! Need at least 4.");
            return;
        }

        const questionIdx = Math.floor(Math.random() * cards.length);
        const questionCard = cards[questionIdx];

        // Generate options (1 correct + 3 distractor)
        const distractors = [];
        while (distractors.length < 3) {
            const idx = Math.floor(Math.random() * cards.length);
            if (idx !== questionIdx && !distractors.includes(idx)) {
                distractors.push(idx);
            }
        }

        const optionCards = [...distractors.map(i => cards[i]), questionCard];
        // Shuffle options
        const shuffledOptions = optionCards.sort(() => Math.random() - 0.5);

        setCurrentQuestion(questionCard);
        setOptions(shuffledOptions);
        setTimeLeft(TIME_LIMIT);
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
                <div className="bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-700">
                    <p className="text-xl text-gray-300 mb-2">10 Questions • Speed Bonus</p>
                    <p className="text-gray-500">Identify the plant from the photo.</p>
                </div>
                <button
                    onClick={startGame}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105"
                >
                <span className="text-xs text-gray-500 uppercase">Question</span>
                <span className="text-xl font-bold text-white max-w-[150px] sm:max-w-none">{round} / {TOTAL_ROUNDS}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className={`text-2xl font-mono font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-blue-400'}`}>
                    {timeLeft}s
                </span>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase">Score</span>
                <span className="text-xl font-bold text-yellow-500">{score}</span>
            </div>
        </div >

    {/* Quiz Content */ }
    < div className = "flex-1 flex flex-col md:flex-row gap-6 items-center justify-center" >

        {/* Image (Question) */ }
        < div className = "flex-1 w-full max-w-md aspect-video md:aspect-auto md:h-80 bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-gray-700" >
            <img
                src={currentQuestion.imagePath}
                alt="Quiz Question"
                className="w-full h-full object-contain"
            />
            </div >

    {/* Options */ }
    < div className = "flex-1 w-full max-w-md flex flex-col gap-3" >
    {
        options.map((option, idx) => {
            let btnClass = "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200";

            // Feedback State Styling
            if (gameState === 'feedback') {
                if (option.title === currentQuestion.title) {
                    btnClass = "bg-green-600 border-green-500 text-white ring-2 ring-green-400/50";
                } else if (option === selectedOption) {
                    btnClass = "bg-red-600 border-red-500 text-white";
                } else {
                    btnClass = "bg-gray-800 opacity-50";
                }
            }

            return (
                <button
                    key={idx}
                    disabled={gameState === 'feedback'}
                    onClick={() => handleAnswer(option)}
                    className={`
                                    w-full p-4 rounded-xl text-left border transition-all duration-200
                                    ${btnClass}
                                `}
                >
                    <span className="text-sm font-medium">{option.title}</span>
                </button>
            );
        })
    }
            </div >
        </div >

    {/* Feedback Overlay Message */ }
    < AnimatePresence >
    { gameState === 'feedback' && (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`
                            absolute bottom-10 left-1/2 transform -translate-x-1/2 
                            px-6 py-2 rounded-full font-bold shadow-xl
                            ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                        `}
        >
            {isCorrect ? 'Correct! +Score' : 'Wrong!'}
        </motion.div>
    )}
        </AnimatePresence >
    </div >
);
};

export default QuizMode;
