import { businessProfileFields } from "../data/business-profile.js";
import { createInitialState } from "./core/state.js";
import { validateBusinessProfile } from "./core/validation.js";
import { renderProfileView } from "./views/profile-view.js";

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

function renderWelcomeView() {
  state.navigation.currentView = "welcome";
  state.navigation.currentStep = 1;
  updateStepNavigation(1);

  app.innerHTML = `
    <div class="welcome-panel">
      <p class="eyebrow">Business Snapshot</p>

      <h1>Understand your business. Strengthen your systems.</h1>

      <p class="welcome-panel__intro">
        Complete a guided assessment and receive a practical report showing what is working, where opportunities exist, and what to do next.
      </p>

      <div class="information-box">
        <h2>What you will receive</h2>
        <p>
          Your Business Snapshot Report will include category scores, business strengths, priority opportunities, implementation difficulty, expected impact, and clear first actions.
        </p>
      </div>

      <div class="privacy-notice">
        <h2>Your information stays in this browser</h2>
        <p>
          Version 0.1 stores assessment progress locally on this device. Nothing is uploaded or transmitted.
        </p>
      </div>

      <div class="action-bar">
        <button class="button button--primary" type="button" id="begin-assessment">
          Begin Business Snapshot
        </button>
      </div>
    </div>
  `;

  document
    .querySelector("#begin-assessment")
    ?.addEventListener("click", renderBusinessProfile);
}

function getProfileFromForm(form) {
  const formData = new FormData(form);
  const profile = {};

  for (const field of businessProfileFields) {
    profile[field.name] = String(formData.get(field.name) ?? "").trim();
  }

  return profile;
}

function renderBusinessProfile(errors = {}) {
  state.navigation.currentView = "profile";
  state.navigation.currentStep = 2;
  updateStepNavigation(2);

  app.innerHTML = renderProfileView(state.businessProfile, errors);

  const form = document.querySelector("#business-profile-form");
  const backButton = document.querySelector("#profile-back");

  backButton?.addEventListener("click", renderWelcomeView);

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

    window.alert("Business Profile complete. Assessment development begins next.");
  });
}

renderWelcomeView();
