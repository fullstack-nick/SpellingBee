const GuessedWords  = ({ guessedWords }) => {
  const uniqueWords = Array.from(new Set(guessedWords));

  return (
    <div id="wordsParent" className="border-[0.05em] mt-2 rounded min-h-100 mb-15 md:min-h-137 p-2">
        <h6 className="text-xl mb-3">Here are the guessed words:</h6>

        {uniqueWords.map(word => (
          <div key={word}>{word}</div>
        ))}

    </div>
  )
}

export default GuessedWords 
