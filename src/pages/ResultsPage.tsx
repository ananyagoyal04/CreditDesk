import React, { useState, useEffect, useMemo } from 'react';
import {
  getResponses,
  exportResponsesToCSV,
  clearLocalResponses,
  resetParticipantSession,
  seedSampleResponses,
} from '../lib/storage';
import { computeSurveyAnalytics } from '../lib/stats';
import { FeedbackSubmission } from '../types';

export const ResultsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);

  // Load existing responses
  useEffect(() => {
    setSubmissions(getResponses());
  }, []);

  const handleRefresh = () => {
    setSubmissions(getResponses());
  };

  const handleSeedData = () => {
    const data = seedSampleResponses();
    setSubmissions([...data]);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all survey data?')) {
      clearLocalResponses();
      resetParticipantSession();
      setSubmissions([]);
    }
  };

  const analytics = useMemo(() => {
    return computeSurveyAnalytics(submissions);
  }, [submissions]);

  const {
    countTotal,
    countA,
    countB,
    questionStats,
    totalStatsA,
    totalStatsB,
    totalDiff,
    timeStatsA,
    timeStatsB,
    tTest,
  } = analytics;

  return (
    <div style={{ maxWidth: '840px', width: '100%', margin: '0 auto', padding: 'var(--space-xl) 0' }}>
      {/* Top Admin / Demo Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
            <span className="badge-queued">PANEL: STUDY_EVALUATION</span>
            <span className="font-body-sm" style={{ color: 'var(--outline)' }}>/</span>
            <span className="font-body-sm" style={{ color: 'var(--outline)' }}>WELCH_T_TEST_DEMO</span>
          </div>
          <h1 className="font-headline-lg" style={{ color: 'var(--on-surface)', letterSpacing: '-0.015em' }}>
            Study Analytics & Results
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleSeedData}
            title="Populate 30 realistic test responses for demo & statistical analysis"
            style={{ backgroundColor: 'rgba(0, 92, 85, 0.08)', color: 'var(--primary)', borderColor: 'var(--primary-fixed-dim)', fontWeight: 600 }}
          >
            + Seed Sample Data (N=30)
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRefresh}
            title="Refresh latest responses"
          >
            Refresh
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ height: '32px', padding: '0 var(--space-md)' }}
            onClick={exportResponsesToCSV}
            disabled={submissions.length === 0}
            title="Download CSV file of all submissions"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
              <span>Download CSV</span>
            </span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {countTotal === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--surface-container-lowest)',
            border: '1px solid rgba(189, 201, 198, 0.4)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--outline)', marginBottom: 'var(--space-md)' }}>
            analytics
          </span>
          <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', marginBottom: 'var(--space-xs)' }}>
            No Survey Responses Recorded
          </h2>
          <p className="font-body-md" style={{ color: 'var(--on-surface-variant)', maxWidth: '480px', margin: '0 auto var(--space-lg)' }}>
            There are currently no recorded participant responses in the system. You can complete the survey flow or click below to populate sample test data.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSeedData}
            >
              Seed Sample Dataset (N=30)
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Overview Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
            {/* Total Submissions */}
            <div
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid rgba(189, 201, 198, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span className="font-label-text" style={{ color: 'var(--outline)' }}>TOTAL PARTICIPANTS</span>
              <div className="font-mono-data-lg" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--on-surface)', marginTop: '4px' }}>
                {countTotal}
              </div>
              <span className="font-body-sm" style={{ color: 'var(--outline)' }}>Completed Submissions</span>
            </div>

            {/* Condition A (Standard) */}
            <div
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid rgba(189, 201, 198, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span className="font-label-text" style={{ color: 'var(--outline)' }}>CONDITION A (STANDARD)</span>
              <div className="font-mono-data-lg" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--on-surface)', marginTop: '4px' }}>
                {countA} <span className="font-body-sm" style={{ fontWeight: 400, color: 'var(--outline)' }}>({countTotal > 0 ? ((countA / countTotal) * 100).toFixed(0) : 0}%)</span>
              </div>
              <span className="font-body-sm" style={{ color: 'var(--outline)' }}>Mean Time: {timeStatsA.mean}s</span>
            </div>

            {/* Condition B (Explainable) */}
            <div
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid rgba(189, 201, 198, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span className="font-label-text" style={{ color: 'var(--outline)' }}>CONDITION B (EXPLAINABLE)</span>
              <div className="font-mono-data-lg" style={{ fontSize: '24px', fontWeight: 600, color: 'var(--primary-container)', marginTop: '4px' }}>
                {countB} <span className="font-body-sm" style={{ fontWeight: 400, color: 'var(--outline)' }}>({countTotal > 0 ? ((countB / countTotal) * 100).toFixed(0) : 0}%)</span>
              </div>
              <span className="font-body-sm" style={{ color: 'var(--outline)' }}>Mean Time: {timeStatsB.mean}s</span>
            </div>

            {/* Mean Score Delta */}
            <div
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid rgba(189, 201, 198, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span className="font-label-text" style={{ color: 'var(--outline)' }}>SCORE DIFFERENCE (B - A)</span>
              <div
                className="font-mono-data-lg"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: totalDiff > 0 ? 'var(--primary)' : totalDiff < 0 ? 'var(--secondary)' : 'var(--on-surface)',
                  marginTop: '4px',
                }}
              >
                {totalDiff > 0 ? `+${totalDiff}` : `${totalDiff}`}
              </div>
              <span className="font-body-sm" style={{ color: 'var(--outline)' }}>Scale Range: 5 to 25</span>
            </div>
          </div>

          {/* Welch's t-test Statistical Analysis Card */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              border: '1px solid rgba(189, 201, 198, 0.4)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
                Hypothesis Testing: Welch's Two-Sample t-Test
              </h2>
              <span
                className="badge-queued"
                style={{
                  backgroundColor: tTest.significant ? 'rgba(0, 92, 85, 0.1)' : 'var(--surface-container-low)',
                  color: tTest.significant ? 'var(--primary)' : 'var(--outline)',
                  borderColor: tTest.significant ? 'var(--primary-fixed-dim)' : 'var(--outline-variant)',
                  fontWeight: 600,
                }}
              >
                {tTest.significant ? 'p < 0.05 (STATISTICALLY SIGNIFICANT)' : 'p ≥ 0.05 (NOT SIGNIFICANT)'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', backgroundColor: 'var(--surface-container-low)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <span className="font-label-text" style={{ color: 'var(--outline)' }}>t-STATISTIC</span>
                <div className="font-mono-data-lg" style={{ fontWeight: 600, color: 'var(--on-surface)', marginTop: '2px' }}>
                  {tTest.tValue}
                </div>
              </div>
              <div>
                <span className="font-label-text" style={{ color: 'var(--outline)' }}>DEGREES OF FREEDOM (df)</span>
                <div className="font-mono-data-lg" style={{ fontWeight: 600, color: 'var(--on-surface)', marginTop: '2px' }}>
                  {tTest.df}
                </div>
              </div>
              <div>
                <span className="font-label-text" style={{ color: 'var(--outline)' }}>TWO-TAILED p-VALUE</span>
                <div className="font-mono-data-lg" style={{ fontWeight: 600, color: tTest.significant ? 'var(--primary)' : 'var(--on-surface)', marginTop: '2px' }}>
                  {tTest.pValue < 0.0001 ? '< 0.0001' : tTest.pValue}
                </div>
              </div>
              <div>
                <span className="font-label-text" style={{ color: 'var(--outline)' }}>SIGNIFICANCE THRESHOLD</span>
                <div className="font-mono-data-lg" style={{ fontWeight: 600, color: 'var(--outline)', marginTop: '2px' }}>
                  α = 0.05
                </div>
              </div>
            </div>

            <div style={{ borderLeft: '3px solid var(--primary-container)', paddingLeft: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
              <span className="font-label-text" style={{ color: 'var(--outline)', textTransform: 'uppercase' }}>Academic Interpretation</span>
              <p className="font-body-md" style={{ color: 'var(--on-surface)', marginTop: '4px', fontWeight: 500 }}>
                {tTest.interpretation}
              </p>
            </div>
          </div>

          {/* Bar Chart Comparison */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              border: '1px solid rgba(189, 201, 198, 0.4)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
                Mean Total Trust Score Comparison
              </h2>
              <span className="font-mono-data-sm" style={{ color: 'var(--outline)' }}>
                Scale: 5 - 25 points
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-sm) 0' }}>
              {/* Condition A Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                    Condition A (Standard / Black-box)
                  </span>
                  <span className="font-mono-data-md" style={{ fontWeight: 600, color: 'var(--on-surface)' }}>
                    {totalStatsA.mean} / 25 (SD: ±{totalStatsA.stdDev}, N={countA})
                  </span>
                </div>
                <div style={{ width: '100%', height: '24px', backgroundColor: 'var(--surface-container-highest)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--outline)',
                      width: `${Math.min(100, Math.max(0, (totalStatsA.mean / 25) * 100))}%`,
                      transition: 'width 0.6s ease',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </div>
              </div>

              {/* Condition B Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="font-body-md" style={{ color: 'var(--on-surface)', fontWeight: 500 }}>
                    Condition B (Explainable / LIN-SHAP)
                  </span>
                  <span className="font-mono-data-md" style={{ fontWeight: 600, color: 'var(--primary-container)' }}>
                    {totalStatsB.mean} / 25 (SD: ±{totalStatsB.stdDev}, N={countB})
                  </span>
                </div>
                <div style={{ width: '100%', height: '24px', backgroundColor: 'var(--surface-container-highest)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--primary-container)',
                      width: `${Math.min(100, Math.max(0, (totalStatsB.mean / 25) * 100))}%`,
                      transition: 'width 0.6s ease',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistical Breakdown Table */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              border: '1px solid rgba(189, 201, 198, 0.4)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)' }}>
              <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
                Itemized Question Statistics
              </h2>
              <span className="font-mono-data-sm" style={{ color: 'var(--outline)' }}>
                1 = Strongly Disagree, 5 = Strongly Agree
              </span>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Measure</th>
                    <th style={{ textAlign: 'right' }}>Cond A (Mean ± SD)</th>
                    <th style={{ textAlign: 'right' }}>Cond B (Mean ± SD)</th>
                    <th style={{ textAlign: 'right' }}>Difference (Δ)</th>
                  </tr>
                </thead>
                <tbody>
                  {questionStats.map((item) => (
                    <tr key={item.questionId}>
                      <td style={{ fontWeight: 500 }}>{item.questionText}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {item.condA.mean.toFixed(2)} ± {item.condA.stdDev.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {item.condB.mean.toFixed(2)} ± {item.condB.stdDev.toFixed(2)}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          color: item.diff > 0 ? 'var(--primary)' : item.diff < 0 ? 'var(--secondary)' : 'inherit',
                        }}
                      >
                        {item.diff > 0 ? `+${item.diff.toFixed(2)}` : item.diff.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {/* Total Composite Row */}
                  <tr style={{ backgroundColor: 'var(--surface-container-low)', fontWeight: 600 }}>
                    <td>Total Composite Trust Score (5-25)</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {totalStatsA.mean.toFixed(2)} ± {totalStatsA.stdDev.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                      {totalStatsB.mean.toFixed(2)} ± {totalStatsB.stdDev.toFixed(2)}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: totalDiff > 0 ? 'var(--primary)' : totalDiff < 0 ? 'var(--secondary)' : 'inherit',
                      }}
                    >
                      {totalDiff > 0 ? `+${totalDiff.toFixed(2)}` : totalDiff.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Raw Responses Log */}
          <div
            style={{
              backgroundColor: 'var(--surface-container-lowest)',
              border: '1px solid rgba(189, 201, 198, 0.4)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
              <h2 className="font-headline-md" style={{ color: 'var(--on-surface)', letterSpacing: '-0.01em' }}>
                Participant Submissions Log ({submissions.length})
              </h2>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '11px', height: '28px', color: 'var(--error)' }}
                onClick={handleClearData}
              >
                Clear Local Data
              </button>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Condition</th>
                    <th style={{ textAlign: 'right' }}>Time</th>
                    <th style={{ textAlign: 'center' }}>Q1</th>
                    <th style={{ textAlign: 'center' }}>Q2</th>
                    <th style={{ textAlign: 'center' }}>Q3</th>
                    <th style={{ textAlign: 'center' }}>Q4</th>
                    <th style={{ textAlign: 'center' }}>Q5</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.participantId}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{sub.participantId}</td>
                      <td>
                        <span
                          className="badge-queued"
                          style={{
                            backgroundColor: sub.condition === 'B' ? 'rgba(0, 92, 85, 0.08)' : 'var(--surface-container-low)',
                            color: sub.condition === 'B' ? 'var(--primary)' : 'var(--on-surface-variant)',
                          }}
                        >
                          {sub.condition === 'B' ? 'B (Explainable)' : 'A (Standard)'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{sub.timeSpentSeconds}s</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sub.answers.q1}</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sub.answers.q2}</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sub.answers.q3}</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sub.answers.q4}</td>
                      <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{sub.answers.q5}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{sub.totalScore}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--outline)' }}>
                        {new Date(sub.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
