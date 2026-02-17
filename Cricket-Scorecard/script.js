
let totalRuns = 0;
let wickets = 0;
let overs = 0;
let ballsInOver = 0;
let history = [];
let consecutiveWickets = 0;

let currentAudio = null;

function playSound(type) {

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(`sounds/${type}.mp3`);
    currentAudio.play().catch(() => {});

    setTimeout(() => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
    }, 5000);
}


function showToast(message, type = "") {
    const toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "toast show";

    if (type) {
        toast.classList.add(type);
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 5000);
}

function saveMatch() {
    const matchData = {
        totalRuns,
        wickets,
        overs,
        ballsInOver,
        history,
        consecutiveWickets
    };
    localStorage.setItem("cricketMatch", JSON.stringify(matchData));
}

function loadMatch() {
    const saved = localStorage.getItem("cricketMatch");

    if (saved) {
        const data = JSON.parse(saved);

        totalRuns = data.totalRuns;
        wickets = data.wickets;
        overs = data.overs;
        ballsInOver = data.ballsInOver;
        history = data.history;
        consecutiveWickets = data.consecutiveWickets;

        updateUI();
    }
}

function updateUI() {
    document.getElementById("scoreDisplay").innerText =
        totalRuns + " / " + wickets;

    document.getElementById("oversDisplay").innerText =
        "Overs: " + overs + "." + ballsInOver;

    document.getElementById("historyDisplay").innerText =
        history.join(" ");

    saveMatch();
}

function addRun(run) {
    totalRuns += run;
    ballsInOver++;
    history.push(run === 0 ? "." : run);

    consecutiveWickets = 0;

    if (run === 4 || run === 6) {
        showToast("🔥 Boundary!", "boundary");
        playSound("boundary");
    }

    checkMilestones();
    checkOver();
    updateUI();
}

function addWide() {
    totalRuns += 1;
    history.push("Wd");

    consecutiveWickets = 0;

    checkMilestones();
    updateUI();
}

function addWicket() {
    wickets++;
    ballsInOver++;
    history.push("W");

    consecutiveWickets++;

    showToast("❗Wicket!!", "wicket");
    playSound("wicket");

    if (consecutiveWickets === 3) {
        showToast("🔥 Wow! Hat-trick!!!", "wicket");
        playSound("hat-trick");
    }

    checkOver();
    updateUI();
}

function checkOver() {
    if (ballsInOver === 6) {
        overs++;
        ballsInOver = 0;
        history.push("|");
    }
}

function checkMilestones() {

    if (totalRuns === 50) {
        showToast("🎉 50 Up!", "milestone");
        playSound("50up");
    }

    if (totalRuns === 100) {
        showToast("🏏 100 Up!", "milestone");
        playSound("100up");
    }
}

function undoLast() {
    if (history.length === 0) return;

    let last = history.pop();

    if (last === "|") {
        ballsInOver = 5;
        overs--;
        last = history.pop();
    }

    if (last === "W") {
        wickets--;
        ballsInOver--;
        consecutiveWickets = 0;
    }
    else if (last === "Wd") {
        totalRuns--;
    }
    else {
        ballsInOver--;
        if (last !== ".") {
            totalRuns -= parseInt(last);
        }
        consecutiveWickets = 0;
    }

    updateUI();
}

function resetMatch() {
    totalRuns = 0;
    wickets = 0;
    overs = 0;
    ballsInOver = 0;
    history = [];
    consecutiveWickets = 0;

    localStorage.removeItem("cricketMatch");

    updateUI();
}

loadMatch();
updateUI();
