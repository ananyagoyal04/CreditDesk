import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOAN_APPLICATION } from '../data/decision';
import {
  getOrInitParticipantSession,
  recordDecisionStartTime,
  hasSubmitted,
} from '../lib/storage';
import { ConditionType } from '../types';

export const DecisionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [condition, setCondition] = useState<ConditionType>('A');
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  useEffect(() => {
    // 1. If already submitted, redirect to /thanks
    if (hasSubmitted()) {
      navigate('/thanks', { replace: true });
      return;
    }

    // 2. Read query override or initialize session
    const urlCondition = searchParams.get('condition') as ConditionType | null;
    const session = getOrInitParticipantSession(urlCondition);
    setCondition(session.condition);

    // 3. Record start time on /decision
    recordDecisionStartTime();

    // 4. Trigger bar animation after short initial render
    setBarsAnimated(false);
    const timer = setTimeout(() => {
      setBarsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  const switchVariant = (newCondition: ConditionType) => {
    setCondition(newCondition);
    const session = getOrInitParticipantSession();
    session.condition = newCondition;
    localStorage.setItem('creditdesk_participant_session_v1', JSON.stringify(session));

    if (newCondition === 'B') {
      setBarsAnimated(false);
      setTimeout(() => setBarsAnimated(true), 100);
    }
  };

  const handleContinue = () => {
    if (isContinuing) return;
    setIsContinuing(true);

    const conditionParam = searchParams.get('condition');
    const targetPath = conditionParam ? `/feedback?condition=${conditionParam}` : '/feedback';
    navigate(targetPath);
  };

  const handleBackToOverview = () => {
    const conditionParam = searchParams.get('condition');
    const targetPath = conditionParam ? `/?condition=${conditionParam}` : '/';
    navigate(targetPath);
  };

  const { decision, applicationId } = LOAN_APPLICATION;

  return (
    <div className="screen-card-container">
      {/* Header & A/B Experiment Toggle Control */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div>
          {/* Breadcrumb Context */}
          <div
            className="font-mono-data-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--outline)', marginBottom: 'var(--space-xs)' }}
          >
            <span style={{ textTransform: 'uppercase' }}>
              {condition === 'A' ? 'APPLICATIONS' : `Application ${applicationId}`}
            </span>
            <span style={{ color: 'var(--outline-variant)' }}>/</span>
            <span className="font-mono-data-md" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
              {condition === 'A' ? applicationId : 'Evaluation Outcome'}
            </span>
          </div>
          <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)' }}>Decision</h1>
        </div>

        {/* Developer A/B Testing Segmented Control */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px',
            backgroundColor: 'var(--surface-container)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(189, 201, 198, 0.4)',
          }}
        >
          <span className="font-mono-data-sm" style={{ color: 'var(--outline)', padding: '0 6px', textTransform: 'uppercase', fontWeight: 600 }}>
            Variant:
          </span>
          <div
            role="group"
            aria-label="A/B Test View Selector"
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(189, 201, 198, 0.3)',
              backgroundColor: 'var(--surface-container-lowest)',
              padding: '2px',
            }}
          >
            <button
              id="btnVariant2A"
              type="button"
              onClick={() => switchVariant('A')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                borderRadius: '4px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: condition === 'A' ? 'var(--primary-container)' : 'transparent',
                color: condition === 'A' ? '#ffffff' : 'var(--on-surface-variant)',
                boxShadow: condition === 'A' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Standard (2A)
            </button>
            <button
              id="btnVariant2B"
              type="button"
              onClick={() => switchVariant('B')}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                borderRadius: '4px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: condition === 'B' ? 'var(--primary-container)' : 'transparent',
                color: condition === 'B' ? '#ffffff' : 'var(--on-surface-variant)',
                boxShadow: condition === 'B' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              Explainable (2B)
            </button>
          </div>
        </div>
      </div>

      {/* Decision Summary Card */}
      {condition === 'A' ? (
        <div className="white-card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="badge-denied" style={{ marginBottom: 'var(--space-xl)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cancel</span>
            <span className="font-mono-data-md" style={{ fontWeight: 700, letterSpacing: '0.06em' }}>
              {decision.outcome}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <div className="font-body-md" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--on-surface)' }}>
              <span style={{ color: 'var(--outline)' }}>Status:</span>
              <span style={{ fontWeight: 500 }}>{decision.status}</span>
            </div>
            <div className="font-body-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--outline)' }}>
              <span>Date:</span>
              <span className="font-mono-data-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {decision.date}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--surface-container-lowest)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--space-lg)',
            border: '1px solid rgba(189, 201, 198, 0.3)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div>
              <span className="badge-denied-pill">
                <span className="badge-denied-dot"></span>
                {decision.outcome}
              </span>
            </div>
            <div className="font-mono-data-sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', color: 'var(--outline)' }}>
              <span>EVAL_ENGINE: {decision.engine}</span>
              <span>•</span>
              <span>HASH: {decision.hash}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', paddingTop: 'var(--space-xs)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="font-label-text" style={{ color: 'var(--on-surface-variant)' }}>Evaluation Status</span>
              <span className="font-headline-sm" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                {decision.status}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="font-label-text" style={{ color: 'var(--on-surface-variant)' }}>Timestamp</span>
              <span className="font-mono-data-md" style={{ color: 'var(--on-surface)' }}>
                {decision.timestamp}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Explainable Diagnostic Card (Condition B only) */}
      {condition === 'B' && (
        <div className="explanation-card" style={{ border: '1px solid rgba(189, 201, 198, 0.2)' }}>
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
              Why this decision?
            </h2>
          </div>

          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: 'var(--space-lg)' }}>
            {decision.description}
          </p>

          {/* Feature Contribution Breakdown (4 Individual Granular Bars) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              backgroundColor: 'var(--surface-container-lowest)',
              padding: 'var(--space-lg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(189, 201, 198, 0.3)',
            }}
          >
            {decision.attributions.map((attr, idx) => (
              <div key={attr.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-label-text" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                    {attr.label}
                  </span>
                  <span className="font-mono-data-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
                    {attr.percentage}%
                  </span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--surface-container-highest)', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      backgroundColor: attr.colorHex,
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      width: barsAnimated ? `${attr.percentage}%` : '0%',
                      transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Confidence Line Metric */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(189, 201, 198, 0.3)',
              }}
            >
              <span className="font-mono-data-sm" style={{ color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Metric
              </span>
              <span style={{ color: 'rgba(189, 201, 198, 0.4)' }}>|</span>
              <span className="font-mono-data-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
                Confidence: {decision.confidence}%
              </span>
            </div>
          </div>

          {/* Key reasons Callout */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(189, 201, 198, 0.3)',
            }}
          >
            <div className="font-label-text" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 'var(--space-sm)' }}>
              {decision.keyReasonsHeading}
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', listStyle: 'none', color: 'var(--on-surface)' }}>
              {decision.keyReasons.map((reason, idx) => (
                <li key={idx} className="font-body-md" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <span style={{ color: 'var(--error)', fontWeight: 700, lineHeight: 1, marginTop: '4px' }}>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {condition === 'A' ? (
          <>
            <button
              id="continueBtn"
              type="button"
              className="btn-primary font-headline-sm"
              style={{ padding: '8px 24px', borderRadius: 'var(--radius-lg)' }}
              onClick={handleContinue}
              disabled={isContinuing}
              aria-label="Continue to feedback"
            >
              {isContinuing ? (
                <>
                  <span className="animate-spin" style={{ marginRight: '8px' }}>⟳</span>
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
            <span className="font-mono-data-sm" style={{ color: 'var(--outline)' }}>
              EXEC_REF: {decision.execRef}
            </span>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBackToOverview}
              aria-label="Back to application review"
            >
              Back to Overview
            </button>
            <button
              id="continueBtn"
              type="button"
              className="btn-primary font-headline-sm"
              style={{ height: '36px', padding: '0 24px', borderRadius: 'var(--radius-md)' }}
              onClick={handleContinue}
              disabled={isContinuing}
              aria-label="Continue to feedback"
            >
              {isContinuing ? (
                <>
                  <span className="animate-spin" style={{ marginRight: '8px' }}>⟳</span>
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
