const questions = [
  {
    text: "Which of the following is a valid variable name in C?",
    options: ["2nd_number", "final price", "_totalAmount", "item-cost"],
    correctIndex: 2,
    level: 1,
  },
  {
    text: "What is the result of the integer division 2 / 3 in C?",
    options: ["0.666", "1", "0", "Error"],
    correctIndex: 2,
    level: 2,
  },
  {
    text: "What is the result of the modulo operation -8 % 3 in C?",
    options: ["2", "-2", "0", "-1"],
    correctIndex: 1,
    level: 3,
  },
  {
    text: "What is the output of the expression `!100` in C?",
    options: ["100", "-100", "1", "0"],
    correctIndex: 3,
    level: 2,
  },
  {
    text: "In the condition `if (x = 1)`, if x was initially 2, what is the result?",
    options: [
      "False (2 is not 1)",
      "True (Assignment results in 1)",
      "Syntax Error",
      "Program Crash",
    ],
    correctIndex: 1,
    level: 3,
  },
  {
    text: "Which operator is the only one in C that takes three operands?",
    options: [
      "Logical AND (&&)",
      "Relational (>=)",
      "Ternary (? :)",
      "Modulo (%)",
    ],
    correctIndex: 2,
    level: 1,
  },
  {
    text: "How many iterations occur in the loop `for(int i=0; i<=10; i++)`?",
    options: ["10", "11", "9", "Infinite"],
    correctIndex: 1,
    level: 1,
  },
  {
    text: "What is a guaranteed characteristic of a `do-while` loop?",
    options: [
      "It checks the condition first",
      "It only runs if the condition is true",
      "It runs at least once",
      "It is faster than a for loop",
    ],
    correctIndex: 2,
    level: 2,
  },
  {
    text: "What does the `continue` keyword do inside a loop?",
    options: [
      "Exits the loop entirely",
      "Skips the rest of the current iteration",
      "Restarts the program",
      "Skips to the code after the loop",
    ],
    correctIndex: 1,
    level: 1,
  },
  {
    text: "Which operator type is evaluated AFTER arithmetic operators but BEFORE logical operators?",
    options: [
      "Relational operators",
      "Assignment operators",
      "Logical NOT",
      "Increment operators",
    ],
    correctIndex: 0,
    level: 3,
  },
];

let currentIndex = 0;
const userAnswers = Array(questions.length).fill(-1);
let timerStarted = false,
  startTime = 0,
  elapsedMs = 0,
  timerInterval = null;

function renderQuestion() {
  const q = questions[currentIndex];
  document.getElementById("question-text").textContent = q.text;
  document.getElementById("q-counter").textContent = `Question ${
    currentIndex + 1
  } of ${questions.length}`;
  document.getElementById("level-text").textContent = `Level: ${q.level}`;
  document.getElementById("progress-fill").style.width = `${
    ((currentIndex + 1) / questions.length) * 100
  }%`;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const label = document.createElement("label");
    label.className = "option";
    label.innerHTML = `<input type="radio" name="opt" value="${idx}" ${
      userAnswers[currentIndex] === idx ? "checked" : ""
    }> <span>${opt}</span>`;
    label.onclick = () => {
      if (!timerStarted) {
        timerStarted = true;
        startTime = Date.now();
        startTimer();
      }
      userAnswers[currentIndex] = idx;
      document.getElementById("attempt-info").textContent = "Answered";
    };
    optionsContainer.appendChild(label);
  });
  document.getElementById("prev-btn").disabled = currentIndex === 0;
  document.getElementById("next-btn").textContent =
    currentIndex === questions.length - 1 ? "Finish" : "Next";
}

function startTimer() {
  timerInterval = setInterval(() => {
    elapsedMs = Date.now() - startTime;
    const totalSecs = Math.floor(elapsedMs / 1000);
    const m = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSecs % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `Time: ${m}:${s}`;
  }, 1000);
}

document.getElementById("next-btn").onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};
document.getElementById("prev-btn").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

document.getElementById("submit-btn").onclick = () => {
  if (userAnswers.includes(-1)) {
    alert("Please answer all questions before submitting!");
    return;
  }
  clearInterval(timerInterval);
  showResults();
};

function showResults() {
  let correctCount = 0;
  const reviewContainer = document.getElementById("review-container");
  reviewContainer.innerHTML = "";

  questions.forEach((q, i) => {
    const isCorrect = userAnswers[i] === q.correctIndex;
    if (isCorrect) correctCount++;

    const item = document.createElement("div");
    item.className = "review-item";
    item.style.borderLeft = isCorrect
      ? "4px solid #22c55e"
      : "4px solid #f97373";

    item.innerHTML = `
      <div class="review-q">${i + 1}. ${q.text}</div>
      <div class="review-ans">
        <span class="${isCorrect ? "correct" : "incorrect"}">
          ${isCorrect ? "✅" : "❌"} Your choice: ${q.options[userAnswers[i]]}
        </span>
        ${
          !isCorrect
            ? `<br><span class="correct">✔️ Correct: ${
                q.options[q.correctIndex]
              }</span>`
            : ""
        }
      </div>
    `;
    reviewContainer.appendChild(item);
  });

  document.getElementById("res-total").textContent = questions.length;
  document.getElementById("res-correct").textContent = correctCount;
  document.getElementById("res-incorrect").textContent =
    questions.length - correctCount;
  document.getElementById("res-percent").textContent = `${Math.round(
    (correctCount / questions.length) * 100,
  )}%`;
  document.getElementById("res-time").textContent = document
    .getElementById("timer")
    .textContent.replace("Time: ", "");

  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
}

renderQuestion();
