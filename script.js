/*  There are several properties and methods we will need to use
    We need to assign document elements to variables using the .getElementById() method in document
    We need to use the .checked attribute of checkboxes to validate user input
    We need to use the .onclick event of buttons to validate user input
    A clicked button without a checked checkbox should prompt user they must select an answer
    Multiple answers must not be selectable unless applicable to question: 
    Checking a box on its own must not change timer or points until input fully validated with button
*/

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
]

// get our question and answers areas to work with
var questionDiv = document.getElementById("question");
var answersDiv = document.getElementById("answers")

// function to input question information from 
// Set up our timer(h2) element and size the font
var timerElement = document.getElementById("timer");
timerElement.setAttribute("style", "font-size: 3rem;")

// Set up actual time that's being tracked and insert it into our timer
var remainingTime = 10;
timerElement.textContent = "Time: " + remainingTime;

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




var gameEndDiv = document.getElementById("gameend");
/*<input type="checkbox" id="cb1" value="Yes?">
<label for="cb1">Testing</label><br>*/

// function for setting timer
setTimer = function() {
    var timerInterval = setInterval(function() {
        timerElement.textContent = "Time: " + remainingTime;
        if(remainingTime < 0) { 
            timerElement.textContent = "Time's up!";
            clearInterval(timerInterval);
        }
        console.log(remainingTime);
        remainingTime --;
    }, 1000)
}

// Change referenced button object
// Hide gameContentDiv and show gameEndDiv
//answerButtons[0].addEventListener("click", function() { 
//    gameContentDiv.setAttribute("style", "display: none;");
//    gameEndDiv.setAttribute("style", "display: revert;");
//});
questionIndex = 0;

// go to next question
function nextQuestion() {
    setUpQuestion();
    // when end of question is reached, end the game
    if(questionIndex === allQuestions.length) {
        endGame();
    }
}

// set up questions and answers to questions
function setUpQuestion() {
    // set up next question
    askedQuestion.textContent = allQuestions[questionIndex].question;
    // set up answers to next question
    for(i = 0; i < 4; i++) {
        answerButtons[i].textContent = allQuestions[questionIndex].answers[i];
    }
    // increment so question # is tracked between function calls
    questionIndex++;
}


function endGame() {
    // reset questionIndex for future plays
    questionIndex = 0;
}

// check if question was correct or not before moving on to next question
function answerQuestion(eventtarget) {
    console.log(eventtarget.textContent);
    console.log(allQuestions[questionIndex - 1].solution);
    nextQuestion();
}


answersDiv.addEventListener("click", function(event) {
    answerQuestion(event.target);
});
setUpQuestion();

123123