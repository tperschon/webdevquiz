/*  There are several properties and methods we will need to use
    We need to assign document elements to variables using the .getElementById() method in document
    We need to use the .checked attribute of checkboxes to validate user input
    We need to use the .onclick event of buttons to validate user input
    A clicked button without a checked checkbox should prompt user they must select an answer
    Multiple answers must not be selectable unless applicable to question: 
    Checking a box on its own must not change timer or points until input fully validated with button
*/

// function to create an object that stores all of our information about a question
function generateQuestionObject(inputQuestion, answer1, answer2, answer3, answer4, inputSolution, isMultipleAnswers) { 
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

var timerElement = document.getElementById("timer");
var remainingTime = 10;
timerElement.textContent = "Time: " + remainingTime;
var checkboxElement1 = document.getElementById("cb1");

var answerButtons = [];
for (i = 0; i < 4; i++) {    
    var madeButton = document.createElement("button");
    madeButton.textContent = "Button: " + (i + 1);
    madeButton.setAttribute("style", "display: block;")
    answerButtons.push(madeButton);
}
console.log(answerButtons[0]);

var gameContentDiv = document.getElementById("gamecontent")
gameContentDiv.append(answerButtons[0]);
gameContentDiv.append(answerButtons[1]);
/*<input type="checkbox" id="cb1" value="Yes?">
<label for="cb1">Testing</label><br>*/


var timerInterval = setInterval(function() {
    timerElement.textContent = "Time: " + remainingTime;
    if(remainingTime < 0) { timerElement.textContent = "Time's up!"; clearInterval(timerInterval); }
    remainingTime --;
}, 1000)
console.log(true ? false : true)
console.log(generateQuestionObject("is this a question?", "This is answer 1", "answer 2", "answer 3", "answer 4", "solution, should match one of the others", true))
console.log(generateQuestionObject("False", "This is answer 1", "answer 2", "answer 3", "answer 4", "solution, should match one of the others"))