import { summarizeActionPlanProgress } from "./progress.js";

function getSnapshotDate(snapshot) {
  const value =
    snapshot?.completedAt ||
    snapshot?.createdAt ||
    "";

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

function getBusinessName(snapshot) {
  return (
    snapshot?.business?.name ||
    snapshot?.businessProfile?.businessName ||
    "Unnamed Business"
  );
}

function getNormalizedBusinessName(snapshot) {
  const storedName =
    snapshot?.business?.normalizedName;

  if (storedName) {
    return storedName;
  }

  return getBusinessName(snapshot)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getItemId(item) {
  return item?.id || item?.title || "";
}

function getItemsById(items = []) {
  if (!Array.isArray(items)) {
    return new Map();
  }

  return new Map(
    items
      .map((item) => [getItemId(item), item])
      .filter(([id]) => id)
  );
}

export function validateSnapshotComparison(
  firstSnapshot,
  secondSnapshot
) {
  if (!firstSnapshot || !secondSnapshot) {
    return {
      isValid: false,
      reason: "Choose two saved snapshots to compare."
    };
  }

  if (firstSnapshot.id === secondSnapshot.id) {
    return {
      isValid: false,
      reason: "Choose two different snapshots."
    };
  }

  if (
    getNormalizedBusinessName(firstSnapshot) !==
    getNormalizedBusinessName(secondSnapshot)
  ) {
    return {
      isValid: false,
      reason:
        "Snapshots must belong to the same business."
    };
  }

  if (
    firstSnapshot.assessmentVersion !==
    secondSnapshot.assessmentVersion
  ) {
    return {
      isValid: false,
      reason:
        "Snapshots must use the same assessment version."
    };
  }

  if (
    !Number.isFinite(
      firstSnapshot.results?.overallScore
    ) ||
    !Number.isFinite(
      secondSnapshot.results?.overallScore
    )
  ) {
    return {
      isValid: false,
      reason:
        "Both snapshots must contain valid assessment scores."
    };
  }

  if (
    getSnapshotDate(firstSnapshot) === null ||
    getSnapshotDate(secondSnapshot) === null
  ) {
    return {
      isValid: false,
      reason:
        "Both snapshots must contain valid completion dates."
    };
  }

  return {
    isValid: true,
    reason: ""
  };
}

export function orderSnapshots(
  firstSnapshot,
  secondSnapshot
) {
  const firstDate = getSnapshotDate(firstSnapshot);
  const secondDate = getSnapshotDate(secondSnapshot);

  if (
    firstDate === null ||
    secondDate === null
  ) {
    return null;
  }

  return firstDate <= secondDate
    ? {
        earlierSnapshot: firstSnapshot,
        laterSnapshot: secondSnapshot
      }
    : {
        earlierSnapshot: secondSnapshot,
        laterSnapshot: firstSnapshot
      };
}

function compareCategoryScores(
  earlierScores = {},
  laterScores = {}
) {
  const categoryIds = [
    ...new Set([
      ...Object.keys(earlierScores || {}),
      ...Object.keys(laterScores || {})
    ])
  ];

  return categoryIds.map((categoryId) => {
    const earlierScore = Number.isFinite(
      earlierScores?.[categoryId]?.score
    )
      ? earlierScores[categoryId].score
      : null;

    const laterScore = Number.isFinite(
      laterScores?.[categoryId]?.score
    )
      ? laterScores[categoryId].score
      : null;

    const change =
      earlierScore !== null && laterScore !== null
        ? laterScore - earlierScore
        : null;

    return {
      categoryId,
      earlierScore,
      laterScore,
      change,
      direction:
        change === null
          ? "unavailable"
          : change > 0
            ? "improved"
            : change < 0
              ? "declined"
              : "unchanged"
    };
  });
}

function compareCollections(
  earlierItems = [],
  laterItems = []
) {
  const earlierById = getItemsById(earlierItems);
  const laterById = getItemsById(laterItems);

  const added = [...laterById.entries()]
    .filter(([id]) => !earlierById.has(id))
    .map(([, item]) => item);

  const removed = [...earlierById.entries()]
    .filter(([id]) => !laterById.has(id))
    .map(([, item]) => item);

  const continuing = [...laterById.entries()]
    .filter(([id]) => earlierById.has(id))
    .map(([, item]) => item);

  return {
    added,
    removed,
    continuing
  };
}


function getActionPlanForSnapshot(
  snapshot,
  actionPlans = []
) {
  if (!snapshot?.id) {
    return null;
  }

  const matchingPlan = actionPlans.find(
    (actionPlan) =>
      actionPlan?.snapshotId === snapshot.id
  );

  return matchingPlan || null;
}

function compareImplementationProgress(
  earlierSnapshot,
  laterSnapshot,
  actionPlans = []
) {
  const earlierActionPlan = getActionPlanForSnapshot(
    earlierSnapshot,
    actionPlans
  );

  const laterActionPlan = getActionPlanForSnapshot(
    laterSnapshot,
    actionPlans
  );

  if (!earlierActionPlan || !laterActionPlan) {
    return {
      isAvailable: false,
      reason:
        "Implementation progress is unavailable because one or both snapshots do not have a saved action plan.",
      earlier: null,
      later: null,
      completionPercentageChange: null,
      completedItemsChange: null,
      inProgressItemsChange: null,
      checklistCompletionPercentageChange: null
    };
  }

  const earlier = summarizeActionPlanProgress(
    earlierActionPlan,
    earlierSnapshot
  );

  const later = summarizeActionPlanProgress(
    laterActionPlan,
    laterSnapshot
  );

  return {
    isAvailable: true,
    reason: "",
    earlier,
    later,
    completionPercentageChange:
      later.completionPercentage -
      earlier.completionPercentage,
    completedItemsChange:
      later.statusTotals.complete -
      earlier.statusTotals.complete,
    inProgressItemsChange:
      later.statusTotals.inProgress -
      earlier.statusTotals.inProgress,
    checklistCompletionPercentageChange:
      later.checklist.completionPercentage -
      earlier.checklist.completionPercentage
  };
}

export function compareSnapshots(
  firstSnapshot,
  secondSnapshot,
  firstActionPlan = null,
  secondActionPlan = null
) {
  const validation = validateSnapshotComparison(
    firstSnapshot,
    secondSnapshot
  );

  if (!validation.isValid) {
    return {
      isValid: false,
      reason: validation.reason
    };
  }

  const ordered = orderSnapshots(
    firstSnapshot,
    secondSnapshot
  );

  if (!ordered) {
    return {
      isValid: false,
      reason:
        "The snapshots could not be ordered by completion date."
    };
  }

  const {
    earlierSnapshot,
    laterSnapshot
  } = ordered;

  const earlierScore =
    earlierSnapshot.results.overallScore;

  const laterScore =
    laterSnapshot.results.overallScore;

  const strengthChanges = compareCollections(
    earlierSnapshot.results?.strengths,
    laterSnapshot.results?.strengths
  );

  const recommendationChanges =
    compareCollections(
      earlierSnapshot.results?.recommendations,
      laterSnapshot.results?.recommendations
    );

  return {
    isValid: true,
    reason: "",
    businessName: getBusinessName(laterSnapshot),
    earlierSnapshot,
    laterSnapshot,
    overallScore: {
      earlier: earlierScore,
      later: laterScore,
      change: laterScore - earlierScore
    },
    categoryScores: compareCategoryScores(
      earlierSnapshot.results?.categoryScores,
      laterSnapshot.results?.categoryScores
    ),
    strengths: {
      newlyDeveloped: strengthChanges.added,
      noLongerListed: strengthChanges.removed,
      continuing: strengthChanges.continuing
    },
    recommendations: {
      newlyTriggered:
        recommendationChanges.added,
      resolved:
        recommendationChanges.removed,
      continuing:
        recommendationChanges.continuing
    },
    implementationProgress:
      compareImplementationProgress(
        earlierSnapshot,
        laterSnapshot,
        [
          firstActionPlan,
          secondActionPlan
        ].filter(Boolean)
      )
  };
}
