import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const BLINK_INTERVAL = 530;

const InputDiv = forwardRef(({ inputs, isFocused, onFocus, onBlur, locked, tooShort, letters, centralLetter, missingCentral, win, pointsWon, doesntExist, alreadyGuessed, usedNonExistent, tooManyLetters }, ref) => {
  const divRef = useRef(null);
  const [showCursor, setShowCursor] = useState(true);

  useImperativeHandle(ref, () => ({
    focusInput() {
      divRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (!isFocused) {
      setShowCursor(false);
      return;
    }
    setShowCursor(true);
    const blink = setInterval(() => setShowCursor((v) => !v), BLINK_INTERVAL);
    return () => clearInterval(blink);
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && divRef.current) divRef.current.focus();
  }, [isFocused]);

  const formatInput = () => {
    const baseSize = 1.4; // rem (20px)
    const minSize = 1.1;  // rem (12px)
    const shrinkStart = 12;
    const shrinkRate = 0.03; // rem per char after threshold

    if (inputs.length <= shrinkStart) return `${baseSize}rem`;
    const size = baseSize - (inputs.length - shrinkStart) * shrinkRate;
    return `${Math.max(size, minSize)}rem`;
  };

  return (
    <div className="relative max-w-xs min-w-[180px]">
      {inputs.length === 0 && (
        <span className="absolute left-3 -top-9 text-gray-400 pointer-events-none select-none z-1">
          Type or click
        </span>
      )}
      <div
        ref={divRef}
        tabIndex={0}
        spellCheck={false}
        className={`-translate-y-10 flex items-center justify-center uppercase border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 h-[1.8em] whitespace-nowrap overflow-hidden text-ellipsis outline-none bg-white transition-all`}
        style={{ fontSize: formatInput(), minHeight: '2.2rem', letterSpacing: '0.05rem' }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {inputs.map((ch, idx) => {
          let className = '';
          if (!letters.includes(ch)) className += ' text-gray-400';
          if (ch === centralLetter) className += ' text-yellow-400';

          return (
            <span className={className.trim()} key={idx}>{ch}</span>
          );
        })}
        {isFocused && !locked && showCursor && (
          <span className="inline-block w-[2px] h-[1.2em] bg-yellow-300 animate-blink" />
        )}
      </div>
      {tooShort && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          Too short
        </div>
      )}
      {win && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          You scored {pointsWon} {pointsWon === 1 ? 'point' : 'points'}
        </div>
      )}
      {doesntExist && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          The word you entered doesn't exist
        </div>
      )}
      {alreadyGuessed && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          Already guessed
        </div>
      )}
      {missingCentral && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          Missing central letter
        </div>
      )}
      {usedNonExistent && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          You used nonexistent letter
        </div>
      )}
      {tooManyLetters && (
        <div className='absolute -top-22 bg-gray-300 text-gray-600 text-base p-2 rounded shadow-sm z-10'>
          You exceeded the number of characters
        </div>
      )}
      <style>{`
        @keyframes blink {
          0% { opacity: 1 }
          50% { opacity: 0 }
          100% { opacity: 1 }
        }
        .animate-blink {
          margin-left: 1px;
          margin-bottom: -2px;
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
});

export default InputDiv;