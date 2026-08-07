import {
  loadActionPlanCollection,
  saveActionPlanCollection
} from "./action-plan-storage.js";
import {
  loadSnapshotCollection,
  saveSnapshotCollection
} from "./snapshot-storage.js";
import {
  loadReassessmentCollection,
  saveReassessmentCollection
} from "./reassessment-storage.js";
import {
  clearState,
  loadState,
  saveState
} from "./storage.js";

const BACKUP_SCHEMA_VERSION = "0.2";
const BACKUP_PRODUCT_ID =
  "nillaninja-business-dojo";

function isPlainObject(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function validateSnapshotCollection(collection) {
  return Boolean(
    isPlainObject(collection) &&
    Array.isArray(collection.snapshots)
  );
}

function validateActionPlanCollection(collection) {
  return Boolean(
    isPlainObject(collection) &&
    Array.isArray(collection.actionPlans)
  );
}

function validateReassessmentCollection(collection) {
  return Boolean(
    isPlainObject(collection) &&
    Array.isArray(collection.plans)
  );
}

function createEmptyReassessmentCollection() {
  return {
    schemaVersion: "0.3",
    updatedAt: null,
    plans: []
  };
}

export function createBusinessDojoBackup({
  applicationState = loadState(),
  snapshotCollection = loadSnapshotCollection(),
  actionPlanCollection = loadActionPlanCollection(),
  reassessmentCollection = loadReassessmentCollection(),
  exportedAt = new Date().toISOString()
} = {}) {
  return structuredClone({
    product: BACKUP_PRODUCT_ID,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt,
    data: {
      applicationState,
      snapshotCollection,
      actionPlanCollection,
      reassessmentCollection
    }
  });
}

export function validateBusinessDojoBackup(value) {
  if (!isPlainObject(value)) {
    return {
      isValid: false,
      reason:
        "The selected file does not contain a valid backup object."
    };
  }

  if (value.product !== BACKUP_PRODUCT_ID) {
    return {
      isValid: false,
      reason:
        "This file is not a NillaNinja Business Dojo backup."
    };
  }

  if (value.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    return {
      isValid: false,
      reason:
        "This backup uses an unsupported schema version."
    };
  }

  if (!isPlainObject(value.data)) {
    return {
      isValid: false,
      reason:
        "The backup does not contain the required data section."
    };
  }

  const {
    applicationState,
    snapshotCollection,
    actionPlanCollection,
    reassessmentCollection
  } = value.data;

  if (
    applicationState !== null &&
    !isPlainObject(applicationState)
  ) {
    return {
      isValid: false,
      reason:
        "The backup contains an invalid application state."
    };
  }

  if (!validateSnapshotCollection(snapshotCollection)) {
    return {
      isValid: false,
      reason:
        "The backup contains an invalid snapshot collection."
    };
  }

  if (!validateActionPlanCollection(actionPlanCollection)) {
    return {
      isValid: false,
      reason:
        "The backup contains an invalid action-plan collection."
    };
  }

  if (
    reassessmentCollection !== undefined &&
    !validateReassessmentCollection(reassessmentCollection)
  ) {
    return {
      isValid: false,
      reason:
        "The backup contains an invalid reassessment collection."
    };
  }

  const snapshotIds = new Set(
    snapshotCollection.snapshots
      .map((snapshot) => snapshot?.id)
      .filter(Boolean)
  );

  const hasOrphanedActionPlan =
    actionPlanCollection.actionPlans.some(
      (actionPlan) =>
        !actionPlan?.snapshotId ||
        !snapshotIds.has(actionPlan.snapshotId)
    );

  if (hasOrphanedActionPlan) {
    return {
      isValid: false,
      reason:
        "The backup contains an action plan that is not connected to a saved snapshot."
    };
  }

  return {
    isValid: true,
    reason: ""
  };
}

export function parseBusinessDojoBackup(jsonText) {
  if (typeof jsonText !== "string" || !jsonText.trim()) {
    return {
      isValid: false,
      reason: "The selected backup file is empty.",
      backup: null
    };
  }

  try {
    const backup = JSON.parse(jsonText);
    const validation =
      validateBusinessDojoBackup(backup);

    return {
      ...validation,
      backup: validation.isValid
        ? structuredClone(backup)
        : null
    };
  } catch {
    return {
      isValid: false,
      reason:
        "The selected file does not contain valid JSON.",
      backup: null
    };
  }
}

export function restoreBusinessDojoBackup(
  backup,
  {
    readApplicationState = loadState,
    readSnapshotCollection = loadSnapshotCollection,
    readActionPlanCollection = loadActionPlanCollection,
    readReassessmentCollection = loadReassessmentCollection,
    writeApplicationState = saveState,
    clearApplicationState = clearState,
    writeSnapshotCollection = saveSnapshotCollection,
    writeActionPlanCollection = saveActionPlanCollection,
    writeReassessmentCollection = saveReassessmentCollection
  } = {}
) {
  const validation =
    validateBusinessDojoBackup(backup);

  if (!validation.isValid) {
    return {
      isSuccessful: false,
      reason: validation.reason
    };
  }

  const previousData = {
    applicationState: readApplicationState(),
    snapshotCollection: readSnapshotCollection(),
    actionPlanCollection: readActionPlanCollection(),
    reassessmentCollection: readReassessmentCollection()
  };

  const restorePreviousData = () => {
    if (previousData.applicationState === null) {
      clearApplicationState();
    } else {
      writeApplicationState(
        previousData.applicationState
      );
    }

    writeSnapshotCollection(
      previousData.snapshotCollection
    );

    writeActionPlanCollection(
      previousData.actionPlanCollection
    );

    writeReassessmentCollection(
      previousData.reassessmentCollection
    );
  };

  const nextApplicationState =
    backup.data.applicationState;

  const applicationStateSaved =
    nextApplicationState === null
      ? clearApplicationState()
      : writeApplicationState(
          structuredClone(nextApplicationState)
        );

  if (!applicationStateSaved) {
    restorePreviousData();

    return {
      isSuccessful: false,
      reason:
        "The current application state could not be replaced."
    };
  }

  const snapshotsSaved =
    writeSnapshotCollection(
      structuredClone(
        backup.data.snapshotCollection
      )
    );

  if (!snapshotsSaved) {
    restorePreviousData();

    return {
      isSuccessful: false,
      reason:
        "The saved snapshots could not be restored."
    };
  }

  const actionPlansSaved =
    writeActionPlanCollection(
      structuredClone(
        backup.data.actionPlanCollection
      )
    );

  if (!actionPlansSaved) {
    restorePreviousData();

    return {
      isSuccessful: false,
      reason:
        "The action plans could not be restored."
    };
  }

  const reassessmentCollection =
    backup.data.reassessmentCollection ??
    createEmptyReassessmentCollection();

  const reassessmentsSaved =
    writeReassessmentCollection(
      structuredClone(reassessmentCollection)
    );

  if (!reassessmentsSaved) {
    restorePreviousData();

    return {
      isSuccessful: false,
      reason:
        "The reassessment plans could not be restored."
    };
  }

  return {
    isSuccessful: true,
    reason: ""
  };
}

export function createBackupFilename(
  date = new Date()
) {
  const safeDate =
    date instanceof Date &&
    !Number.isNaN(date.getTime())
      ? date.toISOString().slice(0, 10)
      : "backup";

  return `nillaninja-business-dojo-backup-${safeDate}.json`;
}

export {
  BACKUP_PRODUCT_ID,
  BACKUP_SCHEMA_VERSION
};
