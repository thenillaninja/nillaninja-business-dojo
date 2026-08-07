export const initialState = {
  metadata: {
    appVersion: "0.3",
    assessmentVersion: "0.1",
    createdAt: null,
    lastSavedAt: null,
    currentSnapshotId: null
  },

  navigation: {
    currentView: "welcome",
    currentStep: 1,
    currentQuestionIndex: 0,
    completedSteps: []
  },

  businessProfile: {
    businessName: "",
    businessType: "",
    industry: "",
    yearsOperating: "",
    employeeCount: "",
    productsServices: "",
    customerType: "",
    currentPriority: "",
    mainChallenge: ""
  },

  assessment: {
    answers: {},
    completedQuestionIds: [],
    completionPercentage: 0
  },

  results: {
    overallScore: null,
    categoryScores: {},
    findings: [],
    strengths: [],
    recommendations: []
  },

  report: {
    generatedAt: null,
    executiveSummary: "",
    profileSummary: "",
    actionPlan: [],
    exportText: ""
  }
};

export function createInitialState() {
  return structuredClone(initialState);
}
