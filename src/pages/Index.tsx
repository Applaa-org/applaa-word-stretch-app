import { useState, useEffect, useCallback } from "react";
import { AppShell, HeroSection, StatsRow } from "@/components/applaa";
import { APP_CONFIG } from "@/app-config";

const WORDS = [
  "APPLE", "TIGER", "HOUSE", "WATER", "HAPPY", "SMILE", "DREAM", "MUSIC",
  "EARTH", "STORM", "BEACH", "CLOUD", "DANCE", "PAPER", "LIGHT", "BRAIN",
  "CHAIR", "TABLE", "PHONE", "PLANT", "FRUIT", "JUICE", "BREAD", "GRAPE",
  "LEMON", "MANGO", "PIZZA", "SALAD", "COOKIE", "CANDY", "CLOCK", "STONE",
  "TRAIN", "WORLD", "SPACE", "ROBOT", "GHOST", "WITCH", "MAGIC", "POWER",
  "SNAKE", "EAGLE", "SHARK", "WHALE", "PANDA", "ZEBRA", "KOALA", "MOUSE"
];

type MessageType = "success" | "error" | "hint";

interface LetterTile {
  letter: string;
  index: number;
}

export function Index() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<LetterTile[]>([]);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; type: MessageType } | null>(null);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedIndices, setAnimatedIndices] = useState<Set<number>>(new Set());

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGamesPlayed(prev => prev + 1);
    setCurrentStreak(0);
    setSelectedLetters([]);
    setMessage(null);
    newRound();
  }, []);

  const newRound = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setSelectedLetters([]);
    setMessage(null);
    setAnimatedIndices(new Set());
    
    const letters = randomWord.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setShuffledLetters(letters);
  }, []);

  const handleLetterClick = useCallback((letter: string, index: number) => {
    if (selectedLetters.length < shuffledLetters.length) {
      const newIndex = selectedLetters.length;
      setSelectedLetters([...selectedLetters, { letter, index }]);
      setAnimatedIndices(prev => new Set([...prev, newIndex]));
      setMessage(null);
    }
  }, [selectedLetters.length, shuffledLetters.length]);

  const handleSelectedLetterClick = useCallback((idx: number) => {
    setSelectedLetters(selectedLetters.filter((_, i) => i !== idx));
  }, [selectedLetters]);

  const checkWord = useCallback(() => {
    const guessedWord = selectedLetters.map(l => l.letter).join("");
    
    if (guessedWord.length === 0) {
      setMessage({ text: "Select some letters first!", type: "error" });
      return;
    }

    if (guessedWord === currentWord) {
      setMessage({ text: `🎉 Correct! "${currentWord}"`, type: "success" });
      setWordsSolved(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        return newStreak;
      });
      setTimeout(newRound, 2000);
    } else if (guessedWord.length === currentWord.length) {
      setMessage({ text: "Not quite right. Try again!", type: "error" });
    } else {
      setMessage({ text: "Keep going! " + (currentWord.length - guessedWord.length) + " more letters", type: "hint" });
    }
  }, [selectedLetters, currentWord, bestStreak, newRound]);

  const showHint = useCallback(() => {
    const guessedWord = selectedLetters.map(l => l.letter).join("");
    const correctLetters = currentWord.split("");
    let hintIndex = -1;
    
    for (let i = 0; i < correctLetters.length; i++) {
      if (guessedWord[i] !== correctLetters[i]) {
        hintIndex = i;
        break;
      }
    }
    
    if (hintIndex === -1 && guessedWord.length < correctLetters.length) {
      hintIndex = guessedWord.length;
    }
    
    if (hintIndex >= 0) {
      const correctLetter = correctLetters[hintIndex];
      setMessage({ text: `💡 Position ${hintIndex + 1} is "${correctLetter}"`, type: "hint" });
    }
  }, [selectedLetters, currentWord]);

  const clearLetters = useCallback(() => {
    setSelectedLetters([]);
    setAnimatedIndices(new Set());
    setMessage(null);
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (key === "Enter") {
      checkWord();
    } else if (key === "Backspace") {
      setSelectedLetters(prev => prev.slice(0, -1));
    } else if (key === "Escape") {
      setIsPlaying(false);
    }
  }, [checkWord]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyPress(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <span className="text-3xl">🎉</span>
        </div>
      ))}
    </div>
  );

  return (
    <AppShell>
      <HeroSection onCtaClick={startGame} />

      {isPlaying && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
          {showConfetti && <Confetti />}
          
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-lg border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Streak: {currentStreak} 🔥
                </div>
                <div className="text-purple-300 text-sm">
                  Word #{wordsSolved + 1}
                </div>
              </div>
              <button
                onClick={() => setIsPlaying(false)}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >
                ✕ Exit
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-4 font-medium">
                Tap letters to form a word
              </p>
              
              {/* Selected letters area */}
              <div className="min-h-[80px] flex items-center justify-center gap-3 mb-6 p-4 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700">
                {selectedLetters.length === 0 ? (
                  <span className="text-slate-600 text-sm">Select letters below...</span>
                ) : (
                  selectedLetters.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectedLetterClick(idx)}
                      className={`w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-2xl font-bold rounded-xl shadow-lg hover:scale-110 hover:shadow-pink-500/50 transition-all duration-200 animate-pop ${
                        animatedIndices.has(idx) ? 'scale-110' : ''
                      }`}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {item.letter}
                    </button>
                  ))
                )}
              </div>

              {/* Letter tiles */}
              <div className="flex flex-wrap justify-center gap-3">
                {shuffledLetters.map((letter, idx) => {
                  const isSelected = selectedLetters.some(s => s.index === idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => !isSelected && handleLetterClick(letter, idx)}
                      disabled={isSelected}
                      className={`w-14 h-14 text-2xl font-bold rounded-xl transition-all duration-200 ${
                        isSelected
                          ? "bg-slate-800 text-slate-600 cursor-not-allowed border-2 border-slate-700"
                          : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:scale-110 hover:shadow-cyan-500/50 shadow-lg cursor-pointer border-2 border-cyan-400/50"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {message && (
              <div className={`text-center mb-4 p-4 rounded-xl animate-slide-in ${
                message.type === "success" 
                  ? "bg-green-500/20 text-green-300 border border-green-500/50" 
                  : message.type === "error"
                  ? "bg-red-500/20 text-red-300 border border-red-500/50"
                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50"
              }`}>
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={showHint}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-all duration-200 text-sm"
              >
                💡 Hint
              </button>
              <button
                onClick={clearLetters}
                className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 text-sm"
              >
                🔄 Clear
              </button>
              <button
                onClick={checkWord}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-green-500/50 transition-all duration-200 text-sm"
              >
                ✓ Check
              </button>
            </div>

            <div className="flex justify-center gap-4 mt-4 text-xs text-slate-500">
              <span className="bg-slate-900/50 px-3 py-1 rounded-full">Enter to check</span>
              <span className="bg-slate-900/50 px-3 py-1 rounded-full">Backspace to undo</span>
              <span className="bg-slate-900/50 px-3 py-1 rounded-full">Esc to exit</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="text-2xl animate-bounce">🎯</span> How to Play
          </h2>
          <div className="space-y-3">
            {[
              { emoji: "1️⃣", text: "Tap shuffled letter tiles to select them in order" },
              { emoji: "2️⃣", text: "Arrange the letters to form the correct word" },
              { emoji: "3️⃣", text: "Press Check or hit Enter to submit your answer" },
              { emoji: "4️⃣", text: "Build streaks by solving words quickly!" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="text-xl flex-shrink-0">{step.emoji}</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-purple-200 dark:border-purple-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="text-2xl animate-pulse">⚡</span> Game Features
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "💡", label: "Smart Hints", desc: "Get letter position help" },
              { emoji: "🔄", label: "Quick Clear", desc: "Reset your selection" },
              { emoji: "✓", label: "Instant Check", desc: "Validate your word" },
              { emoji: "⌨️", label: "Keyboard", desc: "Full keyboard support" },
            ].map((feature) => (
              <div key={feature.label} className="text-center p-4 bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white mb-1">{feature.label}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="text-2xl">🏆</span> Pro Tips
          </h2>
          <div className="space-y-3">
            {[
              "✨ Look for common letter patterns (TH, CH, SH, ED)",
              "✨ Try starting with vowels if you spot them",
              "✨ Build streaks by solving words quickly",
              "✨ Use hints wisely - they reveal exact positions!",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-2 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent rounded-lg">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400 flex-shrink-0">{i + 1}.</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{tip.slice(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-cyan-200 dark:border-cyan-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
            <span className="text-2xl">📊</span> Word Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {APP_CONFIG.items.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-lg">
                  {item.badge}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{item.title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes slide-in {
          0% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-pop {
          animation: pop 0.3s ease-in-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fall {
          animation: fall 2s ease-in forwards;
        }
      `}</style>
    </AppShell>
  );
}
