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
    // questions default only have one answer
    isMultipleAnswers ? questionAndAnswers.multiple = true : false;
    return questionAndAnswers;
}

// object containing all our questions
var allQuestions = [
    generateQuestion("Testing the first question!", "Q1A1", "Q1A2", "Q1A3", "Q1A4", "Q1S", false),
    generateQuestion("Testing the second question!", "Q2A1", "Q2A2", "Q2A3", "Q2A4", "Q2S", false),
    generateQuestion("Testing the third question!", "Q3A1", "Q3A2", "Q3A3", "Q3A4", "Q3S", false),
    generateQuestion("Testing the fourth question!", "Q4A1", "Q4A2", "Q4A3", "Q4A4", "Q4S", false),
    generateQuestion("Testing the fifth question!", "Q5A1", "Q5A2", "Q5A3", "Q5A4", "Q5S", false),
    generateQuestion("Testing the sixth question!", "Q6A1", "Q6A2", "Q6A3", "Q6A4", "Q6S", false),
    generateQuestion("Testing the seventh question!", "Q7A1", "Q7A2", "Q7A3", "Q7A4", "Q7S", false),
    generateQuestion("Testing the eighth question!", "Q8A1", "Q8A2", "Q8A3", "Q8A4", "Q8S", false),
    generateQuestion("Testing the ninth question!", "Q9A1", "Q9A2", "Q9A3", "Q9A4", "Q9S", false),
    generateQuestion("Testing the tenth question!", "Q10A1", "Q10A2", "Q10A3", "Q10A4", "Q10S", false)
]

var gameContentDiv = document.getElementById("gamecontent");

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
askedQuestion.setAttribute("style", "font-size: 4rem;");
gameContentDiv.append(askedQuestion);

// Set up our buttons for answers
var answerButtons = [];
for(i = 0; i < 4; i++) {    
    var madeButton = document.createElement("button");
    madeButton.textContent = "Button: " + (i + 1);
    madeButton.setAttribute("style", "display: block;");
    answerButtons.push(madeButton);
    gameContentDiv.append(answerButtons[i]);
}
console.log(answerButtons[0]);




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
answerButtons[questionIndex].addEventListener("click", function(){
    for(i = 0; i < 4; i++) {
        answerButtons[i].textContent = allQuestions[questionIndex].answers[i];
    }
    askedQuestion.textContent = allQuestions[questionIndex].question;
    questionIndex++;
    if(questionIndex === allQuestions.length) questionIndex = 0;
});
console.log(true ? false : true)