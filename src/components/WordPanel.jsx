import ProgressBar from './ProgressBar';
import GuessedWords from './GuessedWords';

const WordPanel = ({ guessedWords, score, setDetailedRanking }) => {
  return (
    <div className="w-full md:w-auto px-4 max-w-[40rem] grid grid-rows-[auto,auto] gap-2 md:mt-4 md:self-start">
            
            <ProgressBar
              score={score}
              setDetailedRanking={setDetailedRanking}
            />
            <GuessedWords
              guessedWords={guessedWords}
            />

    </div>
  )
}

export default WordPanel