import { ConditionType, FeedbackSubmission, ParticipantSession } from '../types';

const STORAGE_KEY_SESSION = 'creditdesk_participant_session_v1';
const STORAGE_KEY_RESPONSES = 'creditdesk_survey_responses_v1';

/**
 * Generates a unique anonymous participant ID (e.g. "P-7B9F2E4A")
 */
export function generateParticipantId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 8; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `P-${rand}`;
}

/**
 * Retrieves the current participant session or initializes a new one.
 * Assigns Condition A or B with 50/50 probability unless overridden by URL query.
 */
export function getOrInitParticipantSession(overrideCondition?: ConditionType | null): ParticipantSession {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (existingStr) {
      const session = JSON.parse(existingStr) as ParticipantSession;
      // If a hidden override is passed during testing and differs from current, update condition
      if (overrideCondition && (overrideCondition === 'A' || overrideCondition === 'B') && session.condition !== overrideCondition) {
        session.condition = overrideCondition;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
      return session;
    }
  } catch (e) {
    console.error('Error reading participant session from localStorage:', e);
  }

  // Determine condition: 50/50 random split or URL override
  let assignedCondition: ConditionType;
  if (overrideCondition === 'A' || overrideCondition === 'B') {
    assignedCondition = overrideCondition;
  } else {
    assignedCondition = Math.random() < 0.5 ? 'A' : 'B';
  }

  const newSession: ParticipantSession = {
    participantId: generateParticipantId(),
    condition: assignedCondition,
    assignedAt: new Date().toISOString(),
    hasSubmitted: false,
  };

  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newSession));
  } catch (e) {
    console.error('Error saving new participant session to localStorage:', e);
  }

  return newSession;
}

/**
 * Records the timestamp when the participant entered the /decision route
 */
export function recordDecisionStartTime(): void {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (existingStr) {
      const session = JSON.parse(existingStr) as ParticipantSession;
      if (!session.decisionStartTime) {
        session.decisionStartTime = Date.now();
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    }
  } catch (e) {
    console.error('Error recording decision start time:', e);
  }
}

/**
 * Calculates time spent on the /decision screen in whole seconds
 */
export function getDecisionTimeSpentSeconds(): number {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (existingStr) {
      const session = JSON.parse(existingStr) as ParticipantSession;
      if (session.decisionTimeSpentSeconds) {
        return session.decisionTimeSpentSeconds;
      }
      if (session.decisionStartTime) {
        const elapsed = Math.max(1, Math.round((Date.now() - session.decisionStartTime) / 1000));
        session.decisionTimeSpentSeconds = elapsed;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
        return elapsed;
      }
    }
  } catch (e) {
    console.error('Error getting decision time spent:', e);
  }
  return 5; // Default fallback
}

/**
 * Checks whether the current participant has already submitted the survey
 */
export function hasSubmitted(): boolean {
  try {
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionStr) {
      const session = JSON.parse(sessionStr) as ParticipantSession;
      return !!session.hasSubmitted;
    }
  } catch (e) {
    console.error('Error checking submission status:', e);
  }
  return false;
}

/**
 * Retrieves all stored survey responses
 */
export function getResponses(): FeedbackSubmission[] {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY_RESPONSES);
    if (dataStr) {
      return JSON.parse(dataStr) as FeedbackSubmission[];
    }
  } catch (e) {
    console.error('Error loading responses from localStorage:', e);
  }
  return [];
}

/**
 * Saves a participant's feedback response.
 * 1) Stores in localStorage
 * 2) Marks session as submitted
 * 3) If VITE_SHEETS_URL is configured, POSTs to Google Apps Script endpoint
 */
export async function saveResponse(data: FeedbackSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save to localStorage
    const existing = getResponses();
    // Prevent duplicate entries for the exact same participant
    const filtered = existing.filter((item) => item.participantId !== data.participantId);
    filtered.push(data);
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(filtered));

    // 2. Mark session as submitted
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionStr) {
      const session = JSON.parse(sessionStr) as ParticipantSession;
      session.hasSubmitted = true;
      session.decisionTimeSpentSeconds = data.timeSpentSeconds;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }

    // 3. Optional POST to Google Apps Script Web App URL
    const sheetsUrl = import.meta.env.VITE_SHEETS_URL;
    if (sheetsUrl && typeof sheetsUrl === 'string' && sheetsUrl.trim().startsWith('http')) {
      try {
        await fetch(sheetsUrl.trim(), {
          method: 'POST',
          mode: 'no-cors', // Google Apps Script redirects require no-cors in browser
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } catch (sheetsError) {
        console.warn('Google Sheets webhook submission error (cached locally):', sheetsError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveResponse:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Exports all collected responses as a downloadable CSV file
 */
export function exportResponsesToCSV(): void {
  const responses = getResponses();
  if (responses.length === 0) {
    alert('No responses to export yet.');
    return;
  }

  const headers = [
    'Participant ID',
    'Condition',
    'Q1 (Trust)',
    'Q2 (Understanding)',
    'Q3 (Reliance)',
    'Q4 (Confidence)',
    'Q5 (Fairness)',
    'Total Score',
    'Time on Decision (s)',
    'Timestamp (ISO)',
  ];

  const rows = responses.map((r) => [
    r.participantId,
    r.condition,
    r.answers.q1,
    r.answers.q2,
    r.answers.q3,
    r.answers.q4,
    r.answers.q5,
    r.totalScore,
    r.timeSpentSeconds,
    r.timestamp,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `creditdesk_responses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clears local responses (for testing / admin use)
 */
export function clearLocalResponses(): void {
  localStorage.removeItem(STORAGE_KEY_RESPONSES);
}

/**
 * Seeds realistic test responses for demo & evaluation (15 Condition A, 15 Condition B)
 */
export function seedSampleResponses(): FeedbackSubmission[] {
  const sampleData: FeedbackSubmission[] = [];
  const baseTime = Date.now() - 3600 * 1000 * 24 * 3; // Past 3 days

  // Condition A: Standard (Mean ~ 12.8 / 25)
  for (let i = 1; i <= 15; i++) {
    const q1 = Math.min(5, Math.max(1, Math.round(2.4 + (Math.random() * 1.6 - 0.8))));
    const q2 = Math.min(5, Math.max(1, Math.round(2.1 + (Math.random() * 1.6 - 0.8))));
    const q3 = Math.min(5, Math.max(1, Math.round(2.2 + (Math.random() * 1.4 - 0.7))));
    const q4 = Math.min(5, Math.max(1, Math.round(2.5 + (Math.random() * 1.4 - 0.7))));
    const q5 = Math.min(5, Math.max(1, Math.round(2.6 + (Math.random() * 1.4 - 0.7))));
    const total = q1 + q2 + q3 + q4 + q5;
    const time = Math.floor(12 + Math.random() * 20);

    sampleData.push({
      participantId: `P-A${1000 + i}`,
      condition: 'A',
      answers: { q1, q2, q3, q4, q5 },
      totalScore: total,
      timeSpentSeconds: time,
      timestamp: new Date(baseTime + i * 3600 * 1000 * 4).toISOString(),
    });
  }

  // Condition B: Explainable (Mean ~ 19.4 / 25)
  for (let i = 1; i <= 15; i++) {
    const q1 = Math.min(5, Math.max(1, Math.round(4.1 + (Math.random() * 1.4 - 0.7))));
    const q2 = Math.min(5, Math.max(1, Math.round(4.4 + (Math.random() * 1.2 - 0.6))));
    const q3 = Math.min(5, Math.max(1, Math.round(3.6 + (Math.random() * 1.4 - 0.7))));
    const q4 = Math.min(5, Math.max(1, Math.round(3.9 + (Math.random() * 1.4 - 0.7))));
    const q5 = Math.min(5, Math.max(1, Math.round(4.0 + (Math.random() * 1.4 - 0.7))));
    const total = q1 + q2 + q3 + q4 + q5;
    const time = Math.floor(25 + Math.random() * 35);

    sampleData.push({
      participantId: `P-B${2000 + i}`,
      condition: 'B',
      answers: { q1, q2, q3, q4, q5 },
      totalScore: total,
      timeSpentSeconds: time,
      timestamp: new Date(baseTime + (i + 15) * 3600 * 1000 * 4).toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(sampleData));
  return sampleData;
}


/**
 * Resets the entire test session (for QA / testing)
 */
export function resetParticipantSession(): void {
  localStorage.removeItem(STORAGE_KEY_SESSION);
}
