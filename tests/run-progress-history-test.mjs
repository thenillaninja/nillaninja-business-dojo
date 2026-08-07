import assert from "node:assert/strict";

import {
  buildProgressHistory
} from "../js/core/progress-history.js";

const snapshots = [
  {
    id: "snapshot-3",
    completedAt: "2026-08-07T12:00:00.000Z",
    business: {
      name: "Harbor Street Market",
      normalizedName: "harbor street market"
    },
    results: {
      overallScore: 64
    }
  },
  {
    id: "snapshot-other",
    completedAt: "2026-07-15T12:00:00.000Z",
    business: {
      name: "Different Business",
      normalizedName: "different business"
    },
    results: {
      overallScore: 91
    }
  },
  {
    id: "snapshot-1",
    completedAt: "2026-06-01T12:00:00.000Z",
    business: {
      name: "Harbor Street Market",
      normalizedName: "harbor street market"
    },
    results: {
      overallScore: 44
    }
  },
  {
    id: "snapshot-2",
    completedAt: "2026-07-01T12:00:00.000Z",
    business: {
      name: "Harbor Street Market",
      normalizedName: "harbor street market"
    },
    results: {
      overallScore: 57
    }
  }
];

const originalSnapshots = structuredClone(snapshots);

const history = buildProgressHistory(
  snapshots,
  "harbor street market"
);

assert.equal(
  history.businessName,
  "Harbor Street Market"
);

assert.deepEqual(
  history.entries.map((entry) => entry.snapshotId),
  ["snapshot-1", "snapshot-2", "snapshot-3"]
);

assert.deepEqual(
  history.entries.map((entry) => entry.score),
  [44, 57, 64]
);

assert.equal(history.startingScore, 44);
assert.equal(history.latestScore, 64);
assert.equal(history.overallChange, 20);
assert.equal(history.snapshotCount, 3);

console.log("Chronological history: pass");
console.log("Business filtering: pass");
console.log("Score summary: pass");

const single = buildProgressHistory(
  [snapshots[0]],
  "harbor street market"
);

assert.equal(single.snapshotCount, 1);
assert.equal(single.startingScore, 64);
assert.equal(single.latestScore, 64);
assert.equal(single.overallChange, 0);

console.log("Single-snapshot handling: pass");

const missing = buildProgressHistory(
  snapshots,
  "missing business"
);

assert.equal(missing.snapshotCount, 0);
assert.deepEqual(missing.entries, []);
assert.equal(missing.startingScore, null);
assert.equal(missing.latestScore, null);
assert.equal(missing.overallChange, 0);

console.log("Missing-history handling: pass");

assert.deepEqual(
  snapshots,
  originalSnapshots,
  "Progress history mutated the source snapshots."
);

console.log("Immutability: pass");
console.log("\nPROGRESS HISTORY TESTS COMPLETE");
