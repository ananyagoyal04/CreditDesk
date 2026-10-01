export interface AttributionFactor {
  id: string;
  label: string;
  percentage: number;
  colorHex: string;
  colorClass: string;
}

export interface LoanApplicationData {
  applicationId: string;
  status: string;
  applicant: {
    name: string;
    age: number;
    course: string;
    institutionCountry: string;
    duration: string;
    loanRequested: string;
    loanRequestedNumeric: number;
    repaymentTerm: string;
    estimatedEmi: string;
    estimatedEmiNumeric: number;
    collateral: string;
    coApplicantRelation: string;
    coApplicantAnnualIncome: string;
    coApplicantMonthlyIncome: string;
    creditHistory: string;
  };
  decision: {
    outcome: 'DENIED';
    status: string;
    date: string;
    timestamp: string;
    engine: string;
    hash: string;
    execRef: string;
    confidence: number;
    description: string;
    attributions: AttributionFactor[];
    keyReasonsHeading: string;
    keyReasons: string[];
  };
}

export const LOAN_APPLICATION: LoanApplicationData = {
  applicationId: 'LN-20481',
  status: 'QUEUED',
  applicant: {
    name: 'Rohan Sharma',
    age: 23,
    course: 'MS Data Science',
    institutionCountry: 'Canada',
    duration: '2 years',
    loanRequested: '₹35,00,000',
    loanRequestedNumeric: 3500000,
    repaymentTerm: '10 years',
    estimatedEmi: '₹47,200',
    estimatedEmiNumeric: 47200,
    collateral: 'None',
    coApplicantRelation: 'father',
    coApplicantAnnualIncome: '₹9,60,000',
    coApplicantMonthlyIncome: '₹80,000',
    creditHistory: 'None (first-time borrower)',
  },
  decision: {
    outcome: 'DENIED',
    status: 'Final',
    date: '01 Oct 2026',
    timestamp: '01 Oct 2026, 14:32:08 UTC',
    engine: 'v4.12',
    hash: '8f9b2d01',
    execRef: '#9812-B',
    confidence: 89,
    description: 'These are the factors that most influenced the decision.',
    attributions: [
      {
        id: 'repayment_capacity',
        label: 'Repayment capacity',
        percentage: 45,
        colorHex: '#005c55',
        colorClass: 'bg-primary',
      },
      {
        id: 'collateral',
        label: 'Collateral',
        percentage: 25,
        colorHex: '#0f766e',
        colorClass: 'bg-primary-container',
      },
      {
        id: 'loan_amount',
        label: 'Loan amount',
        percentage: 20,
        colorHex: '#006a63',
        colorClass: 'bg-primary',
      },
      {
        id: 'credit_history',
        label: 'Credit history',
        percentage: 10,
        colorHex: '#80d5cb',
        colorClass: 'bg-primary-fixed-dim',
      },
    ],
    keyReasonsHeading: 'Key reasons',
    keyReasons: [
      "Bank policy allows a maximum monthly EMI of 45% of income (₹36,000). The estimated EMI of ₹47,200 is about 59% of the co-applicant's monthly income of ₹80,000.",
      'No collateral was offered.',
      'The applicant has no credit history (first-time borrower).',
    ],
  },
};
