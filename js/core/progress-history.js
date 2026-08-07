function getSnapshotDate(snapshot) {
  return snapshot?.completedAt || snapshot?.createdAt || "";
}

function getNormalizedBusinessName(snapshot) {
  return (
    snapshot?.business?.normalizedName ||
    snapshot?.business?.name?.trim().toLowerCase() ||
    snapshot?.businessProfile?.businessName?.trim().toLowerCase() ||
    ""
  );
}

function getBusinessName(snapshot) {
  return (
    snapshot?.business?.name ||
    snapshot?.businessProfile?.businessName ||
    "Your Business"
  );
}

export function buildProgressHistory(
  snapshots = [],
  normalizedBusinessName = ""
) {
  const targetBusiness = normalizedBusinessName
    .trim()
    .toLowerCase();

  if (!Array.isArray(snapshots) || !targetBusiness) {
    return {
      businessName: "",
      snapshotCount: 0,
      startingScore: null,
      latestScore: null,
      overallChange: 0,
      entries: []
    };
  }

  const matchingSnapshots = snapshots
    .filter(
      (snapshot) =>
        getNormalizedBusinessName(snapshot) === targetBusiness
    )
    .filter((snapshot) =>
      Number.isFinite(snapshot?.results?.overallScore)
    )
    .sort(
      (a, b) =>
        new Date(getSnapshotDate(a) || 0) -
        new Date(getSnapshotDate(b) || 0)
    );

  if (matchingSnapshots.length === 0) {
    return {
      businessName: "",
      snapshotCount: 0,
      startingScore: null,
      latestScore: null,
      overallChange: 0,
      entries: []
    };
  }

  const entries = matchingSnapshots.map((snapshot) => ({
    snapshotId: snapshot.id,
    completedAt: getSnapshotDate(snapshot),
    score: snapshot.results.overallScore
  }));

  const startingScore = entries[0].score;
  const latestScore = entries.at(-1).score;

  return structuredClone({
    businessName: getBusinessName(matchingSnapshots.at(-1)),
    snapshotCount: entries.length,
    startingScore,
    latestScore,
    overallChange: latestScore - startingScore,
    entries
  });
}
