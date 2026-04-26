let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let answered = false;

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
    updateStats();
  });

// 🔧 NORMALIZE (wichtig!)
function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

function loadQuestion() {
  answered = false;

  const q = questions[current];

  document.getElementById("questionBox").innerText = q.question;
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("textInput").value = "";
}

// 🧠 TEXT-ANTWORT CHECK
function checkTextAnswer(q) {

  const input = document.getElementById("textInput");
  const userAnswer = normalize(input.value);

  if (!userAnswer) {
    document.getElementById("feedback").innerHTML =
      "⚠ Bitte eine Antwort eingeben.";
    return;
  }

  answered = true;

  const correctAnswers = q.answers.map(a => normalize(a));

  if (correctAnswers.includes(userAnswer)) {
    correct++;
    showFeedback(true, q.explanation);
  } else {
    wrong++;
    showFeedback(false,
      q.explanation +
      "<br><br>✔ Mögliche Lösungen: " + q.answers.join(", ")
    );
  }

  updateStats();
}

function showFeedback(ok, explanation) {
  document.getElementById("feedback").innerHTML =
    (ok ? "✔ Richtig! " : "❌ Falsch! ") + explanation;
}

// ▶ BUTTON LOGIK
document.getElementById("continueBtn").onclick = () => {

  const q = questions[current];

  if (!answered) {
    checkTextAnswer(q);
    return;
  }

  current++;

  if (current >= questions.length) {
    showResult();
    return;
  }

  loadQuestion();
  updateStats();
};

function updateStats() {
  document.getElementById("progressText").innerText =
    `Frage ${current + 1} / ${questions.length}`;

  document.getElementById("scoreText").innerText =
    `✔ ${correct} | ❌ ${wrong}`;

  document.getElementById("progressFill").style.width =
    ((current + 1) / questions.length) * 100 + "%";
}

function showResult() {

  const percent = (correct / questions.length) * 100;

  let grade;

  if (percent >= 92) grade = 1;
  else if (percent >= 81) grade = 2;
  else if (percent >= 67) grade = 3;
  else if (percent >= 50) grade = 4;
  else if (percent >= 30) grade = 5;
  else grade = 6;

  document.getElementById("quizBox").innerHTML = `
    <h2>Quiz beendet</h2>
    <p>Richtige Antworten: ${correct}</p>
    <p>Falsche Antworten: ${wrong}</p>
    <p>Ergebnis: ${percent.toFixed(1)}%</p>
    <h3>Note: ${grade}</h3>
  `;
}