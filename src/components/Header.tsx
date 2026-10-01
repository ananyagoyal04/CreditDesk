import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getOrInitParticipantSession, resetParticipantSession } from '../lib/storage';

export const Header: React.FC = () => {
  const location = useLocation();
  const session = getOrInitParticipantSession();

  const handleConditionSwitch = (cond: 'A' | 'B') => {
    session.condition = cond;
    localStorage.setItem('creditdesk_participant_session_v1', JSON.stringify(session));
    window.location.reload();
  };

  const handleResetSession = () => {
    resetParticipantSession();
    window.location.href = '#/';
    window.location.reload();
  };

  const currentPath = location.pathname;

  return (
    <header className="app-header">
      <div className="header-container" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'var(--on-surface)',
              fontFamily: 'var(--font-sans)',
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            CreditDesk
          </Link>
          <span className="badge-research">ENV: RESEARCH DEMO</span>
        </div>

        {/* Demo & Test Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {/* Quick Route Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link
              to="/"
              className={`demo-nav-link ${currentPath === '/' ? 'active' : ''}`}
              title="Application Review"
            >
              Application
            </Link>
            <Link
              to="/decision"
              className={`demo-nav-link ${currentPath === '/decision' ? 'active' : ''}`}
              title="Decision Screen"
            >
              Decision
            </Link>
            <Link
              to="/feedback"
              className={`demo-nav-link ${currentPath === '/feedback' ? 'active' : ''}`}
              title="Feedback Survey"
            >
              Survey
            </Link>
            <Link
              to="/results"
              className={`demo-nav-link ${currentPath === '/results' ? 'active' : ''}`}
              title="Analytics & Results Dashboard"
            >
              Results
            </Link>
          </nav>

          {/* Condition Toggle Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-container)',
              borderRadius: 'var(--radius-lg)',
              padding: '2px',
              border: '1px solid rgba(189, 201, 198, 0.4)',
            }}
          >
            <button
              type="button"
              onClick={() => handleConditionSwitch('A')}
              style={{
                border: 'none',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: session.condition === 'A' ? 'var(--primary-container)' : 'transparent',
                color: session.condition === 'A' ? '#ffffff' : 'var(--on-surface-variant)',
                transition: 'all 0.15s ease',
              }}
              title="Switch to Condition A (Standard / Black-box)"
            >
              Cond A
            </button>
            <button
              type="button"
              onClick={() => handleConditionSwitch('B')}
              style={{
                border: 'none',
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: session.condition === 'B' ? 'var(--primary-container)' : 'transparent',
                color: session.condition === 'B' ? '#ffffff' : 'var(--on-surface-variant)',
                transition: 'all 0.15s ease',
              }}
              title="Switch to Condition B (Explainable / LIN-SHAP)"
            >
              Cond B
            </button>
          </div>

          {/* Reset Test Session */}
          <button
            type="button"
            onClick={handleResetSession}
            style={{
              border: '1px solid var(--outline-variant-30)',
              backgroundColor: 'var(--surface-container-low)',
              color: 'var(--on-surface-variant)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-md)',
              fontSize: '11px',
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            title="Clear current session and start a new test"
          >
            Restart
          </button>
        </div>
      </div>
    </header>
  );
};
