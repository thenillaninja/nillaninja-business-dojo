import {
  createBackupFilename,
  createBusinessDojoBackup,
  parseBusinessDojoBackup,
  restoreBusinessDojoBackup,
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

const reassessmentPlan = {
  sourceSnapshotId: "snapshot-1",
  business: {
    name: "Test Business",
    normalizedName: "test business"
  },
  intervalDays: 60,
  scheduledFor: "2026-10-06",
  createdAt: "2026-08-07T05:00:00.000Z",
  updatedAt: "2026-08-07T05:00:00.000Z"
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
  reassessmentCollection: {
    schemaVersion: "0.3",
    updatedAt: null,
    plans: [reassessmentPlan]
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
  backup.data.reassessmentCollection.plans.length === 1,
  "Reassessment collection was not included."
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

const restoredWrites = {
  applicationState: null,
  snapshotCollection: null,
  actionPlanCollection: null,
  reassessmentCollection: null
};

const successfulRestore = restoreBusinessDojoBackup(
  backup,
  {
    readApplicationState: () => ({
      navigation: {
        currentView: "report"
      }
    }),
    readSnapshotCollection: () => ({
      schemaVersion: "0.2",
      updatedAt: null,
      snapshots: []
    }),
    readActionPlanCollection: () => ({
      schemaVersion: "0.2",
      updatedAt: null,
      actionPlans: []
    }),
    readReassessmentCollection: () => ({
      schemaVersion: "0.3",
      updatedAt: null,
      plans: []
    }),
    writeApplicationState: (value) => {
      restoredWrites.applicationState =
        structuredClone(value);
      return true;
    },
    clearApplicationState: () => true,
    writeSnapshotCollection: (value) => {
      restoredWrites.snapshotCollection =
        structuredClone(value);
      return true;
    },
    writeActionPlanCollection: (value) => {
      restoredWrites.actionPlanCollection =
        structuredClone(value);
      return true;
    },
    writeReassessmentCollection: (value) => {
      restoredWrites.reassessmentCollection =
        structuredClone(value);
      return true;
    }
  }
);

assert(
  successfulRestore.isSuccessful === true,
  "Valid backup restore failed."
);

assert(
  restoredWrites.applicationState.navigation.currentView ===
    "welcome",
  "Application state was not restored."
);

assert(
  restoredWrites.snapshotCollection.snapshots[0].id ===
    "snapshot-1",
  "Snapshot collection was not restored."
);

assert(
  restoredWrites.actionPlanCollection.actionPlans[0].id ===
    "action-plan-1",
  "Action-plan collection was not restored."
);

assert(
  restoredWrites.reassessmentCollection.plans[0]
    .sourceSnapshotId === "snapshot-1",
  "Reassessment collection was not restored."
);

const rollbackWrites = {
  applicationStates: [],
  snapshotCollections: [],
  actionPlanCollections: [],
  reassessmentCollections: []
};

const previousApplicationState = {
  navigation: {
    currentView: "snapshot-library"
  }
};

const previousSnapshotCollection = {
  schemaVersion: "0.2",
  updatedAt: null,
  snapshots: [
    {
      id: "previous-snapshot"
    }
  ]
};

const previousActionPlanCollection = {
  schemaVersion: "0.2",
  updatedAt: null,
  actionPlans: [
    {
      id: "previous-action-plan",
      snapshotId: "previous-snapshot"
    }
  ]
};

const previousReassessmentCollection = {
  schemaVersion: "0.3",
  updatedAt: null,
  plans: [
    {
      sourceSnapshotId: "previous-snapshot",
      intervalDays: 30,
      scheduledFor: "2026-09-06"
    }
  ]
};

let actionPlanWriteCount = 0;

const failedRestore = restoreBusinessDojoBackup(
  backup,
  {
    readApplicationState: () =>
      structuredClone(previousApplicationState),
    readSnapshotCollection: () =>
      structuredClone(previousSnapshotCollection),
    readActionPlanCollection: () =>
      structuredClone(previousActionPlanCollection),
    readReassessmentCollection: () =>
      structuredClone(previousReassessmentCollection),
    writeApplicationState: (value) => {
      rollbackWrites.applicationStates.push(
        structuredClone(value)
      );
      return true;
    },
    clearApplicationState: () => true,
    writeSnapshotCollection: (value) => {
      rollbackWrites.snapshotCollections.push(
        structuredClone(value)
      );
      return true;
    },
    writeActionPlanCollection: (value) => {
      actionPlanWriteCount += 1;

      rollbackWrites.actionPlanCollections.push(
        structuredClone(value)
      );

      return actionPlanWriteCount > 1;
    },
    writeReassessmentCollection: (value) => {
      rollbackWrites.reassessmentCollections.push(
        structuredClone(value)
      );

      return true;
    }
  }
);

assert(
  failedRestore.isSuccessful === false,
  "Restore failure was not reported."
);

assert(
  rollbackWrites.applicationStates.at(-1).navigation.currentView ===
    "snapshot-library",
  "Previous application state was not restored after failure."
);

assert(
  rollbackWrites.snapshotCollections.at(-1).snapshots[0].id ===
    "previous-snapshot",
  "Previous snapshot collection was not restored after failure."
);

assert(
  rollbackWrites.actionPlanCollections.at(-1).actionPlans[0].id ===
    "previous-action-plan",
  "Previous action-plan collection was not restored after failure."
);

assert(
  rollbackWrites.reassessmentCollections.at(-1).plans[0]
    .sourceSnapshotId === "previous-snapshot",
  "Previous reassessment collection was not restored after failure."
);

console.log("Successful restoration: pass");
console.log("Rollback protection: pass");
