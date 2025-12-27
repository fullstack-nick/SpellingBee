import InputDiv from './InputDiv';
import ButtonsRow from './ButtonsRow';
import HexLetters from './HexLetters';
import ClipLoader from "react-spinners/ClipLoader";

const HexBoard = ({ childRef, inputs, isFocused, handleFocus, handleBlur, locked, handleEnter, centralRef, tooShort, handleDelete, letters, randomize, centralLetter, missingCentral, win, pointsWon, doesntExist, alreadyGuessed, usedNonExistent, isLoading, tooManyLetters }) => {
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "320px", height: "420px", color: "var(--color-yellow-400)" }}>
        <ClipLoader size={80} color="currentColor" />
      </div>
    );
  }
  return (
    <div className="relative min-w-80 min-h-80">

            <InputDiv
              ref={childRef}
              inputs={inputs}
              isFocused={isFocused}
              onFocus={handleFocus}
              onBlur={handleBlur}
              locked={locked}
              tooShort={tooShort}
              letters={letters}
              centralLetter={centralLetter}
              missingCentral={missingCentral}
              win={win}
              pointsWon={pointsWon}
              doesntExist={doesntExist}
              alreadyGuessed={alreadyGuessed}
              usedNonExistent={usedNonExistent}
              tooManyLetters={tooManyLetters}
            />

            <ButtonsRow
              handleEnter={handleEnter}
              handleDelete={handleDelete}
              randomize={randomize}
            />
            
            <HexLetters
              letters={letters}
              ref={centralRef}
            />
            
    </div>
  )
}

export default HexBoard