import { businessProfileFields } from "../../data/business-profile.js";

function renderOptions(options, currentValue) {
  return options
    .map((option) => {
      const selected = option.value === currentValue ? " selected" : "";

      return `<option value="${option.value}"${selected}>${option.label}</option>`;
    })
    .join("");
}

function renderField(field, value = "", error = "") {
  const describedBy = [
    field.helpText ? `${field.id}-help` : "",
    error ? `${field.id}-error` : ""
  ]
    .filter(Boolean)
    .join(" ");

  let control = "";

  if (field.type === "select") {
    control = `
      <select
        id="${field.id}"
        name="${field.name}"
        ${field.required ? "required" : ""}
        ${describedBy ? `aria-describedby="${describedBy}"` : ""}
        ${error ? 'aria-invalid="true"' : ""}
      >
        ${renderOptions(field.options, value)}
      </select>
    `;
  } else if (field.type === "textarea") {
    control = `
      <textarea
        id="${field.id}"
        name="${field.name}"
        rows="4"
        placeholder="${field.placeholder ?? ""}"
        ${field.required ? "required" : ""}
        ${describedBy ? `aria-describedby="${describedBy}"` : ""}
        ${error ? 'aria-invalid="true"' : ""}
      >${value}</textarea>
    `;
  } else {
    control = `
      <input
        id="${field.id}"
        name="${field.name}"
        type="${field.type}"
        value="${value}"
        placeholder="${field.placeholder ?? ""}"
        ${field.autocomplete ? `autocomplete="${field.autocomplete}"` : ""}
        ${field.required ? "required" : ""}
        ${describedBy ? `aria-describedby="${describedBy}"` : ""}
        ${error ? 'aria-invalid="true"' : ""}
      >
    `;
  }

  return `
    <div class="form-field">
      <label for="${field.id}">
        ${field.label}
        ${field.required ? '<span aria-hidden="true">*</span>' : ""}
      </label>

      ${field.helpText ? `<p class="field-help" id="${field.id}-help">${field.helpText}</p>` : ""}

      ${control}

      ${error ? `<p class="field-error" id="${field.id}-error">${error}</p>` : ""}
    </div>
  `;
}

export function renderProfileView(profile, errors = {}) {
  const fieldsMarkup = businessProfileFields
    .map((field) => renderField(field, profile[field.name], errors[field.name]))
    .join("");

  return `
    <section class="profile-panel" aria-labelledby="profile-heading">
      <p class="eyebrow">Step 2 of 5</p>

      <h1 id="profile-heading">Tell us about your business</h1>

      <p class="profile-panel__intro">
        This information gives the Business Snapshot context so the final report can be more useful and relevant.
      </p>

      <p class="required-note">
        Fields marked with an asterisk are required.
      </p>

      <form id="business-profile-form" novalidate>
        <div id="profile-error-summary" class="error-summary" hidden tabindex="-1"></div>

        <div class="form-grid">
          ${fieldsMarkup}
        </div>

        <div class="action-bar">
          <button class="button button--secondary" type="button" id="profile-back">
            Back
          </button>

          <button class="button button--primary" type="submit">
            Continue to Assessment
          </button>
        </div>
      </form>
    </section>
  `;
}
