import { businessProfileFields } from "../data/business-profile.js";
import { businessAssessmentQuestions } from "../data/business-assessment.js";
import { createInitialState } from "./core/state.js";
import { validateBusinessProfile } from "./core/validation.js";
import {
  getQuestionByIndex,
  updateAssessmentState
} from "./engines/assessment-engine.js";
import { calculateAssessmentScores } from "./engines/scoring-engine.js";
import { renderProfileView } from "./views/profile-view.js";
import { renderAssessmentView } from "./views/assessment-view.js";
import { renderReportView } from "./views/report-view.js";

const app = document.querySelector("#app");
const stepItems = document.querySelectorAll(".step-navigation__item");

let state = createInitialState();

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

function focusMainContent() {
  document.querySelector("#main-content")?.focus();
}

function renderWelcomeView() {
  state.navigation.currentView = "welcome";
  state.navigation.currentStep = 1;

  updateStepNavigation(1);

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
          Version 0.1 stores assessment progress locally on this device.
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
      </div>
    </div>
  `;

  document
    .querySelector("#begin-assessment")
    ?.addEventListener("click", () => {
      renderBusinessProfile();
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

function renderBusinessProfile(errors = {}) {
  state.navigation.currentView = "profile";
  state.navigation.currentStep = 2;

  updateStepNavigation(2);

  app.innerHTML = renderProfileView(state.businessProfile, errors);

  const form = document.querySelector("#business-profile-form");
  const backButton = document.querySelector("#profile-back");

  backButton?.addEventListener("click", () => {
    renderWelcomeView();
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
        const errorItems = Object.values(validation.errors)
          .map((message) => `<li>${message}</li>`)
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

    state.navigation.currentQuestionIndex = 0;
    renderAssessment();
    focusMainContent();
  });
}

function renderReport() {
  state.navigation.currentView = "report";
  state.navigation.currentStep = 4;

  updateStepNavigation(4);

  app.innerHTML = renderReportView({
    businessProfile: state.businessProfile,
    results: state.results
  });

  document
    .querySelector("#report-back")
    ?.addEventListener("click", () => {
      state.navigation.currentQuestionIndex =
        businessAssessmentQuestions.length - 1;

      renderAssessment();
      focusMainContent();
    });
}

function renderAssessment(errorMessage = "") {
  state.navigation.currentView = "assessment";
  state.navigation.currentStep = 3;

  updateStepNavigation(3);

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
    completionPercentage: state.assessment.completionPercentage,
    errorMessage
  });

  const form = document.querySelector("#assessment-form");
  const backButton = document.querySelector("#assessment-back");

  backButton?.addEventListener("click", () => {
    if (questionIndex === 0) {
      renderBusinessProfile();
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
      const scores = calculateAssessmentScores(
        businessAssessmentQuestions,
        state.assessment.answers
      );

      state.results = {
        ...state.results,
        overallScore: scores.overallScore,
        categoryScores: scores.categoryScores,
        earnedPoints: scores.earnedPoints,
        possiblePoints: scores.possiblePoints,
        scoredQuestionCount: scores.scoredQuestionCount
      };

      renderReport();
      focusMainContent();
      return;
    }

    state.navigation.currentQuestionIndex = questionIndex + 1;
    renderAssessment();
    focusMainContent();
  });
}

renderWelcomeView();
