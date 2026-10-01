import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LOAN_APPLICATION } from '../data/decision';
import { hasSubmitted, getOrInitParticipantSession } from '../lib/storage';

export const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    // If the participant has already submitted, redirect to /thanks to block resubmission
    if (hasSubmitted()) {
      navigate('/thanks', { replace: true });
      return;
    }

    // Initialize or read participant session (supports optional ?condition=A/B for testing)
    const conditionParam = searchParams.get('condition') as 'A' | 'B' | null;
    getOrInitParticipantSession(conditionParam);
  }, [navigate, searchParams]);

  const handleGetDecision = () => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    setTimeout(() => {
      // Retain test override parameter if present
      const conditionParam = searchParams.get('condition');
      const targetPath = conditionParam ? `/decision?condition=${conditionParam}` : '/decision';
      navigate(targetPath);
    }, 750);
  };

  const { applicant, applicationId, status } = LOAN_APPLICATION;

  return (
    <div className="screen-card-container">
      {/* Breadcrumb / System Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
        <span className="font-mono-data-sm" style={{ color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
          Desk / Records / Underwriting
        </span>
        <span className="font-mono-data-sm" style={{ color: 'var(--outline-variant)' }}>/</span>
        <span className="font-label-text" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
          Credit Application Review
        </span>
      </div>

      {/* Primary Heading & Metadata Bar */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
        <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span>Application</span>
          <span className="font-mono-data-lg" style={{ color: 'var(--on-surface)' }}>{applicationId}</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <span className="badge-queued">STATUS: {status}</span>
        </div>
      </div>

      {/* Card Container */}
      <div className="spec-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-md)', borderBottom: '1px solid rgba(189, 201, 198, 0.3)', marginBottom: 'var(--space-xs)' }}>
          <span className="font-mono-data-sm" style={{ color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 500 }}>
            Core Underwriting Attributes
          </span>
          <span className="font-mono-data-sm" style={{ color: 'var(--outline)', fontWeight: 500 }}>
            INTAKE_SOURCE: DIRECT_PORTAL
          </span>
        </div>

        {/* Key-Value Data Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Row 1: Applicant */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Applicant</span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                {applicant.name}, age {applicant.age}
              </span>
            </div>
          </div>

          {/* Row 2: Course */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Course</span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                {applicant.course}, {applicant.institutionCountry} ({applicant.duration})
              </span>
            </div>
          </div>

          {/* Row 3: Loan Requested */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Loan requested</span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-mono-data-md" style={{ color: 'var(--on-surface)', fontWeight: 600, letterSpacing: '-0.02em' }}>
                {applicant.loanRequested}
              </span>
            </div>
          </div>

          {/* Row 4: Repayment */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Repayment</span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-body-md" style={{ color: 'var(--on-surface)' }}>
                {applicant.repaymentTerm}, estimated EMI <span className="font-mono-data-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{applicant.estimatedEmi}</span> per month
              </span>
            </div>
          </div>

          {/* Row 5: Collateral */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Collateral</span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                {applicant.collateral}
              </span>
            </div>
          </div>

          {/* Row 6: Co-applicant Annual Income */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                Co-applicant ({applicant.coApplicantRelation}) annual income
              </span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-mono-data-md" style={{ color: 'var(--on-surface)', fontWeight: 600, letterSpacing: '-0.02em' }}>
                {applicant.coApplicantAnnualIncome}
              </span>
            </div>
          </div>

          {/* Row 7: Co-applicant Monthly Income (New Row) */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0', borderBottom: '1px solid rgba(189, 201, 198, 0.3)' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                Co-applicant monthly income
              </span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-mono-data-md" style={{ color: 'var(--on-surface)', fontWeight: 600, letterSpacing: '-0.02em' }}>
                {applicant.coApplicantMonthlyIncome}
              </span>
            </div>
          </div>

          {/* Row 8: Applicant Credit History (New Row) */}
          <div className="data-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-md) 0' }}>
            <div style={{ width: '50%', minWidth: '180px' }}>
              <span className="font-body-sm" style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>
                Applicant credit history
              </span>
            </div>
            <div style={{ width: '50%', minWidth: '180px', textAlign: 'right' }}>
              <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                {applicant.creditHistory}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div style={{ marginTop: 'var(--space-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--outline)' }} className="font-mono-data-sm">
          <span>ENGINE: RISK_CALC_V4.2</span>
        </div>
        <button
          id="get-decision-btn"
          type="button"
          className="btn-primary"
          onClick={handleGetDecision}
          disabled={isEvaluating}
          aria-label="Evaluate loan application and get decision"
        >
          {isEvaluating ? (
            <>
              <span className="animate-spin" style={{ marginRight: '8px' }}>⟳</span>
              Evaluating...
            </>
          ) : (
            'Get Decision'
          )}
        </button>
      </div>
    </div>
  );
};
