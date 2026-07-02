const wordBank = [
    { word: "WETILITY", hint: "The company partnering with municipalities to deliver the One Bill subscription ecosystem" },
    { word: "ONEBILL", hint: "A smart way to manage prepaid electricity by combining municipal prepaid electricity and a solar subscription into a single monthly debit" },
    { word: "MIDVAAL", hint: "One of the initial municipalities where One Bill was tried and recommended during its early phases" },
    { word: "SOLPLAATJE", hint: "Another early proving ground municipality for One Bill, located in the Northern Cape" },
    { word: "EKURHULENI", hint: "A municipality included in the launch wave scheduled for 1 July 2026" },
    { word: "THABAZIMBI", hint: "A launch town famous for its beautiful bushveld surroundings and iron ore mining" },
    { word: "DIPALESENG", hint: "A municipality located in Mpumalanga that joins the rollout on July 1st" },
    { word: "CAPETOWN", hint: "A major metropolitan area anchoring 600,000 meters that launches on 1 August 2026" },
    { word: "SOLAR", hint: "One of the five specific components covered under the single monthly One Bill debit payment" },
    { word: "GRID", hint: "One Bill intelligently blends solar, stored battery power, and power from this municipal source" },
    { word: "BACKUP", hint: "The system component that keeps your refrigerator humming during a massive local substation failure" },
    { word: "INSURANCE", hint: "A component built into One Bill providing comprehensive physical asset coverage protecting the deployed energy storage" },
    { word: "MONITORING", hint: "The active team included in the subscription that handles diagnostics if software detects a drop in panel efficiency" },
    { word: "CASHBACK", hint: "Customers earn a 2% return on prepaid token purchases in this form" },
    { word: "PHOTOVOLTAIC", hint: "What the acronym 'PV' stands for when discussing the solar panels deployed under the One Bill initiative" },
    { word: "INVERTER", hint: "The critical hardware unit that acts as the brain of the system, converting raw solar DC energy into household AC electricity" },
    { word: "LITHIUMION", hint: "The type of battery technology typically used in modern home energy systems due to its high efficiency" },
    { word: "KILOWATTHOURS", hint: "The standard metric used to measure the storage capacity of home backup batteries" },
    { word: "NORTH", hint: "The ideal direction solar panels should face in South Africa to capture maximum daily sunlight" },
    { word: "DUST", hint: "A natural factor besides clouds that can physically block light and temporarily reduce solar panel output efficiency" },
    { word: "NOTIFICATIONS", hint: "The electronic method used by the app to ping you when your monthly tokens are ready" },
    { word: "APP", hint: "The digital platform where a user can view their daily home power consumption and solar production breakdowns" },
    { word: "DEBIT", hint: "One Bill consolidates all tracking and hardware subscriptions into a single monthly payment of this type" },
    { word: "GAUTENG", hint: "The province where the major industrial hub Ekurhuleni is situated" },
    { word: "NORTHERNCAPE", hint: "The South African province where Sol Plaatje Municipality is located" },
    { word: "MPUMALANGA", hint: "The South African province where the Dipaleseng Municipality is located" },
    { word: "WESTERNCAPE", hint: "The coastal South African province that gains a major footprint boost on August 1st" },
    { word: "TABLEMOUNTAIN", hint: "The major South African mountain peak that shadows the Cape Town launch zone" },
    { word: "KIMBERLEY", hint: "A city famous for the Big Hole that belongs to the Sol Plaatje municipal district paired with One Bill" },
    { word: "MEYERTON", hint: "The main town and administrative seat of the Midvaal Municipality" },
    { word: "BALFOUR", hint: "The primary industrial and agricultural town located within the Dipaleseng Municipality" },
    { word: "ZERO", hint: "The transaction fees for purchasing prepaid electricity via EFT through One Bill" }
];
let currentWord = "";
let currentHint = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let playerName = "";
let playerEmail = "";

const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const loginForm = document.getElementById("login-form");
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const batteryLevel = document.getElementById("battery-level");
const livesCount = document.getElementById("lives-count");
const modal = document.getElementById("reward-modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const hintBtn = document.getElementById("hint-btn");
const hintDisplay = document.getElementById("hint-display");
const playerGreeting = document.getElementById("player-greeting");

function initGame() {
    // Reset variables
    guessedLetters = [];
    mistakes = 0;
    modal.style.display = "none";
    hintDisplay.innerText = "";
    hintBtn.style.display = "none";
    updateBattery();

    // Pick a random word object
    const wordObject = wordBank[Math.floor(Math.random() * wordBank.length)];
    currentWord = wordObject.word;
    currentHint = wordObject.hint;
    
    renderWord();
    renderKeyboard();
}

function renderWord() {
    wordDisplay.innerHTML = "";
    let wordWon = true;

    for (let letter of currentWord) {
        const box = document.createElement("div");
        box.classList.add("letter-box");
        
        if (guessedLetters.includes(letter)) {
            box.innerText = letter;
        } else {
            box.innerText = "";
            wordWon = false;
        }
        wordDisplay.appendChild(box);
    }

    if (wordWon) {
        setTimeout(showWinScreen, 300);
    }
}

function renderKeyboard() {
    keyboard.innerHTML = "";
    const layout = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    layout.forEach(letter => {
        const btn = document.createElement("button");
        btn.innerText = letter;
        btn.classList.add("key");
        
        // If already guessed, disable it
        if (guessedLetters.includes(letter)) {
            btn.disabled = true;
            if (currentWord.includes(letter)) {
                btn.classList.add("correct");
            }
        }

        btn.addEventListener("click", () => handleGuess(letter));
        keyboard.appendChild(btn);
    });
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || mistakes >= maxMistakes) return;

    guessedLetters.push(letter);

    if (!currentWord.includes(letter)) {
        mistakes++;
        triggerWrongGuessAnimation();
        updateBattery();
    }

    renderWord();
    renderKeyboard();

    if (mistakes >= maxMistakes) {
        setTimeout(showLoseScreen, 300);
    }
}

function triggerWrongGuessAnimation() {
    // Add shake animation to body
    document.body.classList.add("shake");
    batteryLevel.classList.add("flash");
    
    // Remove animations after they complete
    setTimeout(() => {
        document.body.classList.remove("shake");
        batteryLevel.classList.remove("flash");
    }, 600);
}

function updateBattery() {
    const percentage = ((maxMistakes - mistakes) / maxMistakes) * 100;
    const remainingAttempts = maxMistakes - mistakes;
    batteryLevel.style.width = percentage + "%";
    livesCount.innerText = remainingAttempts;

    // Show hint button as lifeline when 2 or fewer attempts remain
    if (remainingAttempts <= 2) {
        hintBtn.style.display = "block";
    }

    // Change color based on health
    if (percentage > 50) {
        batteryLevel.style.backgroundColor = "#ffa700"; // Brand gold
    } else if (percentage > 20) {
        batteryLevel.style.backgroundColor = "#ff8d00"; // Brand orange light
    } else {
        batteryLevel.style.backgroundColor = "#fe5444"; // Brand coral
    }
}

function saveWinner() {
    // Get existing winners from localStorage or create new array
    let winners = JSON.parse(localStorage.getItem("onebillWinners")) || [];
    
    // Create winner object with timestamp
    const winner = {
        name: playerName,
        email: playerEmail,
        timestamp: new Date().toISOString()
    };
    
    // Add to winners array
    winners.push(winner);
    
    // Save back to localStorage
    localStorage.setItem("onebillWinners", JSON.stringify(winners));
    
    // Log winners to console
    console.log("🎉 OneBill Game Winners:", winners);
    console.log(`Total Winners: ${winners.length}`);
}

function showWinScreen() {
    modalTitle.innerText = "POWER RESTORED!";
    modalTitle.style.color = "#FDB913"; // Gold
    modalMessage.innerHTML = `Awesome job, <strong>${playerName}</strong>! Your ticket has been logged under <strong>${playerEmail}</strong>. Take a photo of this screen and claim your <strong>Digital Lucky Ticket</strong> to spin the prize wheel at Friday's Launch Event.`;
    modal.style.display = "flex";
    
    // Save winner to localStorage
    saveWinner();
    
    // Trigger confetti animation
    if (typeof confetti !== "undefined") {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function showLoseScreen() {
    modalTitle.innerText = "SYSTEM FAILURE";
    modalTitle.style.color = "#EF4444"; // Red
    modalMessage.innerHTML = `The correct word was <strong>${currentWord}</strong>. Reset the system and try again.`;
    modal.style.display = "flex";
}

// Allow physical keyboard typing
document.addEventListener("keydown", (e) => {
    if (modal.style.display === "flex") return; // Stop typing if game over
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
    }
});

// Hint button click handler
hintBtn.addEventListener("click", () => {
    hintDisplay.innerText = currentHint;
});

// Reset to login screen function
function resetToLoginScreen() {
    // Hide game screen and show login screen
    gameScreen.style.display = "none";
    loginScreen.style.display = "flex";
    
    // Clear player data
    playerName = "";
    playerEmail = "";
    
    // Clear game state
    guessedLetters = [];
    mistakes = 0;
    currentWord = "";
    currentHint = "";
    
    // Clear display elements
    playerGreeting.textContent = "";
    hintDisplay.innerText = "";
    wordDisplay.innerHTML = "";
    keyboard.innerHTML = "";
    
    // Clear form inputs
    document.getElementById("full-name").value = "";
    document.getElementById("email").value = "";
    
    // Reset modal display
    modal.style.display = "none";
}

// Login form handler
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form input values
    playerName = document.getElementById("full-name").value;
    playerEmail = document.getElementById("email").value;
    
    // Set player greeting
    playerGreeting.textContent = `Welcome, ${playerName}!`;
    
    // Hide login screen and show game screen
    loginScreen.style.display = "none";
    gameScreen.style.display = "flex";
    
    // Start the game
    initGame();
});
