import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getOrInitParticipantSession,
  getDecisionTimeSpentSeconds,
  saveResponse,
  hasSubmitted,
} from '../lib/storage';
import { FeedbackAnswers, FeedbackSubmission } from '../types';

interface QuestionDef {
  key: keyof FeedbackAnswers;
  text: string;
}

const QUESTIONS: QuestionDef[] = [
  { key: 'q1', text: '1. I trust the decision shown.' },
  { key: 'q2', text: '2. I understand how this decision was made.' },
  { key: 'q3', text: '3. I would rely on this system for an important financial decision.' },
  { key: 'q4', text: '4. I feel confident accepting this decision.' },
  { key: 'q5', text: '5. I believe the decision is fair.' },
];

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [answers, setAnswers] = useState<Partial<FeedbackAnswers>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already submitted, prevent viewing or resubmission
    if (hasSubmitted()) {
      navigate('/thanks', { replace: true });
      return;
    }
  }, [navigate]);

  const handleOptionChange = (questionKey: keyof FeedbackAnswers, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
    // Clear error for this question once selected
    if (errors[questionKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionKey];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate all 5 questions
    const newErrors: Record<string, string> = {};
    let firstUnansweredKey: string | null = null;

    for (const q of QUESTIONS) {
      if (!answers[q.key] || answers[q.key] === 0) {
        newErrors[q.key] = 'Please select a response from 1 to 5.';
        if (!firstUnansweredKey) {
          firstUnansweredKey = q.key;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      if (firstUnansweredKey) {
        const el = document.getElementById(`fieldset-${firstUnansweredKey}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    const conditionParam = searchParams.get('condition') as 'A' | 'B' | null;
    const session = getOrInitParticipantSession(conditionParam);
    const timeSpent = getDecisionTimeSpentSeconds();

    const validAnswers = answers as FeedbackAnswers;
    const totalScore =
      validAnswers.q1 +
      validAnswers.q2 +
      validAnswers.q3 +
      validAnswers.q4 +
      validAnswers.q5;

    const submission: FeedbackSubmission = {
      participantId: session.participantId,
      condition: session.condition,
      answers: validAnswers,
      totalScore,
      timeSpentSeconds: timeSpent,
      timestamp: new Date().toISOString(),
    };

    await saveResponse(submission);

    // Navigate to thanks page
    navigate('/thanks', { replace: true });
  };

  return (
    <div className="screen-card-container">
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
          <span className="badge-queued">FORM-ID: FB-904</span>
          <span className="font-body-sm" style={{ color: 'var(--outline)' }}>/</span>
          <span className="font-body-sm" style={{ color: 'var(--outline)' }}>STAGE 3 OF 3</span>
        </div>
        <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', letterSpacing: '-0.015em' }}>
          Your Feedback
        </h1>
        <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: 'var(--space-xs)' }}>
          Please rate your level of agreement with the statements below regarding the decision.
        </p>
      </div>

      <form
        id="feedback-form"
        onSubmit={handleSubmit}
        noValidate
        style={{
          backgroundColor: 'var(--surface-container-lowest)',
          border: '1px solid rgba(189, 201, 198, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {QUESTIONS.map((q) => {
            const hasError = !!errors[q.key];
            const currentValue = answers[q.key];

            return (
              <fieldset
                key={q.key}
                id={`fieldset-${q.key}`}
                className="feedback-fieldset"
                style={{
                  borderLeft: hasError ? '3px solid var(--error)' : 'none',
                  paddingLeft: hasError ? 'var(--space-sm)' : 0,
                }}
              >
                <legend className="font-headline-sm" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-md)' }}>
                  {q.text}
                </legend>

                <div className="likert-scale-container">
                  <span className="font-body-sm" style={{ color: 'var(--outline)', userSelect: 'none' }}>
                    1 (Strongly disagree)
                  </span>

                  <div className="likert-options-group" role="radiogroup" aria-label={q.text}>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <label
                        key={val}
                        className="likert-radio-label"
                        htmlFor={`${q.key}-opt-${val}`}
                      >
                        <input
                          id={`${q.key}-opt-${val}`}
                          className="likert-radio-input"
                          type="radio"
                          name={q.key}
                          value={val}
                          checked={currentValue === val}
                          onChange={() => handleOptionChange(q.key, val)}
                          aria-label={`${val} - ${q.text}`}
                        />
                        <span
                          className="font-mono-data-sm"
                          style={{
                            color: currentValue === val ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                            fontWeight: currentValue === val ? 600 : 400,
                          }}
                        >
                          {val}
                        </span>
                      </label>
                    ))}
                  </div>

                  <span className="font-body-sm" style={{ color: 'var(--outline)', userSelect: 'none', textAlign: 'right' }}>
                    5 (Strongly agree)
                  </span>
                </div>

                {hasError && (
                  <div className="form-error-inline" role="alert">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
                    <span>{errors[q.key]}</span>
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid rgba(189, 201, 198, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="font-mono-data-sm" style={{ color: 'var(--outline)' }}>
            ALL ITEMS MANDATORY
          </span>
          <button
            id="submit-btn"
            type="submit"
            className="btn-primary"
            style={{ height: '32px', padding: '0 var(--space-xl)', borderRadius: 'var(--radius-lg)' }}
            disabled={isSubmitting}
            aria-label="Submit research feedback"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin" style={{ marginRight: '8px' }}>⟳</span>
                Recording...
              </>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <span>Submit</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
