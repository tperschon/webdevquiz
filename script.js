// function to create an object that stores all of our information about a question
function generateQuestion(inputQuestion, answer1, answer2, answer3, answer4, inputSolution, isMultipleAnswers) {
    var questionAndAnswers = {
        question: inputQuestion,
        answers: [answer1, answer2, answer3, answer4],
        solution: inputSolution,
        multiple: false
    }
    // questions default only have one answer, this doesn't get used for this quiz but saving for potential future use via checkbox multi-choice
    isMultipleAnswers ? questionAndAnswers.multiple = true : false;
    // return object containing question, all answers, and true answer (inputSolution)
    return questionAndAnswers;
}

// array containing all our question objects
var allQuestions = [
    generateQuestion("What does 'CSS' stand for?", "Custom Style Sheets", "Cascading Style Sheets", "Computer Software Sheets", "Cascading Software Styles", "Cascading Style Sheets", false),
    generateQuestion("What programming language is natively supported by almost all internet browsers?", "Java", "Python", "Ruby", "JavaScript", "JavaScript", false),
    generateQuestion("HTML stands for what?", "HyperText Markup Language", "HyperText MDN Language", "Harvard Technical Masters Login", "HTML Tautological Makeup Learning", "HyperText Markup Language", false),
    generateQuestion("How many types of primitive types exist in JavaScript?", "4", "5", "6", "7", "7", false),
    generateQuestion("Which one of the following is NOT a primitive type in JavaScript?", "string", "NaN", "undefined", "bigint", "NaN", false),
    generateQuestion("Using the 'typeof' operator, what will 'NaN' return as?", "NaN", "number", "undefined", "null", "number", false),
    generateQuestion("Which array method would we use to add a new element to the end of an array?", ".push()", ".pop()", ".shift()", ".unshift()", ".push()", false),
    generateQuestion("If the 'cancel' button is pressed by the user on a prompt(), what is returned?", "An empty string", "null", "undefined", "false", "null", false),
    generateQuestion("What is the name of the '=' operator?", "assignment", "equals", "equivalent", "strictly equals", "assignment", false),
    generateQuestion("Which operator increments a variable by 1?", "+=", "--", "-=", "++", "++", false)
];

////// setup all html objects
//// start screen and its button plus spans
var startScreenDiv = document.getElementById("startscreen");
var startButton = document.getElementById("startbutton");
// these spans are fed info about the quiz parameters
var questionNumberSpan = document.getElementById("questionnumber");
var timerTimeSpan = document.getElementById("timertime");
var penaltyAmountSpan = document.getElementById("penalty");

//// questionandanswers div plus child divs question/answers and their elements
var questionAndAnswersDiv = document.getElementById("questionandanswers");
var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answers");
// variable and loop that sets up buttons on the answers div
var answerButtons = [];
for (i = 0; i < 4; i++) {
    var madeButton = document.createElement("button");
    madeButton.textContent = "Button: " + (i + 1);
    madeButton.setAttribute("style", "display: block;");
    answerButtons.push(madeButton);
    answersDiv.appendChild(answerButtons[i]);
}

//// end of quiz screen and its input and button and error span
var gameEndDiv = document.getElementById("gameend");
var initialsInput = document.getElementById("initials");
var initialsButton = document.getElementById("initialbutton");
var errorSpan = document.getElementById("inputerror");

//// final screen allowing users to restart or quit altogether and its buttons
var endscreenDiv = document.getElementById("endscreen");
var restartButton = document.getElementById("restart");
var endButton = document.getElementById("end");

//// scores screen and its own buttons
var scoresScreenDiv = document.getElementById("scoresscreen");
var closeButton = document.getElementById("close");
var clearScoresButton = document.getElementById("clear");
//// this div gets appended to entire content when user answers question then it will display: none after 3.5 seconds
var answeredDiv = document.getElementById("answered");

// using an initial blank array and if statement so we can always use .append() even if no stored scores
var highscores = [];
var storedHighscores = JSON.parse(localStorage.getItem("highscores"));
var scoresList = document.getElementById("scores");

// define variables for index of questions, number of correct answers, score
var questionIndex = 0;
var correctlyAnswered = 0;
var currentScore;

// button to toggle scores screen and the quiz timer
var highscoresButton = document.getElementById("highscores");
var timerElement = document.getElementById("timer");
timerElement.setAttribute("style", "font-size: 3rem;");
var quizTime = 75; // change to change quiz time
var remainingTime = quizTime; // used for logic while preserving quizTime's original parameters
timerElement.textContent = "Time: " + remainingTime;
timerTimeSpan.textContent = ` ${remainingTime} `;
timerTimeSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);");

function init() {
    setUpQuestions(questionIndex);
    setLeaderboard();
}

// Set up and penalty amount for incorrect answers and insert it into start screen
var penaltyAmount = 10;
penaltyAmountSpan.textContent = ` ${penaltyAmount} `;
penaltyAmountSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);")

// insert number of questions into start screen
questionNumberSpan.textContent = ` ${(allQuestions.length - questionIndex)} `;
questionNumberSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);")

// retrieve high scores array from localstorage, set up scores ul
if (storedHighscores !== null) highscores = storedHighscores;

// Set up an h3 to hold the question being asked to user
var askedQuestion = document.createElement("h3");
askedQuestion.textContent = "Question Goes Here";
askedQuestion.setAttribute("style", "font-size: 4rem; text-align: center;");
questionDiv.append(askedQuestion);

// global scope variable for use with setInterval/clearInterval
var timerInterval;
// function for setting timer
function setTimer() {
    // set timer to starting time
    timerElement.textContent = "Time: " + remainingTime;
    // set up the timer on the screen
    timerElement.setAttribute("style", "display: revert; font-size: 3rem;")
    // interval function to actually count down timer
    timerInterval = setInterval(function () {
        remainingTime--;
        timerElement.textContent = "Time: " + remainingTime;
        // end quiz if countdown reaches 0;
        if (remainingTime < 0) {
            endQuiz();
        }
    }, 1000)
}

// stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    setTimeout(timerElement.setAttribute("style", "display: none;"), 3500);
}

// sets up a question and its answers based on the given integer
function setUpQuestions(qIndex) {
    // initialize a randomized ordering of 0, 1, 2 and 3 to use as index, to randomly order answers
    var randomizer = randomizeString("0123");
    // set up the current question in the askedQuestion text
    askedQuestion.textContent = allQuestions[qIndex].question;
    // four total button, go through each and give them text pertinent to the current question
    for (i = 0; i < 4; i++) {
        answerButtons[i].textContent = allQuestions[qIndex].answers[randomizer[i]];
    }
}

// check if clicked button is the correct answer to the current question
function checkAnswer(clickedButton) {
    if (clickedButton.textContent === allQuestions[questionIndex].solution) {
        correct();
    } else {
        incorrect();
    }
}

// function to run if user answered correctly
function correct() {
    // increment number of correctly answered questions
    correctlyAnswered++;
    // show and change text of answereDiv
    answeredDiv.setAttribute("style", "display: revert;");
    answeredDiv.textContent = "Correct!";
}

// function to run if user answered incorrectly
function incorrect() {
    // show and change text of answeredDiv
    answeredDiv.setAttribute("style", "display: revert;");
    answeredDiv.textContent = "Incorrect!";
    // remove time from timer as penalty
    remainingTime -= penaltyAmount;
    // end quiz if penalty causes time to go to 0 or below, else update timer with penalty instantly
    if (remainingTime <= 0) {
        endQuiz()
    } else timerElement.textContent = "Time: " + remainingTime;
}

// function to start quiz
function startQuiz() {
    questionIndex = 0;
    setUpQuestions(questionIndex);
    setTimer();
    correctlyAnswered = 0;
    remainingTime = quizTime;
    startScreenDiv.setAttribute("style", "display: none;");
    questionDiv.setAttribute("style", "display: flex;");
    answersDiv.setAttribute("style", "display: revert;")
}

// function run when quiz should end, by time, penalty or user finishes all questions
function endQuiz() {
    // hide our answeredDiv after 3.5 seconds
    setTimeout(hideAnswered, 3500);
    if (remainingTime < 1) timerElement.textContent = "Time's up!";
    else timerElement.textContent = "Finished!";
    stopTimer();
    remainingTime = quizTime;
    questionDiv.setAttribute("style", "display: none");
    answersDiv.setAttribute("style", "display: none");
    gameEndDiv.setAttribute("style", "display: revert")
}

// hides answeredDiv
function hideAnswered() {
    answeredDiv.setAttribute("style", "display: none;");
}

answersDiv.addEventListener("click", function (event) {
    // only run if an answer button is actually clicked
    if (event.target.tagName !== "DIV") {
        // function to check if user answered correctly
        checkAnswer(event.target)
        // increment so question # is tracked between function calls
        questionIndex++;
        // reset and end quiz if last question answered
        if (questionIndex === 10) {
            endQuiz();
            return;
        }
        // set up the next question
        setUpQuestions(questionIndex);
    }
});

// event listener/function to open/close score screen with view high scores button
highscoresButton.addEventListener("click", toggleScoreboard)

// start quiz when start button pressed
startButton.addEventListener("click", startQuiz);

// submit initials to leaderboard when submit button pressed
initialsButton.addEventListener("click", addScore);

// variables for error message upon inputting less than 3 characters
var onlyOneInterval = false;
var errorSpanopacity = 1;
function addScore(event) {
    if (initialsInput.value.length < 3) {
        errorSpan.textContent = "You must enter at least 3 characters."
        errorSpan.setAttribute("style", "background-color: var(--warn); padding: 10px; z-index: 2; width: 300px; color: var(--outline); position: absolute; align-self: center;");
        errorSpanopacity = 1;
        if (onlyOneInterval === false) {
            var fade = setInterval(function () {
                onlyOneInterval = true;
                errorSpanopacity -= .01;
                errorSpan.style.opacity = errorSpanopacity;
                if (errorSpanopacity <= 0) {
                    clearInterval(fade);
                    errorSpan.setAttribute("style", "display: none;");
                    onlyOneInterval = false;
                }
            }, 20);
        }
    }
    else {
        // store our score info
        storeScore(initialsInput.value, calculateScore(correctlyAnswered, remainingTime));
        // clear the scores out from the leaderboard so we can repopulate it and our new score is sorted in appropriately
        clearScores();
        // sort the scores so when they populate they're in descending point order
        sortScores(highscores);
        // set up all the scores
        setLeaderboard();
        // show the div containing all the scores
        showScoreboard();

        endscreenDiv.setAttribute("style", "display: revert;")
        gameEndDiv.setAttribute("style", "display: none;");
        scoresScreenDiv.dataset.state = "visible";
    }
}

// creates a li with spans for initials and score
function createScore(initialABC, number) {
    var newLi = document.createElement("li");
    newLi.dataset.initials = initialABC.toUpperCase();
    newLi.dataset.score = number;
    newLi.setAttribute("style", "background-color: var(--highscores); margin: 3px auto; list-style: none; width: 150px; color: var(--outline); display: flex; justify-content: space-between; font-family: 'Courier New', Courier, monospace;")
    var newInitials = document.createElement("span");
    newInitials.textContent = newLi.dataset.initials;
    newInitials.setAttribute("style", "padding: 0 3px; font-size: 2.5rem;")
    newLi.appendChild(newInitials);
    var newScore = document.createElement("span");
    newScore.textContent = newLi.dataset.score;
    newScore.setAttribute("style", "padding: 0 3px; font-size: 2.5rem;")
    newLi.appendChild(newScore);
    return newLi;
}

// stores our scores in an object, itself being stored in an array, that array gets stringified for localStorage usage
function storeScore(initialABC, number) {
    var scoreObj = {
        initials: initialABC,
        score: number
    }
    highscores.push(scoreObj);
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

// uses retrieved scores from 
function setLeaderboard() {
    for (i = 0; i < highscores.length; i++) {
        var tempScore = createScore(highscores[i].initials, highscores[i].score)
        scoresScreenDiv.appendChild(tempScore);
    }
}

clearScoresButton.addEventListener("click", function () {
    clearScores();
    highscores = [];
    localStorage.setItem("highscores", JSON.stringify(highscores));
})

// close scoresscreen if close button pressed
closeButton.addEventListener("click", hideScoreboard);

restartButton.addEventListener("click", function () {
    endscreenDiv.setAttribute("style", "display: none;");
    startScreenDiv.setAttribute("style", "dispaly: revert;")
});

// prevent user from using invalid keys on entering highscore
initialsInput.addEventListener("keydown", function (event) {
    // array with accepted characters and commands
    var acceptedChars = ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "Backspace", "Delete", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"];
    // if key isn't alphanumeric or okayed command, preventDefault so nothing happens (special characters not entered, can't refresh page, etc.)
    if (!acceptedChars[0].includes(event.key) && !acceptedChars.includes(event.key)) event.preventDefault();
});

function toggleScoreboard() {
    if (scoresScreenDiv.dataset.state === "visible") {
        hideScoreboard();
    } else {
        showScoreboard();
    }
}
// functions to hide and show the scoreboard, used by the highscoresButton
function showScoreboard() {
    scoresScreenDiv.setAttribute("style", "display: revert; position: absolute; top: 10px; left: 0; right: 0; margin: 0 auto; border-radius: 10px;");
    scoresScreenDiv.dataset.state = "visible";
}
function hideScoreboard() {
    scoresScreenDiv.setAttribute("style", "display: none;")
    scoresScreenDiv.dataset.state = "hidden";
}


// calculate score via number correct and time left
function calculateScore(correct, timeLeft) {
    if (timeLeft < 1) return (1 * correct * correct); // non-zero, non-negative score
    else return (timeLeft * correct * correct) + timeLeft;
}

// takes in a string and spits out a string with the same characters in a random order
function randomizeString(string) {
    // declare the string parameter as an array so we can use .split() and .splice()
    var array = string.split("");
    // string we will return, declare empty so we can use += operator
    var outString = [];
    // iterate through the length of the string (not the array) and splice out array elements using random # based on array's length
    for (i = 0; i < string.length; i++) {
        outString += array.splice(Math.floor(Math.random() * array.length), 1)
    }
    // output randomized string
    return outString;
}
// uses the sort method's callback function to sort the objects within array in ascending order based on their .score property, then reverse that order to create a descending based
function sortScores(objectArray) {
    objectArray.sort(function (score1, score2) {
        if (score1.score < score2.score) return -1;
        else if (score2.score < score1.score) return 1;
        else return 0;
    })
    objectArray.reverse();
}

// function to clear all the scores out of the ul item, used so we can clear them out and repopulate them after they've been re-ordered
function clearScores() {
    var list = document.getElementsByTagName("li")
    var listlength = list.length;
    for (i = listlength; i > 0; i--) {
        list[i - 1].remove();
    }
}

// ends the whole game when user clicks the "End" button
endButton.addEventListener("click", function() {
    var game = document.getElementById("game");
    game.textContent = "Thanks for taking the quiz!";
    game.setAttribute("style", "border-radius: 10px; background-color: var(--bodybackground); font-size: 6rem;")
})

init();