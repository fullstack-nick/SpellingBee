export function getCumulativeRankThresholds(N_words) {
  const N_ref = 1000; // reference word-count
  const P0 = 5; // base cost for rank 0→1 (on an "average" puzzle)
  const alpha = 0; // 20% more per rank
  const beta = 0.4; // difficulty exponent: (N_words/N_ref)^0.4

  // precompute the “difficulty multiplier” from N_words
  const rawFactor = Math.pow(N_words / N_ref, beta);

  // We’ll build an array of length 9:
  //   cumulative[0] = 0,
  //   cumulative[k] = sum of per-rank thresholds up to rank k.
  const cumulative = [0];

  // running sum of points needed so far
  let totalSoFar = 0;

  // for each r = 0..7, compute P_{r→r+1}, then add to totalSoFar, push into array
  for (let r = 0; r < 8; r++) {
    const rankFactor = 1 + alpha * r;
    const perRankCost = Math.ceil(P0 * rankFactor * rawFactor);
    totalSoFar += perRankCost;
    cumulative.push(totalSoFar);
  }

  // Now `cumulative` has length 9: [0, ptsToRank1, ptsToRank2, …, ptsToRank8]
  return cumulative;
}
