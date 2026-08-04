const beginButton = document.querySelector("#begin-assessment");

function handleBeginAssessment() {
  window.alert("Business Profile development begins next.");
}

if (beginButton) {
  beginButton.addEventListener("click", handleBeginAssessment);
}
