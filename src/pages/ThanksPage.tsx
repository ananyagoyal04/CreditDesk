import React from 'react';
import { Link } from 'react-router-dom';
import { resetParticipantSession } from '../lib/storage';

export const ThanksPage: React.FC = () => {
  const handleRestart = () => {
    resetParticipantSession();
    window.location.href = '#/';
    window.location.reload();
  };

  return (
    <div className="screen-card-container">
      {/* Breadcrumb Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
        <span className="badge-queued">STUDY: RM-2026-EXPLAINABILITY</span>
        <span className="font-body-sm" style={{ color: 'var(--outline)' }}>/</span>
        <span className="font-body-sm" style={{ color: 'var(--outline)' }}>COMPLETE</span>
      </div>

      <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-xl)', letterSpacing: '-0.015em' }}>
        Response Recorded
      </h1>

      <div
        style={{
          backgroundColor: 'var(--surface-container-lowest)',
          border: '1px solid rgba(189, 201, 198, 0.3)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(189, 201, 198, 0.4)',
            backgroundColor: 'var(--surface-container-low)',
            padding: 'var(--space-md) var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '22px' }}>
              check_circle
            </span>
            <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
              Thank you. Your evaluation response has been recorded.
            </span>
          </div>
          <span className="font-mono-data-sm" style={{ color: 'var(--outline)' }}>
            STATUS: 200 OK
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', color: 'var(--on-surface-variant)' }}>
          <p className="font-body-md">
            Your contribution provides valuable empirical data for research on human trust and decision transparency in algorithmic underwriting systems.
          </p>
          <p className="font-body-md">
            The data collected is completely anonymous and will be analyzed in aggregate for academic purposes.
          </p>
        </div>

        {/* Demo Navigation Shortcuts */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: 'var(--space-lg)',
            borderTop: '1px solid rgba(189, 201, 198, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
          }}
        >
          <button
            type="button"
            onClick={handleRestart}
            className="btn-secondary"
            title="Start another test run from the beginning"
          >
            ↺ Restart New Test Flow
          </button>

          <Link
            to="/results"
            className="btn-primary"
            style={{ textDecoration: 'none', height: '32px', padding: '0 var(--space-md)' }}
          >
            <span>View Results & Analytics</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', marginLeft: '4px' }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
