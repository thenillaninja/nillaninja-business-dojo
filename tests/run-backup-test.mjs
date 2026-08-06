import {
  createBackupFilename,
  createBusinessDojoBackup,
  parseBusinessDojoBackup,
  validateBusinessDojoBackup
} from "../js/core/backup.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const snapshot = {
  id: "snapshot-1",
  business: {
    name: "Test Business",
    normalizedName: "test business"
  },
  results: {
    overallScore: 50
  }
};

const actionPlan = {
  id: "action-plan-1",
  snapshotId: "snapshot-1",
  items: []
};

const backup = createBusinessDojoBackup({
  applicationState: {
    navigation: {
      currentView: "welcome"
    }
  },
  snapshotCollection: {
    schemaVersion: "0.2",
    updatedAt: null,
    snapshots: [snapshot]
  },
  actionPlanCollection: {
    schemaVersion: "0.2",
    updatedAt: null,
    actionPlans: [actionPlan]
  },
  exportedAt: "2026-08-06T06:45:00.000Z"
});

assert(
  backup.product === "nillaninja-business-dojo",
  "Backup product identifier is incorrect."
);

assert(
  backup.schemaVersion === "0.2",
  "Backup schema version is incorrect."
);

assert(
  backup.data.snapshotCollection.snapshots.length === 1,
  "Snapshot collection was not included."
);

assert(
  backup.data.actionPlanCollection.actionPlans.length === 1,
  "Action-plan collection was not included."
);

assert(
  validateBusinessDojoBackup(backup).isValid === true,
  "Valid backup was rejected."
);

const parsed = parseBusinessDojoBackup(
  JSON.stringify(backup)
);

assert(
  parsed.isValid === true &&
    parsed.backup.data.snapshotCollection.snapshots[0].id ===
      "snapshot-1",
  "Valid backup JSON was not parsed correctly."
);

const malformedJson = parseBusinessDojoBackup("{broken");

assert(
  malformedJson.isValid === false &&
    malformedJson.backup === null,
  "Malformed JSON was accepted."
);

const wrongProduct = structuredClone(backup);
wrongProduct.product = "another-product";

assert(
  validateBusinessDojoBackup(wrongProduct).isValid === false,
  "Backup from another product was accepted."
);

const wrongVersion = structuredClone(backup);
wrongVersion.schemaVersion = "9.9";

assert(
  validateBusinessDojoBackup(wrongVersion).isValid === false,
  "Unsupported backup schema was accepted."
);

const invalidSnapshots = structuredClone(backup);
invalidSnapshots.data.snapshotCollection = {
  snapshots: "not-an-array"
};

assert(
  validateBusinessDojoBackup(invalidSnapshots).isValid === false,
  "Invalid snapshot collection was accepted."
);

const orphanedActionPlan = structuredClone(backup);
orphanedActionPlan.data.actionPlanCollection.actionPlans[0].snapshotId =
  "missing-snapshot";

assert(
  validateBusinessDojoBackup(orphanedActionPlan).isValid === false,
  "Orphaned action plan was accepted."
);

const nullApplicationState = structuredClone(backup);
nullApplicationState.data.applicationState = null;

assert(
  validateBusinessDojoBackup(nullApplicationState).isValid === true,
  "Null application state should be allowed."
);

assert(
  createBackupFilename(
    new Date("2026-08-06T12:00:00.000Z")
  ) ===
    "nillaninja-business-dojo-backup-2026-08-06.json",
  "Backup filename was generated incorrectly."
);

console.log("BACKUP TESTS");
console.log("Backup creation: pass");
console.log("Backup validation: pass");
console.log("JSON parsing: pass");
console.log("Product and schema rejection: pass");
console.log("Collection validation: pass");
console.log("Orphaned action-plan rejection: pass");
console.log("Backup filename: pass");
