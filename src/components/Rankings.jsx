const RANK_NAMES = [
  "Beginner",
  "Good Start",
  "Moving Up",
  "Good",
  "Solid",
  "Nice",
  "Great",
  "Amazing",
  "Genius",
];


export default function Rankings({ score, thresholds, currentPoints, setDetailedRanking }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-51 flex justify-center items-center h-175 w-100 md:h-165 md:w-190 border-1 border-gray-500 bg-white rounded-xl shadow-xl p-10 md:p-0">
        <button onClick={() => setDetailedRanking(false) } className="cursor-pointer absolute top-3 right-7 text-black font-bold text-3xl col-start-3 justify-self-end ml-50">&times;</button>
        <section className="mx-auto max-w-xl mt-5">
            <h2 className="text-3xl font-extrabold">Rankings</h2>
            <p className="mt-1 text-gray-600">
                Ranks are based on a percentage of possible points in a puzzle.
            </p>

            {/* header row */}
            <div className="mt-6 grid grid-cols-[2.5rem_1fr_auto] text-xs font-semibold text-gray-500 border-t border-gray-200">
                <span />
                <span className="py-2 ml-5">Rank</span>
                <span className="text-right py-2">Score</span>
            </div>

            {/* body rows */}
            {RANK_NAMES.map((label, i) => {
                const min   = thresholds[i];
                const isCurrent = i <= score;
                const nextToReach = i === score + 1;

                return (
                <div
                    key={label}
                    className={`grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-2 border-t border-gray-100 py-3 px-3
                    ${isCurrent && "rounded-lg bg-yellow-400 font-bold"} ${nextToReach && "rounded-lg bg-red-200 font-bold"}`}
                >
                    <span className="flex items-center justify-center">
                    {isCurrent && i}
                    </span>
                    <span>{label}</span>
                    <span className="text-right">{nextToReach ? (`${currentPoints} / ${min}`) : min}</span>
                </div>
                );
            })}

        </section>
    </div>
  );
}