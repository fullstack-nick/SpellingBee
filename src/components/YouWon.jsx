import Confetti from 'react-confetti';

const YouWon = ({ setStartReload }) => {
    const handleReload = () => {
        setStartReload(true);
    };

    return (
            <>
             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm select-none z-40"/>
                <div className="fixed inset-0 pointer-events-none z-50">
                    <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    />
                </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-51 flex justify-center items-center h-150 w-120 border-1 border-gray-500 bg-white p-8 rounded-xl shadow-xl select-none'>
                        <p className='absolute top-10 text-center'>
                            <span className="wobble-pop text-[125px] mb-12">🎉</span><br />
                            <b className='text-5xl leading-relaxed'>Congratulations!<br/>
                            You won!</b><br />

                            <button onClick={handleReload} className='mt-12 bg-yellow-300 w-35 h-20 rounded-xl shadow-xl text-2xl font-bold cursor-pointer'>
                                Play again!
                            </button>
                        </p>
                    </div>
            </>
    );
}

export default YouWon