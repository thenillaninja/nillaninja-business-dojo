import { businessProfileFields } from "../data/business-profile.js";
import { businessAssessmentQuestions } from "../data/business-assessment.js";
import { createInitialState } from "./core/state.js";
import { clearState, loadState, saveState } from "./core/storage.js";
import { createSnapshotRecord } from "./core/snapshots.js";
import {
  addChecklistItem,
  createActionPlanRecord,
  deleteChecklistItem,
  updateActionItemFields,
  updateActionItemStatus,
  updateChecklistItemCompletion,
  updateChecklistItemText
} from "./core/action-plans.js";
import {
  deleteActionPlanBySnapshotId,
  getActionPlanBySnapshotId,
  saveActionPlan
} from "./core/action-plan-storage.js";
import {
  deleteSnapshot,
  getMostRecentSnapshot,
  getSnapshotById,
  loadSnapshotCollection,
  saveSnapshot,
  updateSnapshotBusinessProfile
} from "./core/snapshot-storage.js";
import {
  createBusinessMemoryRecord,
  updateBusinessMemoryOutcome,
  updateBusinessMemoryAdoption,
  updateBusinessMemoryOwnerNotes,
  updateBusinessMemoryRecurringWork,
  updateBusinessMemoryAutomation,
  explainBusinessMemoryAutomation
} from "./core/business-memory.js";
import {
  getBusinessMemoryRecord,
  loadBusinessMemoryCollection,
  saveBusinessMemoryRecord
} from "./core/business-memory-storage.js";
import { validateBusinessProfile } from "./core/validation.js";
import {
  getQuestionByIndex,
  updateAssessmentState
} from "./engines/assessment-engine.js";
import { calculateAssessmentScores } from "./engines/scoring-engine.js";
import { generateRecommendations } from "./engines/recommendation-engine.js";
import {
  getVisibleRecommendations
} from "./core/recommendation-filters.js";
import { generateStrengths } from "./engines/strengths-engine.js";
import {
  createBusinessMemoryFilename,
  createReportFilename,
  generateBusinessMemoryText,
  generateReportText
} from "./engines/export-engine.js?v=4";
import { renderProfileView } from "./views/profile-view.js";
import { renderAssessmentView } from "./views/assessment-view.js";
import {
  renderActionChecklist,
  renderReportView
} from "./views/report-view.js?v=5";
import { renderSnapshotLibraryView } from "./views/snapshot-library-view.js";
import { renderBusinessMemoryView } from "./views/business-memory-view.js";
import {
  compareSnapshots
} from "./core/snapshot-comparison.js?v=2";
import {
  buildProgressHistory
} from "./core/progress-history.js";
import {
  createReassessmentPlan,
  getReassessmentStatus
} from "./core/reassessment.js";
import {
  getReassessmentPlanBySnapshotId,
  saveReassessmentPlan
} from "./core/reassessment-storage.js";
import {
  renderSnapshotComparisonView
} from "./views/snapshot-comparison-view.js?v=2";
import {
  createBackupFilename,
  createBusinessDojoBackup,
  parseBusinessDojoBackup,
  restoreBusinessDojoBackup
} from "./core/backup.js";
import {
  renderBackupView
} from "./views/backup-view.js";

const app = document.querySelector("#app");
const stepItems = document.querySelectorAll(".step-navigation__item");

function restoreApplicationState() {
  const initialState = createInitialState();
  const savedState = loadState();

  if (!savedState) {
    return initialState;
  }

  return {
    ...initialState,
    ...savedState,
    metadata: {
      ...initialState.metadata,
      ...savedState.metadata
    },
    navigation: {
      ...initialState.navigation,
      ...savedState.navigation
    },
    businessProfile: {
      ...initialState.businessProfile,
      ...savedState.businessProfile
    },
    assessment: {
      ...initialState.assessment,
      ...savedState.assessment,
      answers: {
        ...initialState.assessment.answers,
        ...savedState.assessment?.answers
      }
    },
    results: {
      ...initialState.results,
      ...savedState.results,
      categoryScores: {
        ...initialState.results.categoryScores,
        ...savedState.results?.categoryScores
      }
    },
    report: {
      ...initialState.report,
      ...savedState.report
    }
  };
}

let state = restoreApplicationState();

let recommendationFilters = {
  status: "all",
  category: "all",
  priority: "all",
  difficulty: "all",
  quickWinsOnly: false,
  sortBy: "original"
};

let selectedSnapshotIds = [];
let snapshotComparisonMessage = "";
let backupStatusMessage = "";
let backupStatusType = "";

function persistState() {
  saveState(state);
}

function ensureActionPlanForSnapshot(snapshot) {
  if (!snapshot?.id) {
    return null;
  }

  const existingPlan = getActionPlanBySnapshotId(snapshot.id);

  if (existingPlan) {
    return existingPlan;
  }

  const actionPlan = createActionPlanRecord(snapshot);

  if (!actionPlan || !saveActionPlan(actionPlan)) {
    return null;
  }

  return actionPlan;
}

function getCurrentActionPlan() {
  const snapshotId = state.metadata.currentSnapshotId;

  if (!snapshotId) {
    return null;
  }

  const snapshot = getSnapshotById(snapshotId);

  return snapshot
    ? ensureActionPlanForSnapshot(snapshot)
    : null;
}

function ensureBusinessMemoryForRecommendation(
  recommendationId
) {
  const snapshotId = state.metadata.currentSnapshotId;

  if (!snapshotId || !recommendationId) {
    return null;
  }

  const existingRecord = getBusinessMemoryRecord(
    snapshotId,
    recommendationId
  );

  if (existingRecord) {
    return existingRecord;
  }

  const snapshot = getSnapshotById(snapshotId);
  const actionPlan = getCurrentActionPlan();

  if (!snapshot) {
    return null;
  }

  const record = createBusinessMemoryRecord({
    snapshot,
    actionPlan,
    recommendationId
  });

  if (!record || !saveBusinessMemoryRecord(record)) {
    return null;
  }

  return record;
}

function saveCompletedSnapshot() {
  if (state.metadata.currentSnapshotId) {
    return true;
  }

  const snapshot = createSnapshotRecord(state);

  if (!snapshot || !saveSnapshot(snapshot)) {
    return false;
  }

  state.metadata.currentSnapshotId = snapshot.id;
  ensureActionPlanForSnapshot(snapshot);
  persistState();

  return true;
}

function updateStepNavigation(currentStep) {
  stepItems.forEach((item, index) => {
    const stepNumber = index + 1;
    const isCurrent = stepNumber === currentStep;

    item.classList.toggle("is-current", isCurrent);

    if (isCurrent) {
      item.setAttribute("aria-current", "step");
    } else {
      item.removeAttribute("aria-current");
    }
  });
}

function updateProductNavigation(currentView) {
  const destinations = {
    welcome: "#product-nav-home",
    profile: "#product-nav-begin",
    assessment: "#product-nav-begin",
    report: "#product-nav-begin",
    "snapshot-library": "#product-nav-snapshots",
    "snapshot-comparison": "#product-nav-snapshots",
    "business-memory": "#product-nav-memory"
  };

  document
    .querySelectorAll(".product-navigation__item")
    .forEach((item) => {
      item.classList.remove("is-current");
      item.removeAttribute("aria-current");
    });

  const currentSelector = destinations[currentView];

  if (!currentSelector) {
    return;
  }

  const currentItem =
    document.querySelector(currentSelector);

  if (!currentItem) {
    return;
  }

  currentItem.classList.add("is-current");
  currentItem.setAttribute("aria-current", "page");
}


function focusMainContent() {
  const viewHeading = document.querySelector("#app h1");

  if (viewHeading) {
    viewHeading.setAttribute("tabindex", "-1");
    viewHeading.focus();
    return;
  }

  document.querySelector("#main-content")?.focus();
}

function bindProductNavigation() {
  const toggle = document.querySelector(
    "#product-nav-toggle"
  );

  const menu = document.querySelector(
    "#product-nav-menu"
  );

  const closeMenu = () => {
    if (!toggle || !menu) {
      return;
    }

    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    if (!menu) {
      return;
    }

    const willOpen = menu.hidden;

    menu.hidden = !willOpen;
    toggle.setAttribute(
      "aria-expanded",
      String(willOpen)
    );
  });

  document.addEventListener("click", (event) => {
    if (menu?.hidden) {
      return;
    }

    const target = event.target;

    if (
      toggle?.contains(target) ||
      menu?.contains(target)
    ) {
      return;
    }

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      menu?.hidden
    ) {
      return;
    }

    closeMenu();
    toggle?.focus();
  });

  document
    .querySelector("#product-nav-home")
    ?.addEventListener("click", () => {
      closeMenu();
      renderWelcomeView();
      focusMainContent();
    });

  document
    .querySelector("#product-nav-begin")
    ?.addEventListener("click", () => {
      closeMenu();
      updateProductNavigation(null);
      renderBusinessProfile({}, "product-navigation");
      focusMainContent();
    });

  document
    .querySelector("#product-nav-snapshots")
    ?.addEventListener("click", () => {
      closeMenu();
      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelector("#product-nav-memory")
    ?.addEventListener("click", () => {
      closeMenu();
      renderBusinessMemory();
      focusMainContent();
    });
}

bindProductNavigation();

function renderWelcomeView() {
  state.navigation.currentView = "welcome";
  state.navigation.currentStep = 1;

  updateStepNavigation(1);
  updateProductNavigation("welcome");
  persistState();

  app.innerHTML = `
    <div class="welcome-panel">
      <p class="eyebrow">Business Snapshot</p>

      <h1>Understand your business. Strengthen your systems.</h1>

      <p class="welcome-panel__intro">
        Complete a guided assessment and receive a practical report showing
        what is working, where opportunities exist, and what to do next.
      </p>

      <div class="information-box">
        <h2>What you will receive</h2>
        <p>
          Your Business Snapshot Report will include category scores,
          business strengths, priority opportunities, implementation
          difficulty, expected impact, and clear first actions.
        </p>
      </div>

      <div class="privacy-notice">
        <h2>Your information stays in this browser</h2>
        <p>
          Version 0.3 stores assessment progress, completed snapshots, action plans, and reassessment planning locally on this device.
          Nothing is uploaded or transmitted.
        </p>
      </div>

      <div class="action-bar">
        <button
          class="button button--primary"
          type="button"
          id="begin-assessment"
        >
          Begin Business Snapshot
        </button>

        <button
          class="button button--secondary"
          type="button"
          id="view-snapshot-library"
        >
          View Snapshot Library
        </button>

        <button
          class="button button--secondary"
          type="button"
          id="view-business-memory"
        >
          View Business Memory
        </button>
      </div>
    </div>
  `;

  document
    .querySelector("#begin-assessment")
    ?.addEventListener("click", () => {
      renderBusinessProfile({}, "welcome");
      focusMainContent();
    });

  document
    .querySelector("#view-snapshot-library")
    ?.addEventListener("click", () => {
      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelector("#view-business-memory")
    ?.addEventListener("click", () => {
      renderBusinessMemory();
      focusMainContent();
    });
}

function getProfileFromForm(form) {
  const formData = new FormData(form);
  const profile = {};

  businessProfileFields.forEach((field) => {
    profile[field.name] = formData.get(field.name)?.toString().trim() ?? "";
  });

  return profile;
}

function renderBusinessMemory() {
  const records =
    loadBusinessMemoryCollection().records.map((record) => {
      const snapshotId = record?.source?.snapshotId;
      const recommendationId =
        record?.source?.recommendationId;

      const snapshot = snapshotId
        ? getSnapshotById(snapshotId)
        : null;

      const recommendation =
        snapshot?.results?.recommendations?.find(
          (item) => item?.id === recommendationId
        );

      return {
        ...record,
        sourceRecommendationTitle:
          recommendation?.title || ""
      };
    });

  state.navigation.currentView = "business-memory";
  state.navigation.currentStep = 1;

  updateStepNavigation(1);
  updateProductNavigation("business-memory");
  persistState();

  app.innerHTML = renderBusinessMemoryView({
    records
  });

  document
    .querySelector("#business-memory-back")
    ?.addEventListener("click", () => {
      renderWelcomeView();
      focusMainContent();
    });

  document
    .querySelector("#business-memory-snapshots")
    ?.addEventListener("click", () => {
      renderSnapshotLibrary();
      focusMainContent();
    });

  const memoryExportStatus =
    document.querySelector(
      "#business-memory-export-status"
    );

  const setMemoryExportStatus = (message) => {
    if (memoryExportStatus) {
      memoryExportStatus.textContent = message;
    }
  };

  const memoryText = generateBusinessMemoryText({
    businessName: state.businessProfile.businessName,
    records
  });

  document
    .querySelector("#business-memory-copy")
    ?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(memoryText);
        setMemoryExportStatus(
          "Business Memory copied to your clipboard."
        );
      } catch (error) {
        console.error(
          "Unable to copy Business Memory:",
          error
        );

        setMemoryExportStatus(
          "Business Memory could not be copied. Try downloading it instead."
        );
      }
    });

  document
    .querySelector("#business-memory-download")
    ?.addEventListener("click", () => {
      const file = new Blob([memoryText], {
        type: "text/plain;charset=utf-8"
      });

      const downloadUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download =
        createBusinessMemoryFilename(
          state.businessProfile.businessName
        );

      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      setMemoryExportStatus(
        "Business Memory downloaded."
      );
    });

  document
    .querySelector("#business-memory-print")
    ?.addEventListener("click", () => {
      setMemoryExportStatus(
        "Opening your browser print options."
      );

      window.print();
    });
}


function renderSnapshotLibrary() {
  const collection = loadSnapshotCollection();
  const mostRecentSnapshot = getMostRecentSnapshot();

  state.navigation.currentView = "snapshot-library";
  state.navigation.currentStep = 1;

  updateStepNavigation(1);
  updateProductNavigation("snapshot-library");
  persistState();

  const snapshots = [...collection.snapshots].reverse();

  const reassessmentPlan = mostRecentSnapshot?.id
    ? getReassessmentPlanBySnapshotId(mostRecentSnapshot.id)
    : null;

  const reassessmentStatus = reassessmentPlan
    ? getReassessmentStatus(reassessmentPlan)
    : null;

  const progressHistory = mostRecentSnapshot
    ? buildProgressHistory(
        collection.snapshots,
        mostRecentSnapshot.business?.normalizedName ||
          mostRecentSnapshot.business?.name ||
          mostRecentSnapshot.businessProfile?.businessName ||
          ""
      )
    : null;

  app.innerHTML = renderSnapshotLibraryView({
    snapshots,
    mostRecentSnapshotId: mostRecentSnapshot?.id || "",
    selectedSnapshotIds,
    comparisonMessage: snapshotComparisonMessage,
    backupMarkup: renderBackupView({
      statusMessage: backupStatusMessage,
      statusType: backupStatusType
    }),
    reassessmentPlan,
    reassessmentStatus,
    progressHistory
  });

  document
    .querySelector("#snapshot-reassessment-continue")
    ?.addEventListener("click", (event) => {
      const snapshot = getSnapshotById(
        event.currentTarget.dataset.snapshotId
      );

      openCompletedSnapshot(snapshot);

      document.querySelector("#action-plan")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

  document
    .querySelector("#snapshot-reassessment-new")
    ?.addEventListener("click", () => {
      state = createInitialState();
      persistState();
      renderBusinessProfile({}, "snapshot-library");
      focusMainContent();
    });

  document
    .querySelector("#snapshot-reassessment-not-yet")
    ?.addEventListener("click", () => {
      document
        .querySelector(".snapshot-library__list")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    });

  document
    .querySelector("#backup-download")
    ?.addEventListener("click", () => {
      const backup = createBusinessDojoBackup();
      const file = new Blob(
        [JSON.stringify(backup, null, 2)],
        {
          type: "application/json;charset=utf-8"
        }
      );

      const downloadUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = createBackupFilename();

      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);

      backupStatusMessage =
        "Backup downloaded successfully.";
      backupStatusType = "success";
      renderSnapshotLibrary();
    });

  document
    .querySelector("#backup-restore")
    ?.addEventListener("click", async () => {
      const fileInput = document.querySelector(
        "#backup-file"
      );

      const file = fileInput?.files?.[0];

      if (!file) {
        backupStatusMessage =
          "Choose a Business Dojo JSON backup file first.";
        backupStatusType = "error";
        renderSnapshotLibrary();
        return;
      }

      let parsedBackup;

      try {
        parsedBackup = parseBusinessDojoBackup(
          await file.text()
        );
      } catch {
        parsedBackup = {
          isValid: false,
          reason:
            "The selected backup file could not be read.",
          backup: null
        };
      }

      if (!parsedBackup.isValid) {
        backupStatusMessage = parsedBackup.reason;
        backupStatusType = "error";
        renderSnapshotLibrary();
        return;
      }

      const shouldRestore = window.confirm(
        "Restore this backup? This will replace the current application state, saved snapshots, and action plans in this browser."
      );

      if (!shouldRestore) {
        backupStatusMessage =
          "Backup restore cancelled. No data was changed.";
        backupStatusType = "";
        renderSnapshotLibrary();
        return;
      }

      const result = restoreBusinessDojoBackup(
        parsedBackup.backup
      );

      if (!result.isSuccessful) {
        backupStatusMessage = result.reason;
        backupStatusType = "error";
        renderSnapshotLibrary();
        return;
      }

      state = restoreApplicationState();
      selectedSnapshotIds = [];
      snapshotComparisonMessage = "";
      backupStatusMessage =
        "Backup restored successfully.";
      backupStatusType = "success";

      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelectorAll("[data-snapshot-compare-select]")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const snapshotId = checkbox.value;

        if (checkbox.checked) {
          if (
            selectedSnapshotIds.length >= 2 &&
            !selectedSnapshotIds.includes(snapshotId)
          ) {
            checkbox.checked = false;
            snapshotComparisonMessage =
              "Choose only two snapshots at a time.";
            renderSnapshotLibrary();
            return;
          }

          selectedSnapshotIds = [
            ...new Set([...selectedSnapshotIds, snapshotId])
          ];
        } else {
          selectedSnapshotIds = selectedSnapshotIds.filter(
            (id) => id !== snapshotId
          );
        }

        snapshotComparisonMessage = "";
        renderSnapshotLibrary();
      });
    });

  document
    .querySelector("#snapshot-comparison-open")
    ?.addEventListener("click", () => {
      if (selectedSnapshotIds.length !== 2) {
        snapshotComparisonMessage =
          "Select exactly two snapshots to compare.";
        renderSnapshotLibrary();
        return;
      }

      const firstSnapshot = getSnapshotById(
        selectedSnapshotIds[0]
      );

      const secondSnapshot = getSnapshotById(
        selectedSnapshotIds[1]
      );

      const firstActionPlan = getActionPlanBySnapshotId(
        firstSnapshot?.id
      );

      const secondActionPlan = getActionPlanBySnapshotId(
        secondSnapshot?.id
      );

      const businessMemoryRecords =
        loadBusinessMemoryCollection().records;

      const comparison = compareSnapshots(
        firstSnapshot,
        secondSnapshot,
        firstActionPlan,
        secondActionPlan,
        businessMemoryRecords
      );

      if (!comparison.isValid) {
        snapshotComparisonMessage = comparison.reason;
        renderSnapshotLibrary();
        return;
      }

      renderSnapshotComparison(comparison);
      focusMainContent();
    });

  document
    .querySelector("#snapshot-library-back")
    ?.addEventListener("click", () => {
      renderWelcomeView();
      focusMainContent();
    });

  document
    .querySelector("#snapshot-library-new")
    ?.addEventListener("click", () => {
      state = createInitialState();
      persistState();
      renderBusinessProfile({}, "welcome");
      focusMainContent();
    });

  document
    .querySelectorAll("[data-snapshot-open]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const snapshot = getSnapshotById(
          button.dataset.snapshotOpen
        );

        if (!snapshot) {
          return;
        }

        openCompletedSnapshot(snapshot);
      });
    });

  document
    .querySelectorAll("[data-snapshot-edit]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const snapshot = getSnapshotById(
          button.dataset.snapshotEdit
        );

        if (!snapshot) {
          return;
        }

        state = {
          ...createInitialState(),
          metadata: {
            ...createInitialState().metadata,
            appVersion: snapshot.appVersion || "0.2",
            assessmentVersion:
              snapshot.assessmentVersion || "0.1",
            currentSnapshotId: snapshot.id
          },
          navigation: {
            ...createInitialState().navigation,
            currentView: "profile",
            currentStep: 2,
            profileReturnView: "snapshot-library"
          },
          businessProfile: structuredClone(
            snapshot.businessProfile || {}
          ),
          assessment: structuredClone(
            snapshot.assessment || {}
          ),
          results: structuredClone(
            snapshot.results || {}
          ),
          report: structuredClone(
            snapshot.report || {}
          )
        };

        persistState();
        renderBusinessProfile({}, "snapshot-library");
        focusMainContent();
      });
    });

  document
    .querySelectorAll("[data-snapshot-delete]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const snapshot = getSnapshotById(
          button.dataset.snapshotDelete
        );

        if (!snapshot) {
          return;
        }

        const businessName =
          snapshot.business?.name ||
          snapshot.businessProfile?.businessName ||
          "this business";

        const shouldDelete = window.confirm(
          `Delete the saved snapshot for ${businessName}? This cannot be undone.`
        );

        if (!shouldDelete) {
          return;
        }

        deleteActionPlanBySnapshotId(snapshot.id);
        deleteSnapshot(snapshot.id);

        if (state.metadata.currentSnapshotId === snapshot.id) {
          state.metadata.currentSnapshotId = null;
          persistState();
        }

        renderSnapshotLibrary();
        focusMainContent();
      });
    });
}

function openCompletedSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }

  state = {
    ...createInitialState(),
    metadata: {
      ...createInitialState().metadata,
      appVersion: snapshot.appVersion || "0.2",
      assessmentVersion:
        snapshot.assessmentVersion || "0.1",
      currentSnapshotId: snapshot.id
    },
    navigation: {
      ...createInitialState().navigation,
      currentView: "report",
      currentStep: 4
    },
    businessProfile: structuredClone(
      snapshot.businessProfile || {}
    ),
    assessment: structuredClone(
      snapshot.assessment || {}
    ),
    results: structuredClone(
      snapshot.results || {}
    ),
    report: structuredClone(
      snapshot.report || {}
    )
  };

  persistState();
  renderReport();
  focusMainContent();
}

function renderSnapshotComparison(comparison) {
  state.navigation.currentView = "snapshot-comparison";
  state.navigation.currentStep = 1;

  updateStepNavigation(1);
  updateProductNavigation("snapshot-comparison");
  persistState();

  const latestSnapshot = comparison.laterSnapshot;

  const reassessmentPlan = latestSnapshot?.id
    ? getReassessmentPlanBySnapshotId(latestSnapshot.id)
    : null;

  app.innerHTML = renderSnapshotComparisonView(
    comparison,
    reassessmentPlan
  );

  document
    .querySelector("#snapshot-comparison-back")
    ?.addEventListener("click", () => {
      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelector("#comparison-continue-action-plan")
    ?.addEventListener("click", () => {
      openCompletedSnapshot(latestSnapshot);

      document.querySelector("#action-plan")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

  document
    .querySelector("#comparison-view-latest-snapshot")
    ?.addEventListener("click", () => {
      openCompletedSnapshot(latestSnapshot);
    });

  document
    .querySelectorAll("[data-reassessment-interval]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (!latestSnapshot?.id) {
          return;
        }

        const intervalDays = Number(
          button.dataset.reassessmentInterval
        );

        const plan = createReassessmentPlan(
          latestSnapshot,
          intervalDays
        );

        if (!plan || !saveReassessmentPlan(plan)) {
          return;
        }

        renderSnapshotComparison(comparison);

        document
          .querySelector("#comparison-momentum-heading")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });
}

function renderBusinessProfile(errors = {}, returnView = null) {
  if (returnView) {
    state.navigation.profileReturnView = returnView;
  } else if (!state.navigation.profileReturnView) {
    state.navigation.profileReturnView = "welcome";
  }

  state.navigation.currentView = "profile";
  state.navigation.currentStep = 2;

  updateStepNavigation(2);
  updateProductNavigation("profile");
  persistState();

  app.innerHTML = renderProfileView(state.businessProfile, errors);

  const form = document.querySelector("#business-profile-form");
  const backButton = document.querySelector("#profile-back");

  backButton?.addEventListener("click", () => {
    if (state.navigation.profileReturnView === "assessment") {
      renderAssessment();
    } else if (
      state.navigation.profileReturnView === "snapshot-library"
    ) {
      renderSnapshotLibrary();
    } else {
      renderWelcomeView();
    }

    focusMainContent();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const profile = getProfileFromForm(form);
    const validation = validateBusinessProfile(
      profile,
      businessProfileFields
    );

    state.businessProfile = profile;

    if (!validation.isValid) {
      renderBusinessProfile(validation.errors);

      const summary = document.querySelector("#profile-error-summary");

      if (summary) {
        const errorItems = businessProfileFields
          .filter((field) => validation.errors[field.name])
          .map(
            (field) => `
              <li>
                <a href="#${field.id}">
                  ${validation.errors[field.name]}
                </a>
              </li>
            `
          )
          .join("");

        summary.hidden = false;
        summary.innerHTML = `
          <h2>Please complete the required fields</h2>
          <ul>${errorItems}</ul>
        `;
        summary.focus();
      }

      return;
    }

    if (state.metadata.currentSnapshotId) {
      updateSnapshotBusinessProfile(
        state.metadata.currentSnapshotId,
        profile
      );
    }

    persistState();

    if (
      state.navigation.profileReturnView === "snapshot-library"
    ) {
      snapshotComparisonMessage =
        "Business details updated successfully.";
      renderSnapshotLibrary();
      focusMainContent();
      return;
    }

    const hasAssessmentProgress =
      Object.keys(state.assessment.answers).length > 0;

    if (!hasAssessmentProgress) {
      state.navigation.currentQuestionIndex = 0;
    }

    renderAssessment();
    focusMainContent();
  });
}

function updateChecklistDisplay(
  actionPlan,
  recommendationId
) {
  const actionItem = actionPlan?.items?.find(
    (item) => item.recommendationId === recommendationId
  );

  const checklistContainer = document.querySelector(
    `[data-action-checklist="${CSS.escape(
      recommendationId
    )}"]`
  );

  if (!checklistContainer || !actionItem) {
    return;
  }

  checklistContainer.outerHTML = renderActionChecklist(
    actionItem,
    recommendationId
  );
}

function updateActionPlanStatusDisplay(
  actionPlan,
  recommendationId
) {
  const items = Array.isArray(actionPlan?.items)
    ? actionPlan.items
    : [];

  const completed = items.filter(
    (item) => item.status === "complete"
  ).length;

  const inProgress = items.filter(
    (item) => item.status === "in-progress"
  ).length;

  const notStarted = items.filter(
    (item) => item.status === "not-started"
  ).length;

  const percentage =
    items.length > 0
      ? Math.round((completed / items.length) * 100)
      : 0;

  const percentageElement = document.querySelector(
    "[data-action-plan-percentage]"
  );

  if (percentageElement) {
    percentageElement.textContent = `${percentage}%`;
    percentageElement.setAttribute(
      "aria-label",
      `${percentage} percent complete`
    );
  }

  const progressElement = document.querySelector(
    "[data-action-plan-progress]"
  );

  if (progressElement) {
    progressElement.value = percentage;
    progressElement.textContent = `${percentage}%`;
    progressElement.setAttribute(
      "aria-label",
      `Action plan progress: ${percentage} percent`
    );
  }

  const counts = {
    complete: completed,
    "in-progress": inProgress,
    "not-started": notStarted
  };

  Object.entries(counts).forEach(([status, count]) => {
    const countElement = document.querySelector(
      `[data-action-plan-count="${status}"]`
    );

    if (countElement) {
      countElement.textContent = count;
    }
  });

  const updatedItem = items.find(
    (item) => item.recommendationId === recommendationId
  );

  const indexStatus = document.querySelector(
    `[data-action-plan-index-status="${CSS.escape(
      recommendationId
    )}"]`
  );

  if (indexStatus && updatedItem) {
    const labels = {
      "not-started": "Not Started",
      "in-progress": "In Progress",
      complete: "Complete"
    };

    indexStatus.textContent =
      labels[updatedItem.status] || updatedItem.status;
  }
}

function renderReport({ preserveScroll = false } = {}) {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (!preserveScroll) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }

  state.navigation.currentView = "report";
  state.navigation.currentStep = 4;

  updateStepNavigation(4);
  updateProductNavigation("report");
  persistState();

  const actionPlan = getCurrentActionPlan();

  const visibleRecommendations = getVisibleRecommendations(
    state.results.recommendations,
    actionPlan,
    recommendationFilters
  );

  const businessMemoryRecords =
    loadBusinessMemoryCollection().records.filter(
      (record) =>
        record?.source?.snapshotId ===
        state.metadata.currentSnapshotId
    );

  app.innerHTML = renderReportView({
    businessProfile: state.businessProfile,
    results: state.results,
    actionPlan,
    businessMemoryRecords,
    visibleRecommendations,
    recommendationFilters
  });

  document
    .querySelectorAll("[data-recommendation-filter]")
    .forEach((control) => {
      control.addEventListener("change", () => {
        recommendationFilters = {
          ...recommendationFilters,
          [control.dataset.recommendationFilter]: control.value
        };

        renderReport({ preserveScroll: true });
      });
    });

  document
    .querySelector("[data-recommendation-quick-wins]")
    ?.addEventListener("change", (event) => {
      recommendationFilters = {
        ...recommendationFilters,
        quickWinsOnly: event.currentTarget.checked
      };

      renderReport({ preserveScroll: true });
    });

  document
    .querySelector("#recommendation-filters-reset")
    ?.addEventListener("click", () => {
      recommendationFilters = {
        status: "all",
        category: "all",
        priority: "all",
        difficulty: "all",
        quickWinsOnly: false,
        sortBy: "original"
      };

      renderReport({ preserveScroll: true });
    });

  document
    .querySelector("#report-action-plan-jump")
    ?.addEventListener("click", () => {
      document.querySelector("#action-plan")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

  document
    .querySelectorAll("[data-action-plan-item-jump]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const recommendationId =
          button.dataset.actionPlanItemJump;

        document
          .querySelector(
            `#recommendation-${CSS.escape(recommendationId)}`
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      });
    });

  document
    .querySelectorAll("[data-action-status]")
    .forEach((select) => {
      select.addEventListener("change", () => {
        const recommendationId =
          select.dataset.actionStatus;

        const currentPlan = getCurrentActionPlan();

        if (!currentPlan) {
          return;
        }

        const updatedPlan = updateActionItemStatus(
          currentPlan,
          recommendationId,
          select.value
        );

        if (!updatedPlan || !saveActionPlan(updatedPlan)) {
          return;
        }

        updateActionPlanStatusDisplay(
          updatedPlan,
          recommendationId
        );
      });
    });

  document
    .querySelectorAll("[data-action-field]")
    .forEach((field) => {
      field.addEventListener("change", () => {
        const currentPlan = getCurrentActionPlan();

        if (!currentPlan) {
          return;
        }

        const updatedPlan = updateActionItemFields(
          currentPlan,
          field.dataset.recommendationId,
          {
            [field.dataset.actionField]: field.value.trim()
          }
        );

        if (!updatedPlan || !saveActionPlan(updatedPlan)) {
          return;
        }

        field.dataset.savedValue = field.value;
      });
    });

  document
    .querySelectorAll("[data-business-memory-field]")
    .forEach((field) => {
      field.addEventListener("change", () => {
        const recommendationId =
          field.dataset.recommendationId;

        const currentRecord =
          ensureBusinessMemoryForRecommendation(
            recommendationId
          );

        if (!currentRecord) {
          return;
        }

        const fieldName =
          field.dataset.businessMemoryField;

        let updatedRecord = currentRecord;

        if (
          fieldName === "changeSummary" ||
          fieldName === "outcomeStatus" ||
          fieldName === "outcomeSummary"
        ) {
          updatedRecord = updateBusinessMemoryOutcome(
            currentRecord,
            {
              changeSummary:
                fieldName === "changeSummary"
                  ? field.value
                  : currentRecord.change?.summary || "",
              changeDetails:
                currentRecord.change?.details || "",
              outcomeStatus:
                fieldName === "outcomeStatus"
                  ? field.value
                  : currentRecord.outcome?.status ||
                    "not-evaluated",
              outcomeSummary:
                fieldName === "outcomeSummary"
                  ? field.value
                  : currentRecord.outcome?.summary || ""
            }
          );
        }

        if (
          fieldName === "adoptionStatus" ||
          fieldName === "operationalType"
        ) {
          updatedRecord = updateBusinessMemoryAdoption(
            currentRecord,
            {
              adoptionStatus:
                fieldName === "adoptionStatus"
                  ? field.value
                  : currentRecord.adoption?.status ||
                    "tested",
              operationalType:
                fieldName === "operationalType"
                  ? field.value
                  : currentRecord.adoption?.operationalType ||
                    "none"
            }
          );
        }

        if (fieldName === "ownerNotes") {
          updatedRecord = updateBusinessMemoryOwnerNotes(
            currentRecord,
            {
              ownerNotes: field.value
            }
          );
        }

        if (
          fieldName === "isRecurring" ||
          fieldName === "frequency" ||
          fieldName === "trigger" ||
          fieldName === "responsiblePerson" ||
          fieldName === "expectedResult" ||
          fieldName === "currentMethod"
        ) {
          const isRecurring =
            fieldName === "isRecurring"
              ? field.value === "true"
              : Boolean(
                  currentRecord.recurringWork?.isRecurring
                );

          updatedRecord = updateBusinessMemoryRecurringWork(
            currentRecord,
            {
              isRecurring,
              frequency:
                fieldName === "frequency"
                  ? field.value
                  : currentRecord.recurringWork?.frequency || "",
              trigger:
                fieldName === "trigger"
                  ? field.value
                  : currentRecord.recurringWork?.trigger || "",
              responsiblePerson:
                fieldName === "responsiblePerson"
                  ? field.value
                  : currentRecord.recurringWork?.responsiblePerson || "",
              expectedResult:
                fieldName === "expectedResult"
                  ? field.value
                  : currentRecord.recurringWork?.expectedResult || "",
              currentMethod:
                fieldName === "currentMethod"
                  ? field.value
                  : currentRecord.recurringWork?.currentMethod || ""
            }
          );
        }

        const automationFieldMap = {
          automationRepetitive: "repetitive",
          automationRuleBased: "ruleBased",
          automationStableProcess: "stableProcess",
          automationFrequent: "frequent",
          automationTimeConsuming: "timeConsuming",
          automationErrorProne: "errorProne",
          automationRequiresHumanJudgment:
            "requiresHumanJudgment",
          automationRequiresApproval:
            "requiresApproval",
          automationContainsSensitiveInformation:
            "containsSensitiveInformation"
        };

        if (
          fieldName === "automationReadiness" ||
          fieldName === "automationNotes" ||
          Object.hasOwn(automationFieldMap, fieldName)
        ) {
          const considerations = {
            repetitive:
              currentRecord.automation?.considerations
                ?.repetitive || false,
            ruleBased:
              currentRecord.automation?.considerations
                ?.ruleBased || false,
            stableProcess:
              currentRecord.automation?.considerations
                ?.stableProcess || false,
            frequent:
              currentRecord.automation?.considerations
                ?.frequent || false,
            timeConsuming:
              currentRecord.automation?.considerations
                ?.timeConsuming || false,
            errorProne:
              currentRecord.automation?.considerations
                ?.errorProne || false,
            requiresHumanJudgment:
              currentRecord.automation?.considerations
                ?.requiresHumanJudgment || false,
            requiresApproval:
              currentRecord.automation?.considerations
                ?.requiresApproval || false,
            containsSensitiveInformation:
              currentRecord.automation?.considerations
                ?.containsSensitiveInformation || false
          };

          if (Object.hasOwn(automationFieldMap, fieldName)) {
            considerations[
              automationFieldMap[fieldName]
            ] = field.checked;
          }

          updatedRecord =
            updateBusinessMemoryAutomation(
              currentRecord,
              {
                readiness:
                  fieldName === "automationReadiness"
                    ? field.value
                    : currentRecord.automation?.readiness ||
                      "not-reviewed",
                considerations,
                notes:
                  fieldName === "automationNotes"
                    ? field.value
                    : currentRecord.automation?.notes || ""
              }
            );
        }

        if (
          !updatedRecord ||
          !saveBusinessMemoryRecord(updatedRecord)
        ) {
          return;
        }

        if (
          fieldName === "automationReadiness" ||
          fieldName === "automationNotes" ||
          Object.hasOwn(automationFieldMap, fieldName)
        ) {
          const explanation = field
            .closest(".recommendation-card")
            ?.querySelector(
              ".recommendation-card__automation-explanation p:last-child"
            );

          if (explanation) {
            explanation.textContent =
              explainBusinessMemoryAutomation(
                updatedRecord.automation
              );
          }
        }

        field.dataset.savedValue = field.value;
      });
    });

  if (app.dataset.checklistEventsBound !== "true") {
    app.addEventListener("change", (event) => {
      const completionControl = event.target.closest(
        "[data-checklist-completion]"
      );

      if (completionControl) {
        const currentPlan = getCurrentActionPlan();

        if (!currentPlan) {
          return;
        }

        const recommendationId =
          completionControl.dataset.recommendationId;

        const updatedPlan = updateChecklistItemCompletion(
          currentPlan,
          recommendationId,
          completionControl.dataset.checklistItemId,
          completionControl.checked
        );

        if (!updatedPlan || !saveActionPlan(updatedPlan)) {
          return;
        }

        updateChecklistDisplay(updatedPlan, recommendationId);
        return;
      }

      const textControl = event.target.closest(
        "[data-checklist-text]"
      );

      if (textControl) {
        const currentPlan = getCurrentActionPlan();

        if (!currentPlan) {
          return;
        }

        const recommendationId =
          textControl.dataset.recommendationId;

        const updatedPlan = updateChecklistItemText(
          currentPlan,
          recommendationId,
          textControl.dataset.checklistItemId,
          textControl.value
        );

        if (!updatedPlan || !saveActionPlan(updatedPlan)) {
          return;
        }

        updateChecklistDisplay(updatedPlan, recommendationId);
      }
    });

    app.addEventListener("click", (event) => {
      const removeButton = event.target.closest(
        "[data-checklist-remove]"
      );

      if (!removeButton) {
        return;
      }

      const currentPlan = getCurrentActionPlan();

      if (!currentPlan) {
        return;
      }

      const recommendationId =
        removeButton.dataset.recommendationId;

      const updatedPlan = deleteChecklistItem(
        currentPlan,
        recommendationId,
        removeButton.dataset.checklistItemId
      );

      if (!updatedPlan || !saveActionPlan(updatedPlan)) {
        return;
      }

      updateChecklistDisplay(updatedPlan, recommendationId);
    });

    app.addEventListener("submit", (event) => {
      const checklistForm = event.target.closest(
        "[data-checklist-add-form]"
      );

      if (!checklistForm) {
        return;
      }

      event.preventDefault();

      const input = checklistForm.querySelector(
        "[data-checklist-add-input]"
      );

      const currentPlan = getCurrentActionPlan();

      if (!input || !currentPlan) {
        return;
      }

      const recommendationId =
        checklistForm.dataset.checklistAddForm;

      const updatedPlan = addChecklistItem(
        currentPlan,
        recommendationId,
        input.value
      );

      if (!updatedPlan || !saveActionPlan(updatedPlan)) {
        input.focus();
        return;
      }

      updateChecklistDisplay(updatedPlan, recommendationId);

      document
        .querySelector(
          `[data-checklist-add-form="${CSS.escape(
            recommendationId
          )}"] [data-checklist-add-input]`
        )
        ?.focus();
    });

    app.dataset.checklistEventsBound = "true";
  }

  const reportText = generateReportText({
    businessProfile: state.businessProfile,
    results: state.results,
    businessMemoryRecords
  });

  const exportStatus = document.querySelector(
    "#report-export-status"
  );

  function setExportStatus(message) {
    if (exportStatus) {
      exportStatus.textContent = message;
    }
  }

  document
    .querySelector("#report-copy")
    ?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(reportText);
        setExportStatus("Report copied to your clipboard.");
      } catch (error) {
        console.error("Unable to copy report:", error);
        setExportStatus(
          "The report could not be copied. Try downloading it instead."
        );
      }
    });

  document
    .querySelector("#report-download")
    ?.addEventListener("click", () => {
      const file = new Blob([reportText], {
        type: "text/plain;charset=utf-8"
      });

      const downloadUrl = URL.createObjectURL(file);
      const downloadLink = document.createElement("a");

      downloadLink.href = downloadUrl;
      downloadLink.download = createReportFilename(
        state.businessProfile.businessName
      );

      document.body.append(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(downloadUrl);
      setExportStatus("Text report downloaded.");
    });

  document
    .querySelector("#report-print")
    ?.addEventListener("click", () => {
      setExportStatus("Opening your browser print options.");
      window.print();
    });

  const snapshotNavigation =
    document.querySelector(".snapshot-app-navigation");

  const snapshotNavigationToggle =
    document.querySelector("#snapshot-navigation-toggle");

  snapshotNavigationToggle?.addEventListener("click", () => {
    const isCollapsed =
      snapshotNavigation?.classList.toggle(
        "snapshot-app-navigation--collapsed"
      ) ?? false;

    snapshotNavigationToggle.setAttribute(
      "aria-expanded",
      String(!isCollapsed)
    );

    snapshotNavigationToggle.setAttribute(
      "aria-label",
      isCollapsed
        ? "Show snapshot navigation"
        : "Minimize snapshot navigation"
    );

    const label =
      snapshotNavigationToggle.querySelector("span");

    if (label) {
      label.textContent = isCollapsed
        ? "Show navigation"
        : "Minimize navigation";
    }
  });

  document
    .querySelector("#snapshot-app-library")
    ?.addEventListener("click", () => {
      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelector("#report-back")
    ?.addEventListener("click", () => {
      state.navigation.currentQuestionIndex =
        businessAssessmentQuestions.length - 1;

      renderAssessment();
      focusMainContent();
    });

  document
    .querySelector("#report-snapshot-library")
    ?.addEventListener("click", () => {
      renderSnapshotLibrary();
      focusMainContent();
    });

  document
    .querySelector("#report-new-assessment")
    ?.addEventListener("click", () => {
      const shouldReset = window.confirm(
        "Start a new assessment? This will erase the current profile, answers, and report from this browser."
      );

      if (!shouldReset) {
        return;
      }

      clearState();
      state = createInitialState();
      renderWelcomeView();
      focusMainContent();
    });
}

function renderAssessment(errorMessage = "") {
  state.navigation.currentView = "assessment";
  state.navigation.currentStep = 3;

  updateStepNavigation(3);
  updateProductNavigation("assessment");
  persistState();

  const questionIndex = state.navigation.currentQuestionIndex ?? 0;
  const question = getQuestionByIndex(
    businessAssessmentQuestions,
    questionIndex
  );

  const savedAnswer = question
    ? state.assessment.answers[question.id]
    : null;

  app.innerHTML = renderAssessmentView({
    question,
    questionIndex,
    questionCount: businessAssessmentQuestions.length,
    selectedOptionId: savedAnswer?.optionId ?? "",
    completedQuestionCount: state.assessment.completedQuestionIds.length,
    completionPercentage: state.assessment.completionPercentage,
    errorMessage
  });

  const form = document.querySelector("#assessment-form");
  const backButton = document.querySelector("#assessment-back");
  const profileButton = document.querySelector("#assessment-profile");

  profileButton?.addEventListener("click", () => {
    renderBusinessProfile({}, "assessment");
    focusMainContent();
  });

  backButton?.addEventListener("click", () => {
    if (questionIndex === 0) {
      renderBusinessProfile({}, "welcome");
    } else {
      state.navigation.currentQuestionIndex = questionIndex - 1;
      renderAssessment();
    }

    focusMainContent();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!question) {
      return;
    }

    const selectedOption = form.querySelector(
      `input[name="${question.id}"]:checked`
    );

    if (!selectedOption) {
      renderAssessment("Choose the answer that best describes your business.");

      document
        .querySelector("#assessment-error")
        ?.scrollIntoView({ block: "center" });

      return;
    }

    state.assessment = updateAssessmentState(
      state.assessment,
      businessAssessmentQuestions,
      question.id,
      selectedOption.value
    );

    const isLastQuestion =
      questionIndex === businessAssessmentQuestions.length - 1;

    if (isLastQuestion) {
      const firstUnansweredQuestionIndex =
        businessAssessmentQuestions.findIndex(
          (assessmentQuestion) =>
            !state.assessment.answers[assessmentQuestion.id]
        );

      if (firstUnansweredQuestionIndex !== -1) {
        state.navigation.currentQuestionIndex =
          firstUnansweredQuestionIndex;

        renderAssessment(
          "Complete this unanswered question before generating your report."
        );

        document
          .querySelector("#assessment-error")
          ?.scrollIntoView({ block: "center" });

        focusMainContent();
        return;
      }

      const scores = calculateAssessmentScores(
        businessAssessmentQuestions,
        state.assessment.answers
      );

      if (!Number.isFinite(scores.overallScore)) {
        renderAssessment(
          "Your report needs at least one answer other than Not applicable. Review the assessment and update any questions that apply to your business."
        );

        document
          .querySelector("#assessment-error")
          ?.scrollIntoView({ block: "center" });

        focusMainContent();
        return;
      }

      const recommendations = generateRecommendations(
        businessAssessmentQuestions,
        state.assessment.answers,
        6,
        state.businessProfile.currentPriority
      );

      const strengths = generateStrengths(
        businessAssessmentQuestions,
        state.assessment.answers
      );

      state.results = {
        ...state.results,
        overallScore: scores.overallScore,
        categoryScores: scores.categoryScores,
        earnedPoints: scores.earnedPoints,
        possiblePoints: scores.possiblePoints,
        scoredQuestionCount: scores.scoredQuestionCount,
        strengths,
        recommendations
      };

      saveCompletedSnapshot();
      renderReport();
      focusMainContent();
      return;
    }

    state.navigation.currentQuestionIndex = questionIndex + 1;
    renderAssessment();
    focusMainContent();
  });
}

function renderSavedView() {
  switch (state.navigation.currentView) {
    case "snapshot-library":
      renderSnapshotLibrary();
      break;

    case "business-memory":
      renderBusinessMemory();
      break;

    case "profile":
      renderBusinessProfile();
      break;

    case "assessment": {
      const questionCount = businessAssessmentQuestions.length;
      const savedIndex = Number(state.navigation.currentQuestionIndex);

      state.navigation.currentQuestionIndex =
        Number.isInteger(savedIndex) &&
        savedIndex >= 0 &&
        savedIndex < questionCount
          ? savedIndex
          : 0;

      renderAssessment();
      break;
    }

    case "report":
      if (Number.isFinite(state.results.overallScore)) {
        renderReport();
      } else {
        renderAssessment();
      }
      break;

    default:
      renderWelcomeView();
  }
}

renderSavedView();
