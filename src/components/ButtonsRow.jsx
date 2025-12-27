import {FaArrowsRotate} from 'react-icons/fa6';

const ButtonsRow = ({ handleDelete, randomize, handleEnter }) => {

  return (
    <div className="absolute top-[100%] left-[5%] flex flex-row" id="buttons-row">
        <button onClick={handleDelete} className='active:bg-gray-200 cursor-pointer select-none w-25 h-12 border border-gray-300 rounded-4xl'>Delete</button>
        <button onClick={randomize} className='active:bg-gray-200 cursor-pointer select-none mx-4 -translate-y-1 w-15 h-15 border flex items-center justify-center border-gray-300 rounded-4xl'>
            <FaArrowsRotate></FaArrowsRotate>
        </button>
        <button onClick={handleEnter} className='active:bg-gray-200 cursor-pointer select-none w-25 h-12 border border-gray-300 rounded-4xl'>Enter</button>
    </div>
  )
}

export default ButtonsRow