import {
  selectNextBestActions
} from "../js/core/next-actions.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const recommendations = [
  {
    id: "completed-immediate",
    title: "Completed immediate item",
    priority: "immediate",
    difficulty: "easy",
    estimatedEffort: "A few hours"
  },
  {
    id: "overdue-high",
    title: "Overdue high-priority item",
    priority: "high",
    difficulty: "moderate",
    estimatedEffort: "One business day"
  },
  {
    id: "in-progress-high",
    title: "High-priority work already underway",
    priority: "high",
    difficulty: "easy",
    estimatedEffort: "A few hours"
  },
  {
    id: "upcoming-immediate",
    title: "Immediate item due soon",
    priority: "immediate",
    difficulty: "moderate",
    estimatedEffort: "One business day"
  },
  {
    id: "medium-easy",
    title: "Medium-priority easy item",
    priority: "medium",
    difficulty: "easy",
    estimatedEffort: "Less than one hour"
  }
];

const actionPlan = {
  items: [
    {
      recommendationId: "completed-immediate",
      status: "complete",
      targetDate: "2026-08-01",
      checklist: []
    },
    {
      recommendationId: "overdue-high",
      status: "not-started",
      targetDate: "2026-08-03",
      checklist: []
    },
    {
      recommendationId: "in-progress-high",
      status: "in-progress",
      targetDate: null,
      checklist: [
        {
          id: "check-1",
          completed: true
        },
        {
          id: "check-2",
          completed: false
        }
      ]
    },
    {
      recommendationId: "upcoming-immediate",
      status: "not-started",
      targetDate: "2026-08-10",
      checklist: []
    },
    {
      recommendationId: "medium-easy",
      status: "not-started",
      targetDate: null,
      checklist: []
    }
  ]
};

const originalRecommendations =
  structuredClone(recommendations);

const originalActionPlan =
  structuredClone(actionPlan);

const actions = selectNextBestActions(
  recommendations,
  actionPlan,
  {
    today: "2026-08-06T12:00:00.000Z"
  }
);

assert(
  actions.length === 3,
  "Default next-action limit was incorrect."
);

assert(
  !actions.some(
    (item) =>
      item.recommendationId === "completed-immediate"
  ),
  "Completed recommendation was included."
);

assert(
  actions[0].recommendationId ===
    "upcoming-immediate",
  "Immediate near-term recommendation was not ranked first."
);

assert(
  actions.some(
    (item) =>
      item.recommendationId === "overdue-high" &&
      item.reasons.includes("Target date is overdue")
  ),
  "Overdue work was not identified correctly."
);

assert(
  actions.some(
    (item) =>
      item.recommendationId === "in-progress-high" &&
      item.reasons.includes("Already in progress")
  ),
  "In-progress work was not identified correctly."
);

const inProgressAction = actions.find(
  (item) =>
    item.recommendationId === "in-progress-high"
);

assert(
  inProgressAction?.quickWin === true,
  "Quick Win status was incorrect."
);

assert(
  inProgressAction?.checklist.completedItems === 1 &&
    inProgressAction.checklist.totalItems === 2,
  "Checklist progress was incorrect."
);

assert(
  inProgressAction?.reasons.includes(
    "Checklist work has already started"
  ),
  "Checklist momentum reason was missing."
);

const limitedActions = selectNextBestActions(
  recommendations,
  actionPlan,
  {
    today: "2026-08-06T12:00:00.000Z",
    limit: 1
  }
);

assert(
  limitedActions.length === 1,
  "Custom next-action limit was incorrect."
);

assert(
  JSON.stringify(recommendations) ===
    JSON.stringify(originalRecommendations),
  "Recommendation data was mutated."
);

assert(
  JSON.stringify(actionPlan) ===
    JSON.stringify(originalActionPlan),
  "Action-plan data was mutated."
);

const emptyActions =
  selectNextBestActions([], null);

assert(
  Array.isArray(emptyActions) &&
    emptyActions.length === 0,
  "Empty next-action result was incorrect."
);

console.log("NEXT BEST ACTION TESTS");
console.log("Completed-item exclusion: pass");
console.log("Priority and due-date ranking: pass");
console.log("Overdue reasoning: pass");
console.log("In-progress reasoning: pass");
console.log("Quick Win detection: pass");
console.log("Checklist momentum: pass");
console.log("Result limiting: pass");
console.log("Immutability: pass");
console.log("Empty-state handling: pass");
