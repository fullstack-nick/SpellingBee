const ProgressBar  = ({ score, setDetailedRanking }) => {
  
  return (
    <div onClick={() => setDetailedRanking(true)} className="flex items-center mr-6 cursor-pointer">
        <div className="font-[700] text-[16px] mr-4 whitespace-nowrap" id="current-level">
        Beginner
        </div>
        <div className="pt-1 flex-1 relative" id="progress-bar">
        <div className="border absolute top-1/2 translate-y-1/3 w-[90%] md:w-[100%] ml-1" id="progress-line" />
        <div className="pl-[0.01rem] grid grid-cols-9 gap-2 md:gap-14 items-center" id="circle-container">
            {Array.from({ length: 9 }).map((_, i) => {
              const isActive = i <= score;
              return (
                <span key={i} className={`circle ${isActive ? 'circle-yellow' : ''} flex items-center justify-center text-[0.85rem] font-bold`}>
                  {isActive ? i : ''}
                </span>
              );
            })}
        </div>
        </div>
    </div>
  )
}

export default ProgressBar 