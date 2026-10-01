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
    coApplicantIncome: string;
    coApplicantIncomeNumeric: number;
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
    factorModel: string;
    attributions: {
      label: string;
      percentage: number;
      colorClass: string;
      colorHex: string;
    }[];
    determinants: string[];
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
    coApplicantIncome: '₹9,60,000',
    coApplicantIncomeNumeric: 960000,
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
    factorModel: 'LIN-SHAP',
    attributions: [
      {
        label: 'Repayment capacity',
        percentage: 50,
        colorClass: 'bg-primary',
        colorHex: '#005c55',
      },
      {
        label: 'Collateral',
        percentage: 30,
        colorClass: 'bg-primary-container',
        colorHex: '#0f766e',
      },
      {
        label: 'Loan amount',
        percentage: 20,
        colorClass: 'bg-primary-fixed-dim',
        colorHex: '#80d5cb',
      },
    ],
    determinants: [
      "The estimated EMI (₹47,200) is about 59% of the co-applicant's monthly income. The limit in this simulation is 45%.",
      'No collateral was offered.',
    ],
  },
};
