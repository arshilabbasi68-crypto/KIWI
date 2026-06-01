let input = document.querySelector('#username');

let getstartedbtn = document.querySelector('#getstarted');

let errorMessage = document.querySelector('#error-message');

let firstVisitPage = document.querySelector('#firstvisitpage');

let mainSection = document.querySelector('#main-section');

let displayName = document.querySelector('#display-name');


getstartedbtn.addEventListener('click', function() {
    let name = input.value.trim();
    if (name ===''){
        errorMessage.style.display ="block"; 
    }
    else {
        errorMessage.style.display = "none";
        localStorage.setItem('username', name);
        displayName.textContent = name;
        firstVisitPage.style.display = "none";
        mainSection.style.display = "block";
    }
});



// ===== GRAB ALL ELEMENTS =====
// const firstVisitPage = document.querySelector("#firstvisitpage");
// const mainSection = document.querySelector("#main-section");
const usernameInput = document.querySelector("#username");
const getStartedBtn = document.querySelector("#getstarted");
// const errorMessage = document.querySelector("#error-message");
// const displayName = document.querySelector("#display-name");

const liveClock = document.querySelector("#live-clock");
const liveDate = document.querySelector("#live-date");
const calendarEl = document.querySelector("#calendar");
const dailyQuote = document.querySelector("#daily-quote");
const streakCount = document.querySelector("#streak-count");
const progressBar = document.querySelector("#progress-bar");
const progressText = document.querySelector("#progress-text");

const habitInput = document.querySelector("#habit-input");
const categorySelect = document.querySelector("#category-select");
const addHabitBtn = document.querySelector("#add-habit-btn");
const habitError = document.querySelector("#habit-error");
const habitList = document.querySelector("#habit-list");

const taskInput = document.querySelector("#task-input");
const prioritySelect = document.querySelector("#priority-select");
const addTaskBtn = document.querySelector("#add-task-btn");
const taskError = document.querySelector("#task-error");
const taskList = document.querySelector("#task-list");


// ===== ON PAGE LOAD =====
window.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem("user_name");

    if (savedName) {
        // user visited before — skip modal
        displayName.textContent = savedName;
        firstVisitPage.style.display = "none";
        mainSection.style.display = "block";
        initApp();
    } else {
        // first visit — show modal
        mainSection.style.display = "none";
    }
});


// ===== MODAL — GET STARTED BUTTON =====
getStartedBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();

    if (name === "") {
        errorMessage.style.display = "block";
        return;
    }

    errorMessage.style.display = "none";
    localStorage.setItem("user_name", name);
    displayName.textContent = name;

    firstVisitPage.style.display = "none";
    mainSection.style.display = "block";
    initApp();
});


// ===== INIT APP — runs everything =====
function initApp() {
    startClock();
    buildCalendar();
    loadQuote();
    loadHabits();
    loadTasks();
    checkDailyReset();
    updateProgress();
}


// ===== 1. CLOCK =====
function startClock() {
    // run immediately so no delay on load
    updateClock();
    // then update every second
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now = new Date();

    // IST time format
    const timeOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    };

    const dateOptions = {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    liveClock.textContent = now.toLocaleTimeString("en-IN", timeOptions);
    liveDate.textContent = now.toLocaleDateString("en-IN", dateOptions);
}


// ===== 2. CALENDAR =====
function buildCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    // month name
    const monthName = now.toLocaleString("en-IN", { month: "long", year: "numeric" });

    // first day of month (0=Sun, 1=Mon...)
    const firstDay = new Date(year, month, 1).getDay();
    // total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();

    let html = `<div class="calendar-header">${monthName}</div>`;
    html += `<div class="calendar-grid">`;

    // day names
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    dayNames.forEach(d => {
        html += `<span class="day-name">${d}</span>`;
    });

    // empty spaces before first day
    for (let i = 0; i < firstDay; i++) {
        html += `<span></span>`;
    }

    // day numbers
    for (let d = 1; d <= totalDays; d++) {
        if (d === today) {
            html += `<span class="today">${d}</span>`;
        } else {
            html += `<span>${d}</span>`;
        }
    }

    html += `</div>`;
    calendarEl.innerHTML = html;
}


// ===== 3. DAILY QUOTE =====
const quotes = [
    "Small steps every day lead to big changes.",
    "Discipline is choosing between what you want now and what you want most.",
    "You don't have to be extreme, just consistent.",
    "Success is the sum of small efforts repeated daily.",
    "Build habits, not excuses.",
    "Every day is a chance to be better than yesterday.",
    "The secret of your future is hidden in your daily routine.",
    "Work hard in silence, let success make the noise.",
    "Push yourself because no one else is going to do it for you.",
    "Great things never come from comfort zones."
];

function loadQuote() {
    // check if quote already set today in sessionStorage
    const savedQuote = sessionStorage.getItem("daily_quote");

    if (savedQuote) {
        dailyQuote.textContent = savedQuote;
    } else {
        // pick random quote and save to sessionStorage
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        sessionStorage.setItem("daily_quote", quote);
        dailyQuote.textContent = quote;
    }
}


// ===== 4. HABITS =====

// load habits from localStorage and render
function loadHabits() {
    const habits = getHabits();
    habitList.innerHTML = "";
    habits.forEach(habit => renderHabit(habit));
    updateProgress();
}

// get habits array from localStorage
function getHabits() {
    return JSON.parse(localStorage.getItem("habits")) || [];
}

// save habits array to localStorage
function saveHabits(habits) {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// render a single habit item in the list
function renderHabit(habit) {
    const li = document.createElement("li");
    if (habit.done) li.classList.add("done");

    li.innerHTML = `
        <div class="li-left">
            <button class="tick-btn ${habit.done ? "done" : ""}" data-id="${habit.id}">
                ${habit.done ? "✓" : ""}
            </button>
            <span>${habit.name}</span>
            <span class="category-tag">${habit.category}</span>
        </div>
        <div class="li-right">
            <span class="streak-badge">🔥 ${habit.streak}</span>
            <button class="delete-btn" data-id="${habit.id}">🗑</button>
        </div>
    `;

    // if done, move to bottom
    if (habit.done) {
        habitList.appendChild(li);
    } else {
        habitList.prepend(li);
    }

    // tick button click
    li.querySelector(".tick-btn").addEventListener("click", () => {
        toggleHabit(habit.id);
    });

    // delete button click
    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteHabit(habit.id);
    });
}

// add new habit
addHabitBtn.addEventListener("click", () => {
    const name = habitInput.value.trim();
    const category = categorySelect.value;

    if (name === "") {
        habitError.style.display = "block";
        return;
    }

    habitError.style.display = "none";

    const habits = getHabits();
    const newHabit = {
        id: Date.now(),
        name: name,
        category: category,
        done: false,
        streak: 0,
        lastDone: null
    };

    habits.push(newHabit);
    saveHabits(habits);
    habitInput.value = "";
    loadHabits();
});

// toggle habit done/undone
function toggleHabit(id) {
    let habits = getHabits();
    habits = habits.map(h => {
        if (h.id === id) {
            // if marking done, update streak
            if (!h.done) {
                const today = new Date().toDateString();
                if (h.lastDone !== today) {
                    h.streak += 1;
                    h.lastDone = today;
                }
            }
            h.done = !h.done;
        }
        return h;
    });
    saveHabits(habits);
    loadHabits();
    updateStreak();
}

// delete habit
function deleteHabit(id) {
    let habits = getHabits();
    habits = habits.filter(h => h.id !== id);
    saveHabits(habits);
    loadHabits();
    updateProgress();
}


// ===== 5. TASKS =====

function loadTasks() {
    const tasks = getTasks();
    taskList.innerHTML = "";
    tasks.forEach(task => renderTask(task));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
        <div class="li-left">
            <button class="tick-btn ${task.done ? "done" : ""}" data-id="${task.id}">
                ${task.done ? "✓" : ""}
            </button>
            <span>${task.name}</span>
            <span class="category-tag">${task.priority}</span>
        </div>
        <button class="delete-btn" data-id="${task.id}">🗑</button>
    `;

    if (task.done) {
        taskList.appendChild(li);
    } else {
        taskList.prepend(li);
    }

    li.querySelector(".tick-btn").addEventListener("click", () => {
        toggleTask(task.id);
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteTask(task.id);
    });
}

addTaskBtn.addEventListener("click", () => {
    const name = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (name === "") {
        taskError.style.display = "block";
        return;
    }

    taskError.style.display = "none";

    const tasks = getTasks();
    const newTask = {
        id: Date.now(),
        name: name,
        priority: priority,
        done: false
    };

    tasks.push(newTask);
    saveTasks(tasks);
    taskInput.value = "";
    loadTasks();
});

function toggleTask(id) {
    let tasks = getTasks();
    tasks = tasks.map(t => {
        if (t.id === id) t.done = !t.done;
        return t;
    });
    saveTasks(tasks);
    loadTasks();
}

function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    loadTasks();
}


// ===== 6. PROGRESS BAR =====
function updateProgress() {
    const habits = getHabits();
    const total = habits.length;
    const done = habits.filter(h => h.done).length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    progressBar.style.width = percent + "%";
    progressText.textContent = `${done} / ${total} done`;
}


// ===== 7. STREAK =====
function updateStreak() {
    const habits = getHabits();
    // find max streak across all habits
    const maxStreak = habits.reduce((max, h) => h.streak > max ? h.streak : max, 0);
    streakCount.textContent = `🔥 ${maxStreak} days`;
}


// ===== 8. DAILY RESET =====
// resets all habits done status every new day
function checkDailyReset() {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem("last_reset");

    if (lastReset !== today) {
        // new day — reset all habits
        let habits = getHabits();
        habits = habits.map(h => ({ ...h, done: false }));
        saveHabits(habits);
        localStorage.setItem("last_reset", today);
        // clear session quote so new one loads
        sessionStorage.removeItem("daily_quote");
    }

    loadHabits();
    updateStreak();
}

