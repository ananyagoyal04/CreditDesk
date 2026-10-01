import { FeedbackSubmission, GroupStatistics, QuestionStatistics, WelchTTestResult } from '../types';

/**
 * Calculates descriptive statistics for an array of numbers
 */
export function calculateGroupStats(values: number[]): GroupStatistics {
  const n = values.length;
  if (n === 0) {
    return { count: 0, mean: 0, stdDev: 0, variance: 0, min: 0, max: 0 };
  }

  const sum = values.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  if (n === 1) {
    return { count: 1, mean, stdDev: 0, variance: 0, min: values[0], max: values[0] };
  }

  const squaredDiffs = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const variance = squaredDiffs / (n - 1); // Sample variance (Bessel's correction)
  const stdDev = Math.sqrt(variance);

  return {
    count: n,
    mean: Number(mean.toFixed(2)),
    stdDev: Number(stdDev.toFixed(2)),
    variance: Number(variance.toFixed(4)),
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/**
 * Natural log of Gamma function using Lanczos approximation
 */
function logGamma(z: number): number {
  const c = [
    57.1562356658629235,
    -59.5979603554754912,
    14.1360979747417471,
    -0.491913816097620199,
    0.339946499848118887e-4,
    0.465236289270485756e-4,
    -0.983744753048795646e-4,
    0.158088703224379514e-3,
    -0.210264441724104883e-3,
    0.217439618115212643e-3,
    -0.16431810653676389e-3,
    0.844182239838527433e-4,
    -0.261908384015814087e-4,
    0.368991826595316234e-5,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  let x = 0.99999999999999709182;
  for (let i = 0; i < c.length; i++) {
    x += c[i] / (z + i);
  }

  const t = z + c.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z - 0.5) * Math.log(t) - t + Math.log(x);
}

/**
 * Evaluates the continued fraction for the incomplete beta function
 */
function betaContinuedFraction(a: number, b: number, x: number): number {
  const maxIterations = 200;
  const epsilon = 1e-12;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;

  let c = 1.0;
  let d = 1.0 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1.0 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1.0 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1.0 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1.0 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1.0) < epsilon) {
      break;
    }
  }

  return h;
}

/**
 * Regularized incomplete beta function I_x(a, b)
 */
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const logBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const factor = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta);

  if (x < (a + 1) / (a + b + 2)) {
    return (factor * betaContinuedFraction(a, b, x)) / a;
  } else {
    return 1 - (factor * betaContinuedFraction(b, a, 1 - x)) / b;
  }
}

/**
 * Computes two-tailed p-value for Student's t-distribution
 */
export function calculateStudentTPValue(t: number, df: number): number {
  if (isNaN(t) || isNaN(df) || df <= 0) return 1.0;
  const absT = Math.abs(t);
  if (absT === 0) return 1.0;

  const x = df / (df + absT * absT);
  const p = regularizedIncompleteBeta(x, df / 2, 0.5);
  return Math.min(Math.max(p, 0), 1.0);
}

/**
 * Runs Welch's Two-Sample t-test on scores between Condition A and Condition B
 */
export function calculateWelchTTest(scoresA: number[], scoresB: number[]): WelchTTestResult {
  const nA = scoresA.length;
  const nB = scoresB.length;

  if (nA < 2 || nB < 2) {
    return {
      tValue: 0,
      df: 0,
      pValue: 1.0,
      significant: false,
      interpretation: `Insufficient sample size to compute Welch's t-test (Minimum N=2 per group required. Current: N_A=${nA}, N_B=${nB}).`,
    };
  }

  const statsA = calculateGroupStats(scoresA);
  const statsB = calculateGroupStats(scoresB);

  const meanA = statsA.mean;
  const meanB = statsB.mean;
  const varA = statsA.variance;
  const varB = statsB.variance;

  const seA = varA / nA;
  const seB = varB / nB;
  const standardError = Math.sqrt(seA + seB);

  if (standardError === 0) {
    const isIdentical = meanA === meanB;
    return {
      tValue: 0,
      df: nA + nB - 2,
      pValue: isIdentical ? 1.0 : 0.0,
      significant: !isIdentical,
      interpretation: isIdentical
        ? 'Both conditions have zero variance and identical mean scores.'
        : 'Both conditions have zero variance with differing mean scores.',
    };
  }

  // Welch's t-statistic
  const t = (meanB - meanA) / standardError;

  // Welch-Satterthwaite degrees of freedom
  const numDf = Math.pow(seA + seB, 2);
  const denDf = (Math.pow(seA, 2) / (nA - 1)) + (Math.pow(seB, 2) / (nB - 1));
  const df = numDf / denDf;

  const pValue = calculateStudentTPValue(t, df);
  const significant = pValue < 0.05;

  const roundedT = Number(t.toFixed(3));
  const roundedDf = Number(df.toFixed(2));
  const roundedP = pValue < 0.001 ? '< 0.001' : `= ${pValue.toFixed(3)}`;

  let interpretation = '';
  if (significant) {
    if (meanB > meanA) {
      interpretation = `Participants in Condition B (Explainable) reported statistically significantly higher trust scores than Condition A (Standard) (t(${roundedDf}) = ${roundedT}, p ${roundedP}).`;
    } else {
      interpretation = `Participants in Condition A (Standard) reported statistically significantly higher trust scores than Condition B (Explainable) (t(${roundedDf}) = ${roundedT}, p ${roundedP}).`;
    }
  } else {
    interpretation = `No statistically significant difference in trust scores was observed between Condition A (Standard) and Condition B (Explainable) (t(${roundedDf}) = ${roundedT}, p ${roundedP}, p ≥ 0.05).`;
  }

  return {
    tValue: roundedT,
    df: roundedDf,
    pValue: Number(pValue.toFixed(4)),
    significant,
    interpretation,
  };
}

/**
 * Computes complete statistics breakdown across all 5 questions and total score
 */
export function computeSurveyAnalytics(submissions: FeedbackSubmission[]) {
  const submissionsA = submissions.filter((s) => s.condition === 'A');
  const submissionsB = submissions.filter((s) => s.condition === 'B');

  const questions: { id: keyof FeedbackSubmission['answers']; text: string }[] = [
    { id: 'q1', text: '1. I trust the decision shown.' },
    { id: 'q2', text: '2. I understand how this decision was made.' },
    { id: 'q3', text: '3. I would rely on this system for an important financial decision.' },
    { id: 'q4', text: '4. I feel confident accepting this decision.' },
    { id: 'q5', text: '5. I believe the decision is fair.' },
  ];

  const questionStats: QuestionStatistics[] = questions.map((q) => {
    const valsA = submissionsA.map((s) => s.answers[q.id]);
    const valsB = submissionsB.map((s) => s.answers[q.id]);

    const condA = calculateGroupStats(valsA);
    const condB = calculateGroupStats(valsB);
    const diff = Number((condB.mean - condA.mean).toFixed(2));

    return {
      questionId: q.id,
      questionText: q.text,
      condA,
      condB,
      diff,
    };
  });

  const totalScoresA = submissionsA.map((s) => s.totalScore);
  const totalScoresB = submissionsB.map((s) => s.totalScore);

  const totalStatsA = calculateGroupStats(totalScoresA);
  const totalStatsB = calculateGroupStats(totalScoresB);
  const totalDiff = Number((totalStatsB.mean - totalStatsA.mean).toFixed(2));

  const timesA = submissionsA.map((s) => s.timeSpentSeconds);
  const timesB = submissionsB.map((s) => s.timeSpentSeconds);
  const timeStatsA = calculateGroupStats(timesA);
  const timeStatsB = calculateGroupStats(timesB);

  const tTest = calculateWelchTTest(totalScoresA, totalScoresB);

  return {
    countTotal: submissions.length,
    countA: submissionsA.length,
    countB: submissionsB.length,
    questionStats,
    totalStatsA,
    totalStatsB,
    totalDiff,
    timeStatsA,
    timeStatsB,
    tTest,
  };
}
