import React, { useState, useEffect } from "react";
import DinoCharacter from "./DinoCharacter";
import ParticleEffect from "./ParticleEffect";
import { useMicrophone } from "@/hooks/useMicrophone";
import { useDinoVoice } from "@/hooks/useDinoVoice";
import { useParentStore } from "@/store/parentStore";
import { useGameStore } from "@/store/gameStore";

const letterSounds: Record<string, string> = {
  A: "ay", B: "buh", C: "kuh", D: "duh", E: "ee", F: "fff", G: "guh", H: "huh",
  I: "ih", J: "juh", K: "kuh", L: "lll", M: "mmm", N: "nnn", O: "oh", P: "puh",
  Q: "kwuh", R: "rrr", S: "sss", T: "tuh", U: "uh", V: "vuh", W: "wuh", 
  X: "ks", Y: "yuh", Z: "zzz",
};

const letterWords: Record<string, string[]> = {
  A: ["Apple", "Ant", "Airplane"],
  B: ["Ball", "Bear", "Banana"],
  C: ["Cat", "Car", "Cookie"],
  D: ["Dog", "Duck", "Door"],
  E: ["Elephant", "Egg", "Eye"],
  F: ["Fish", "Frog", "Fire"],
  G: ["Goat", "Green", "Gift"],
  H: ["Hat", "House", "Happy"],
  I: ["Ice", "Igloo", "Island"],
  J: ["Jump", "Juice", "Jar"],
  K: ["Kite", "Key", "King"],
  L: ["Lion", "Leaf", "Light"],
  M: ["Moon", "Mouse", "Music"],
  N: ["Nest", "Night", "Nose"],
  O: ["Ocean", "Orange", "Owl"],
  P: ["Pig", "Pizza", "Purple"],
  Q: ["Queen", "Quiet", "Quick"],
  R: ["Rainbow", "Robot", "Red"],
  S: ["Sun", "Star", "Snake"],
  T: ["Tree", "Tiger", "Toy"],
  U: ["Umbrella", "Up", "Under"],
  V: ["Violin", "Van", "Very"],
  W: ["Water", "Wind", "Whale"],
  X: ["X-ray", "Fox", "Box"],
  Y: ["Yellow", "Yes", "Yard"],
  Z: ["Zebra", "Zoo", "Zero"],
};

const allLetters = Object.keys(letterSounds);
const encouragingPhrases = [
  "Great job! I heard you try!",
  "Awesome! You did it!",
  "Perfect! You're learning so well!",
  "Wonderful! Keep it up!",
  "Fantastic work!",
  "You're amazing at this!",
  "Beautiful pronunciation!",
  "Excellent effort!",
  "You're a speaking star!",
  "Magnificent attempt!"
];

const getRandomLetter = () => allLetters[Math.floor(Math.random() * allLetters.length)];
const getRandomPhrase = () => encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];

const PronunciationGame: React.FC = () => {
  const { recognizeSpeech, listening } = useMicrophone();
  const { say } = useDinoVoice();
  const { setLetterProgress } = useParentStore();
  const { dinoColor, dinoAccessory } = useGameStore();
  
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [gameMode, setGameMode] = useState<"sounds" | "words">("sounds");
  const [currentWord, setCurrentWord] = useState("");

  useEffect(() => {
    if (gameMode === "words") {
      const words = letterWords[currentLetter];
      setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    }
  }, [currentLetter, gameMode]);

  const handleTry = async () => {
    setFeedback(null);
    
    if (gameMode === "sounds") {
      // Dino explains the letter sound
      await say(`This is the letter ${currentLetter}. It makes the "${letterSounds[currentLetter]}" sound. You try!`);
    } else {
      // Dino explains the word
      await say(`This word starts with ${currentLetter}. The word is "${currentWord}". Can you say it?`);
    }
    
    try {
      await recognizeSpeech(); // MVP: Accept any attempt
      const phrase = getRandomPhrase();
      setFeedback(phrase);
      say(phrase);
      
      // Show celebration
      setShowParticles(true);
      
      // Mark as practiced
      setLetterProgress(currentLetter, "in-progress");
      
      setTimeout(() => {
        setCurrentLetter(getRandomLetter());
        setFeedback(null);
        setShowParticles(false);
      }, 2000);
    } catch (error) {
      setFeedback("Good try! Let's try another one!");
      say("Good try! Let's try another one!");
      setTimeout(() => {
        setCurrentLetter(getRandomLetter());
        setFeedback(null);
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
      {/* Mode Toggle */}
      <div className="absolute top-8 flex gap-2 z-20">
        <button
          onClick={() => setGameMode("sounds")}
          className={`px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            gameMode === "sounds" 
              ? "bg-pink-200 border-2 border-pink-400 scale-105" 
              : "bg-white hover:bg-pink-50"
          }`}
        >
          🔤 Letter Sounds
        </button>
        <button
          onClick={() => setGameMode("words")}
          className={`px-4 py-2 rounded-full font-bold shadow-lg transition-all ${
            gameMode === "words" 
              ? "bg-purple-200 border-2 border-purple-400 scale-105" 
              : "bg-white hover:bg-purple-50"
          }`}
        >
          📚 Words
        </button>
      </div>
      
      {/* Dino Character */}
      <div className="mb-8">
        <DinoCharacter 
          animationState={listening ? "talking" : "idle"} 
          dinoColor={dinoColor}
          accessoryType={dinoAccessory}
        />
      </div>
      
      {/* Current Letter/Word Display */}
      <div className="bg-white/90 rounded-3xl px-12 py-8 shadow-2xl border-4 border-blue-200 mb-8">
        <div className="text-8xl font-extrabold mb-4 text-center text-blue-800">
          {currentLetter}
        </div>
        {gameMode === "sounds" ? (
          <div className="text-2xl text-center text-gray-700 font-semibold">
            Makes the "{letterSounds[currentLetter]}" sound
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {currentWord}
            </div>
            <div className="text-lg text-gray-600">
              Starts with "{currentLetter}"
            </div>
          </div>
        )}
      </div>
      
      {/* Microphone Button */}
      <button
        onClick={handleTry}
        className={`rounded-full w-24 h-24 flex items-center justify-center text-4xl bg-yellow-200 border-4 border-blue-300 mb-6 shadow-xl font-bold transition-all ${
          listening ? "animate-pulse scale-110 bg-pink-200 border-pink-400" : "hover:scale-105 hover:bg-yellow-300"
        }`}
        disabled={listening}
        aria-label="Press to Try"
      >
        🎤
      </button>
      
      {/* Feedback */}
      {feedback && (
        <div className="text-2xl mt-4 text-green-700 font-bold animate-bounce bg-green-100 px-6 py-3 rounded-2xl border-2 border-green-300">
          {feedback}
        </div>
      )}
      
      {/* Instructions */}
      <div className="absolute bottom-8 text-lg text-gray-600 text-center bg-white/80 px-6 py-3 rounded-xl">
        {listening ? "🎵 Listening..." : `Press the mic and say the ${gameMode === "sounds" ? "letter sound" : "word"}!`}
      </div>
      
      {/* Particle Effects */}
      <ParticleEffect
        x={400}
        y={300}
        type="hearts"
        active={showParticles}
        onComplete={() => setShowParticles(false)}
      />
    </div>
  );
};

export default PronunciationGame;