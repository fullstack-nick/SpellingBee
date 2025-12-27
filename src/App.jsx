import { useState, useEffect, useRef, use } from 'react';
import './App.css';
import Header from './components/Header';
import HexBoard from './components/HexBoard';
import WordPanel from './components/WordPanel';
import YouWon from './components/YouWon.jsx';
import Server from './backend/Server';
import Rankings from './components/Rankings.jsx';
import { validateWord } from './backend/validator.js';
import { validatePangram } from './backend/pangramValidator.js';

const MAX_INPUT = 20;

function App() {
  const [inputs, setInputs] = useState([]);
  const [isFocused, setIsFocused] = useState(true);
  const [locked, setLocked] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [win, setWin] = useState(false);
  const [thresholds, setThresholds] = useState(() => {
    return JSON.parse(localStorage.getItem('thresholds')) || [];
  });
  const [currentPoints, setCurrentPoints] = useState(() => {
    return Number(localStorage.getItem('currentPoints')) || 0;
  });
  const [score, setScore] = useState(() => {
    return Number(localStorage.getItem('score')) || 0;
  });
  const [pointsWon, setPointsWon] = useState(0);
  const [guessedWords, setGuessedWords] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('guessedWords')) || [];
    return Array.from(new Set(stored));
  });
  const [letters, setLetters] = useState(() => {
    return JSON.parse(localStorage.getItem('letters')) || [];
  });
  const [allWordsCount, setAllWordsCount] = useState(0);
  const [centralLetter, setCentralLetter] = useState(() => {
    return localStorage.getItem('centralLetter') || '';
  });
  const [pangram, setPangram] = useState(() => {
    return localStorage.getItem('pangram') || '';
  });
  const [usedNonExistent, setUsedNonExistent] = useState(false);
  const [missingCentral, setMissingCentral] = useState(false);
  const [doesntExist, setDoesntExist] = useState(false);
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userWon, setUserWon] = useState(false);
  const [tooManyLetters, setTooManyLetters] = useState(false);
  const [detailedRankings, setDetailedRanking] = useState(false);
  const [startReload, setStartReload] = useState(false);
  const [gameIsSet, setGameIsSet] = useState(() => {
    return JSON.parse(localStorage.getItem('gameIsSet')) || false;
  });
  const lockTimeoutRef = useRef(null);
  const enterLockRef = useRef(false);
  const childRef = useRef();
  const centralRef = useRef();

  useEffect(() => {
    
    localStorage.setItem('thresholds', JSON.stringify(thresholds));
    localStorage.setItem('currentPoints', currentPoints.toString());
    localStorage.setItem('score', score.toString());
    localStorage.setItem('guessedWords', JSON.stringify(guessedWords));
    localStorage.setItem('letters', JSON.stringify(letters));
    localStorage.setItem('centralLetter', centralLetter);
    localStorage.setItem('pangram', pangram);

  }, [thresholds, currentPoints, score, guessedWords, letters, centralLetter, pangram])
  
  useEffect(() => {
    if (startReload) {
      localStorage.clear();
      setThresholds([]);
      setCurrentPoints(0);
      setScore(0);
      setGuessedWords([]);
      setLetters([]);
      setCentralLetter('');
      setPangram('');
      setGameIsSet(false);
      localStorage.setItem('gameIsSet', JSON.stringify(false));
      setUserWon(false);
      setStartReload(false);
    }

  }, [startReload])
  

  useEffect(() => {
    document.body.classList.add("min-h-screen", "text-[20px]", "w-full", "flex", "flex-col");

    return () => document.body.classList.remove("min-h-screen", "text-[20px]", "w-full", "flex", "flex-col");
  }, []);

  useEffect(() => {
    setCentralLetter(letters[3]);
  }, [letters])
  

  useEffect(() => {
    if (locked) return;

    function handleKeyDown(e) {
      if (!isFocused) return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        if (inputs.length < MAX_INPUT) {
          setInputs((prev) => [...prev, key]);
        } else {
          triggerLock(setLocked);
          triggerLock(setTooManyLetters);
        }
      } else if (key === 'BACKSPACE') {
        setInputs((prev) => prev.slice(0, -1));
      } else if (key === 'ENTER') {
        if (childRef.current) {
          handleEnter();
        } else {
          return;
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, locked, inputs]);

  useEffect(() => {
    if (locked) return;
    const handleHexClick = (e) => {
      const value = e.currentTarget.textContent.trim().toUpperCase();
      if (inputs.length < MAX_INPUT) {
        setInputs((prev) => [...prev, value]);
      } else {
        triggerLock(setLocked);
        triggerLock(setTooManyLetters);
      }
    };
    const hexes = document.querySelectorAll('.hex');
    hexes.forEach((hex) => hex.addEventListener('click', handleHexClick));
    return () => {
      hexes.forEach((hex) => hex.removeEventListener('click', handleHexClick));
    };
  }, [locked, inputs]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const addGuessedWord = (word) => {
    setGuessedWords((prev) => (prev.includes(word) ? prev : [...prev, word]));
  };

  const handleEnter = async () => {
    if (enterLockRef.current) return;
    enterLockRef.current = true;
    try {
      if (locked) return;
      const testWord = inputs;
      let word = testWord.join('').toLowerCase();
      const testForPangram = word.toUpperCase();
      word = word.charAt(0).toUpperCase() + word.slice(1);
      if (testWord.length === 0) return;
      const centralLetter = centralRef.current.getLetter();
      if (testWord.length < 4) {
        triggerLock(setLocked);
        triggerLock(setTooShort);
        return;
      }

      if (testWord.some(letter => !letters.includes(letter))) {
        triggerLock(setLocked);
        triggerLock(setUsedNonExistent);
        return;
      };
      if (!testWord.includes(centralLetter)) {
        triggerLock(setLocked);
        triggerLock(setMissingCentral);
        return;
      };
      setLocked(true);
      if (await validateWord(word)) {
        if ((await validatePangram(word)) || testForPangram === pangram) {
          if (!guessedWords.includes(word)) {
            setInputs([]);
            setWin(true);
            setPointsWon(7);
            const nextPoints = currentPoints + 7;
            setCurrentPoints((prev) => prev + 7);
            if (nextPoints >= thresholds[score + 1]) setScore(prev => prev + 1);
            addGuessedWord(word);
            if (nextPoints >= thresholds[thresholds.length - 1]) setUserWon(true);
          } else {
            triggerLock(setAlreadyGuessed);
          }
        } else {
          if (!guessedWords.includes(word)) {
            setInputs([]);
            setWin(true);
            const nextPoints = currentPoints + (testWord.length - 3);
            setPointsWon(testWord.length - 3);
            setCurrentPoints((prev) => prev + (testWord.length - 3));
            if (nextPoints >= thresholds[score + 1]) setScore(prev => prev + 1);
            addGuessedWord(word);
            if (nextPoints >= thresholds[thresholds.length - 1]) setUserWon(true);
          } else {
            triggerLock(setAlreadyGuessed);
          }
        }
      } else {
        triggerLock(setDoesntExist);
      }
      setLocked(false);
    } finally {
      enterLockRef.current = false;
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setPointsWon(0);
      setWin(false);
    }, 1000);
  }, [pointsWon])
  

  const handleDelete = () => {
    setInputs((prev) => prev.slice(0, -1));
  }

  const randomize = () => {
    setLetters(prev => {
      const arr = [...prev];
      const centralLetter = arr[3];
      const arrNoCentral = arr.filter((_, i) => i!==3);
      for (let i = arrNoCentral.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrNoCentral[i], arrNoCentral[j]] = [arrNoCentral[j], arrNoCentral[i]];
      }
      arrNoCentral.splice(3, 0, centralLetter);
      return arrNoCentral;
    })
  }

  function triggerLock(setState) {
    setState(true);
    lockTimeoutRef.current = setTimeout(() => {
      setState(false);
      childRef.current?.focusInput();
    }, 2000);
    setInputs([]);
  }

  useEffect(() => {
    return () => clearTimeout(lockTimeoutRef.current);
  }, []);


  return (
    <>
      <Header/>
      {/* {allWordsCount} <hr />
      {thresholds.map (threshold => `${threshold} `)} <hr />
      {currentPoints} <br />
      {score} */}

      <main className="w-full flex flex-col place-items-center justify-start flex-1">
        <div className="mt-6 w-full flex flex-col-reverse justify-end items-center gap-6 md:flex-row md:justify-center md:gap-40 h-[calc(100vh-88px)]">
          
          <HexBoard
            childRef={childRef}
            inputs={inputs}
            isFocused={isFocused}
            onFocus={handleFocus}
            onBlur={handleBlur}
            locked={locked}
            handleEnter={handleEnter}
            handleDelete={handleDelete}
            randomize={randomize}
            centralRef={centralRef}
            tooShort={tooShort}
            letters={letters}
            centralLetter={centralLetter}
            missingCentral={missingCentral}
            usedNonExistent={usedNonExistent}
            win={win}
            pointsWon={pointsWon}
            doesntExist={doesntExist}
            alreadyGuessed={alreadyGuessed}
            tooManyLetters={tooManyLetters}
            isLoading={isLoading}
          />

          <WordPanel
            guessedWords={guessedWords}
            score={score}
            setDetailedRanking={setDetailedRanking}
          />

        </div>
      </main>

      {!gameIsSet && (
              <Server
                setPangram={setPangram}
                setLetters={setLetters}
                setAllWordsCount={setAllWordsCount}
                setThresholds={setThresholds}
                setIsLoading={setIsLoading}
                setGameIsSet={setGameIsSet}
              />
      )}

    {detailedRankings &&
      <Rankings
        score={score}
        currentPoints={currentPoints}
        thresholds={thresholds}
        setDetailedRanking={setDetailedRanking}
      />
    }

    {userWon && (
      <YouWon
        setStartReload={setStartReload}
      />
    )}

    </>
  )
}

export default App
