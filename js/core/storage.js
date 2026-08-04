const STORAGE_KEY = "nillaninja-business-dojo-v0.1-state";

export function saveState(state) {
  try {
    const stateToSave = {
      ...state,
      metadata: {
        ...state.metadata,
        lastSavedAt: new Date().toISOString()
      }
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(stateToSave)
    );

    return true;
  } catch (error) {
    console.error("Unable to save application state.", error);
    return false;
  }
}

export function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return null;
    }

    const parsedState = JSON.parse(savedState);

    if (!parsedState || typeof parsedState !== "object") {
      return null;
    }

    return parsedState;
  } catch (error) {
    console.error("Unable to restore application state.", error);
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Unable to clear application state.", error);
    return false;
  }
}

export { STORAGE_KEY };
