export type ConditionType = 'A' | 'B';

export interface FeedbackAnswers {
  q1: number; // Trust: "I trust the decision shown."
  q2: number; // Understanding: "I understand how this decision was made."
  q3: number; // Reliance: "I would rely on this system for an important financial decision."
  q4: number; // Confidence: "I feel confident accepting this decision."
  q5: number; // Fairness: "I believe the decision is fair."
}

export interface FeedbackSubmission {
  participantId: string;
  condition: ConditionType;
  answers: FeedbackAnswers;
  totalScore: number; // Sum of q1 to q5 (range: 5 - 25)
  timeSpentSeconds: number; // Time spent on the decision screen in seconds
  timestamp: string; // ISO string format
}

export interface ParticipantSession {
  participantId: string;
  condition: ConditionType;
  assignedAt: string;
  hasSubmitted: boolean;
  decisionStartTime?: number;
  decisionTimeSpentSeconds?: number;
}

export interface GroupStatistics {
  count: number;
  mean: number;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
}

export interface QuestionStatistics {
  questionId: keyof FeedbackAnswers;
  questionText: string;
  condA: GroupStatistics;
  condB: GroupStatistics;
  diff: number; // condB.mean - condA.mean
}

export interface WelchTTestResult {
  tValue: number;
  df: number;
  pValue: number;
  significant: boolean; // p < 0.05
  interpretation: string;
}
