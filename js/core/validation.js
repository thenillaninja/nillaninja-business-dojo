export function validateRequiredValue(value) {
  if (typeof value !== "string") {
    return false;
  }

  return value.trim().length > 0;
}

export function validateBusinessProfile(profile, fields) {
  const errors = {};

  for (const field of fields) {
    if (!field.required) {
      continue;
    }

    const value = profile[field.name];

    if (!validateRequiredValue(value)) {
      errors[field.name] = `${field.label} is required.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
