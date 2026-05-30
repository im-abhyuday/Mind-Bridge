import React, { useState, useEffect } from 'react';

const NATURE_EMOJIS = ['🌻', '🌲', '🏔️', '🐦', '🍎', '🐬', '🦋', '🌊'];

const WORD_PUZZLES = [
  { prompt: "Which item matches a Dog?", correct: "🐕", correctName: "Puppy", wrong: "🚗", wrongName: "Car" },
  { prompt: "Which item goes with Rain?", correct: "☔", correctName: "Umbrella", wrong: "🔑", wrongName: "Keys" },
  { prompt: "Which item matches Breakfast?", correct: "🥞", correctName: "Pancakes", wrong: "🧹", wrongName: "Broom" },
  { prompt: "Which item goes with a Letter?", correct: "✉️", correctName: "Envelope", wrong: "🪥", wrongName: "Toothbrush" },
];

export default function CognitiveGames() {
  const [activeGame, setActiveGame] = useState('match'); // 'match' or 'word'
  
  // Memory Match Game States
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [matchMessage, setMatchMessage] = useState('Welcome! Find the matching pairs.');

  // Word Association Game States
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedWordOption, setSelectedWordOption] = useState(null); // 'correct' or 'wrong'
  const [wordMessage, setWordMessage] = useState('Tap the item that goes with the words above!');

  // Initialize Memory Match cards
  const initMatchGame = () => {
    const doubled = [...NATURE_EMOJIS, ...NATURE_EMOJIS];
    // Simple robust shuffle
    const shuffled = doubled
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMatchMessage('Cards shuffled! Find the matching pairs.');
  };

  useEffect(() => {
    initMatchGame();
  }, []);

  // Handle card click in Memory Match
  const handleCardClick = (clickedIndex) => {
    // Prevent clicking matched cards, already flipped cards, or when 2 cards are already flipped
    if (
      matchedPairs.includes(cards[clickedIndex].emoji) || 
      flippedIndices.includes(clickedIndex) ||
      flippedIndices.length >= 2
    ) return;

    const newFlipped = [...flippedIndices, clickedIndex];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        const newMatched = [...matchedPairs, firstCard.emoji];
        setMatchedPairs(newMatched);
        setFlippedIndices([]);
        
        const encouragingPraise = [
          'Wonderful job!',
          'Perfect match!',
          'Beautifully done!',
          'You found it! 🌟',
          'Excellent connection!'
        ];
        const randomPraise = encouragingPraise[Math.floor(Math.random() * encouragingPraise.length)];
        
        if (newMatched.length === NATURE_EMOJIS.length) {
          setMatchMessage('🎉 Superb! You completed the matching game. Outstanding effort!');
        } else {
          setMatchMessage(randomPraise);
        }
      } else {
        // No match - turn cards back after delay
        setMatchMessage('Not a match, let\'s try again!');
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1200);
      }
    }
  };

  // Word Association logic
  const handleWordSelect = (optionType) => {
    setSelectedWordOption(optionType);
    if (optionType === 'correct') {
      setWordMessage('🌟 Splendid! That is the perfect match. Excellent associative thinking!');
    } else {
      setWordMessage('That is a good guess! Let\'s think about it again or try another.');
    }
  };

  const handleNextWordPuzzle = () => {
    setSelectedWordOption(null);
    setPuzzleIndex((prev) => (prev + 1) % WORD_PUZZLES.length);
    setWordMessage('Tap the item that goes with the words above!');
  };

  const currentPuzzle = WORD_PUZZLES[puzzleIndex];
  // Simple deterministic shuffle of option buttons so they aren't always in same spot
  const options = [
    { type: 'correct', emoji: currentPuzzle.correct, label: currentPuzzle.correctName },
    { type: 'wrong', emoji: currentPuzzle.wrong, label: currentPuzzle.wrongName }
  ];
  // Deterministic swap based on puzzle index to keep options simple and stable
  if (puzzleIndex % 2 === 0) {
    options.reverse();
  }

  return (
    <div className="patient-panel">
      <h2 className="patient-panel-title">
        <span>🎮</span> Brain Gym
      </h2>
      
      <div className="game-selector">
        <button 
          className={`game-tab-btn ${activeGame === 'match' ? 'active' : ''}`}
          onClick={() => setActiveGame('match')}
        >
          🌸 Nature Matching
        </button>
        <button 
          className={`game-tab-btn ${activeGame === 'word' ? 'active' : ''}`}
          onClick={() => setActiveGame('word')}
        >
          🧩 Word Match
        </button>
      </div>

      {activeGame === 'match' && (
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600, minHeight: '2.5rem' }}>
            {matchMessage}
          </p>

          <div className="memory-match-grid">
            {cards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.emoji);
              return (
                <div 
                  key={card.id}
                  className={`memory-card ${isFlipped ? 'flipped' : ''} ${matchedPairs.includes(card.emoji) ? 'matched' : ''}`}
                  onClick={() => handleCardClick(idx)}
                  role="button"
                  aria-label={`Match card ${idx + 1}`}
                >
                  <div className="memory-card-back">❓</div>
                  <div className="memory-card-front" style={{ fontSize: '2.5rem' }}>{card.emoji}</div>
                </div>
              );
            })}
          </div>

          <button 
            className="vault-btn play-auto-btn" 
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
            onClick={initMatchGame}
          >
            🔄 Restart Match Game
          </button>
        </div>
      )}

      {activeGame === 'word' && (
        <div className="word-game-container">
          <div className="word-prompt">
            {currentPuzzle.prompt}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 600, minHeight: '2rem' }}>
            {wordMessage}
          </p>

          <div className="word-options-grid">
            {options.map((opt) => (
              <div 
                key={opt.type}
                className={`word-option-card ${selectedWordOption === opt.type ? (opt.type === 'correct' ? 'completed' : '') : ''}`}
                style={{
                  borderColor: selectedWordOption === opt.type 
                    ? (opt.type === 'correct' ? 'var(--success)' : 'var(--danger)') 
                    : 'var(--border-color)',
                  background: selectedWordOption === opt.type 
                    ? (opt.type === 'correct' ? 'var(--success-soft)' : 'var(--danger-soft)') 
                    : 'var(--bg-tertiary)'
                }}
                onClick={() => handleWordSelect(opt.type)}
                role="button"
                aria-label={`Option ${opt.label}`}
              >
                <span className="word-option-emoji">{opt.emoji}</span>
                <span className="word-option-label" style={{ color: selectedWordOption === opt.type ? (opt.type === 'correct' ? 'var(--success)' : 'var(--danger)') : 'var(--text-primary)' }}>{opt.label}</span>
              </div>
            ))}
          </div>

          {selectedWordOption === 'correct' && (
            <button 
              className="vault-btn play-auto-btn" 
              style={{ padding: '0.85rem', width: '100%', marginTop: '1rem' }}
              onClick={handleNextWordPuzzle}
            >
              Next Puzzle ▶
            </button>
          )}
        </div>
      )}
    </div>
  );
}
