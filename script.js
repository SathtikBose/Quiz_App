const questions = [
  {
    text: "Which of the following correctly describes a function prototype in C?",
    options: [
      "The actual code block of the function",
      "A declaration that tells the compiler about the function's name and parameters",
      "The statement used to call a function",
      "A built-in library function",
    ],
    correctIndex: 1,
    level: 1,
  },
  {
    text: "What is the default return type of a function in C if not explicitly specified?",
    options: ["void", "float", "int", "char"],
    correctIndex: 2,
    level: 2,
  },
  {
    text: "In Call by Value, what happens to the original variable in the main function when the parameter is modified inside the function?",
    options: [
      "The original variable is updated",
      "A syntax error occurs",
      "The original variable remains unchanged",
      "The program crashes",
    ],
    correctIndex: 2,
    level: 2,
  },
  {
    text: "Which symbol is used to pass the address of a variable to a function in Call by Reference?",
    options: ["*", "&", "!", "#"],
    correctIndex: 1,
    level: 2,
  },
  {
    text: "What is 'Recursion' in C programming?",
    options: [
      "A loop that never ends",
      "A function calling another function",
      "A function calling itself",
      "The process of deleting a function",
    ],
    correctIndex: 2,
    level: 1,
  },
  {
    text: "What is the 'Base Case' in a recursive function?",
    options: [
      "The first line of the function",
      "The condition that stops the recursion",
      "The formula used to calculate the result",
      "The part where the function calls itself",
    ],
    correctIndex: 1,
    level: 2,
  },
  {
    text: "What happens if a recursive function does not have a base case?",
    options: [
      "It runs once and stops",
      "It results in a Stack Overflow (Infinite Recursion)",
      "It produces a logical error",
      "The compiler flags it as a syntax error",
    ],
    correctIndex: 1,
    level: 3,
  },
  {
    text: "What is the value of 5! (5 factorial) calculated by a recursive factorial function?",
    options: ["24", "100", "120", "720"],
    correctIndex: 2,
    level: 2,
  },
  {
    text: "In the Fibonacci sequence (0, 1, 1, 2, 3, 5...), what is the formula for the n-th term?",
    options: [
      "fib(n) = fib(n-1) + fib(n-2)",
      "fib(n) = fib(n-1) * fib(n-2)",
      "fib(n) = fib(n) + fib(n-1)",
      "fib(n) = n * fib(n-1)",
    ],
    correctIndex: 0,
    level: 3,
  },
  {
    text: "How many values can a C function return at a time using the 'return' keyword?",
    options: [
      "Multiple values",
      "Exactly two",
      "Only one",
      "As many as parameters",
    ],
    correctIndex: 2,
    level: 1,
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
