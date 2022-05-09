// function to create an object that stores all of our information about a question
function generateQuestion(inputQuestion, answer1, answer2, answer3, answer4, inputSolution, isMultipleAnswers) { 
    var questionAndAnswers = {
        question: inputQuestion,
        answers: [answer1, answer2, answer3, answer4],
        solution: inputSolution,
        multiple: false
    }
    // questions default only have one answer, this doesn't get used for this quiz but saving for potential future use via textbox multi-choice
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

// get divs to work with, used with display properties to hide and show to page through quiz
var startScreenDiv = document.getElementById("startscreen");
var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answers");
var gameEndDiv = document.getElementById("gameend");
var scoresScreenDiv = document.getElementById("scoresscreen");
var answeredDiv = document.getElementById("answered");

// get our input field and submit button
var initialsInput = document.getElementById("initials");
var initialsButton = document.getElementById("initialbutton");

// get our start button
var startButton = document.getElementById("startbutton");

// get spans to insert quiz parameters to display to user
var questionNumberSpan = document.getElementById("questionnumber");
var timerTimeSpan = document.getElementById("timertime");
var penaltyAmountSpan = document.getElementById("penalty");

// Set up our timer(h2) element and size the font
var timerElement = document.getElementById("timer");
timerElement.setAttribute("style", "font-size: 3rem;");

// Set up actual time that's being tracked and insert it into our timer and start screen
var remainingTime = 75;
timerElement.textContent = "Time: " + remainingTime;
timerTimeSpan.textContent = ` ${remainingTime} `;
timerTimeSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);")

// Set up and penalty amount for incorrect answers and insert it into start screen
var penaltyAmount = 10;
penaltyAmountSpan.textContent = ` ${penaltyAmount} `;
penaltyAmountSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);")

// insert number of questions into start screen
questionNumberSpan.textContent = ` ${allQuestions.length} `;
questionNumberSpan.setAttribute("style", "font-size: 3rem; color: var(--highlight);")


// Set up an h3 to hold the question being asked to user
var askedQuestion = document.createElement("h3");
askedQuestion.textContent = "Question Goes Here";
askedQuestion.setAttribute("style", "font-size: 4rem; text-align: center;");
questionDiv.append(askedQuestion);

// Set up our buttons for answers
var answerButtons = [];
for(i = 0; i < 4; i++) {    
    var madeButton = document.createElement("button");
    madeButton.textContent = "Button: " + (i + 1);
    madeButton.setAttribute("style", "display: block;");
    answerButtons.push(madeButton);
    answersDiv.appendChild(answerButtons[i]);
}

/*<input type="checkbox" id="cb1" value="Yes?">
<label for="cb1">Testing</label><br>*/

// function for setting timer
function setTimer() {
    timerElement.setAttribute("style", "display: revert; font-size: 3rem;")
    var timerInterval = setInterval(function() {
        remainingTime --;
        timerElement.textContent = "Time: " + remainingTime;
        if(remainingTime < 0) { 
            timerElement.textContent = "Time's up!";
            clearInterval(timerInterval);
        }
        console.log(remainingTime);
    }, 1000)
}

// Change referenced button object
// Hide gameContentDiv and show gameEndDiv
//answerButtons[0].addEventListener("click", function() { 
//    gameContentDiv.setAttribute("style", "display: none;");
//    gameEndDiv.setAttribute("style", "display: revert;");
//});

// which question to start on as well as used to increment questions
questionIndex = 0;
correctlyAnswered = 0;

// sets up a question and its answers based on the given integer
function setUpQuestions(qIndex) {
    // initialize a randomized ordering of 0, 1, 2 and 3 to use as index, to randomly order answers
    var randomizer = randomizeString("0123");
    // set up the current question in the askedQuestion text
    askedQuestion.textContent = allQuestions[qIndex].question;
    // four total button, go through each and give them text pertinent to the current question
    for(i = 0;i < 4; i++)
    {
        answerButtons[i].textContent = allQuestions[qIndex].answers[randomizer[i]];
    }
}

// check if clicked button is the correct answer to the current question
function checkAnswer(clickedButton) {
    if(clickedButton.textContent === allQuestions[questionIndex].solution){
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
    if(remainingTime <= 0) {
        timerElement.textContent = "Time's up!";
        endQuiz()
    } else timerElement.textContent = "Time: " + remainingTime;
}

// function to start quiz
function startQuiz() {
    setTimer();
    startScreenDiv.setAttribute("style", "display: none;");
    questionDiv.setAttribute("style", "display: flex;");
    answersDiv.setAttribute("style", "display: revert;")
}

// function run when quiz should end, by time, penalty or user finishes all questions
function endQuiz() {
    // hide our answeredDiv after 3.5 seconds
    setTimeout(hideAnswered, 3500);
    questionDiv.setAttribute("style", "display: none");
    answersDiv.setAttribute("style", "display: none");
    gameEndDiv.setAttribute("style", "display: revert")
}

// hides answeredDiv
function hideAnswered() {
    answeredDiv.setAttribute("style", "display: none;");
}

answersDiv.addEventListener("click", function(event) {
    // only run if an answer button is actually clicked
    if(event.target.tagName !== "DIV") {
        // function to check if user answered correctly
        checkAnswer(event.target)
        // increment so question # is tracked between function calls
        questionIndex++;
        // reset and end quiz if last question answered
        if(questionIndex === 10) {
            endQuiz();
            questionIndex = 0;
        }
        // set up the next question
        setUpQuestions(questionIndex);
    }
});

// start quiz when start button pressed
startButton.addEventListener("click", startQuiz);

// submit initials to leaderboard when submit button pressed
initialsButton.addEventListener("click", function() {

});

// calculate score via number correct and time left
function calculateScore(correct, timeLeft) {
    return (timeLeft * correct * correct) + timeLeft;
}

// takes in a string and spits out a string with the same characters in a random order
function randomizeString(string) {
    // declare the string parameter as an array so we can use .split() and .splice()
    var array = string.split("");
    // string we will return, declare empty so we can use += operator
    var outString = [];
    // iterate through the length of the string (not the array) and splice out array elements using random # based on array's length
    for(i = 0; i < string.length; i++){
        outString += array.splice(Math.floor(Math.random() * array.length), 1)
    }
    // output randomized string
    return outString;
}

setUpQuestions(questionIndex);