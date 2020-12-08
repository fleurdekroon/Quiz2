import Mustache from "mustache";
import * as data from '../static/data.json';


/* ========================================================================== *\
	PRIVATE VARIABLES
\* ========================================================================== */

let
	answerIndex = 0,
	questionIndex = 0;
const
	cssClasses = {
		hidden: 'u-hidden'
	},
	correctAnswers = new Array(),
	totalQuestions = data.questions.length,
	givenAnswers = new Array(totalQuestions),
	nextAnswerButton: HTMLButtonElement = document.querySelector('.js-next-answer-button'),
	previousAnswerButton: HTMLButtonElement = document.querySelector('.js-previous-answer-button'),
	nextQuestionButton: HTMLButtonElement = document.querySelector('.js-next-question-button'),
	previousQuestionButton: HTMLButtonElement = document.querySelector('.js-previous-question-button'),
	questionButtons = document.querySelector('.js-question-buttons'),
	questionPane: HTMLFormElement = document.querySelector('.js-question-pane'),
	resultsButton: HTMLButtonElement = document.querySelector('.js-results-button'),
	templateAnswer = ` 
	  <h2>Vraag {{questionNumber}} van {{totalQuestions}}</h2>
	  <fieldset> 
		<legend>{{question}}</legend>
		<img src="{{image}}" width="300">
		<ul>
		{{#answers}}
		  	<li class="{{#currentCorrectAnswer}}is-active{{/currentCorrectAnswer}}">
				{{text}}
			</li>
		{{/answers}}
		</ul>
	  </fieldset>
	`,
	templateQuestion = ` 
	  <h2>Vraag {{questionNumber}} van {{totalQuestions}}</h2>
	  <fieldset> 
		<legend>{{question}}</legend>
		<img src="{{image}}" width="300">
		{{#answers}}
		  <div>
			<input type="radio" value="{{value}}" name="question" id="answer{{value}}" {{#checked}}checked{{/checked}}>
			<label for="answer{{value}}">{{text}}</label>
		  </div>
		{{/answers}}
		<div class="c-validation js-validation">Maak een keuze</div>
	  </fieldset>
	`,
	templateButtons = `
	  {{#questionButtons}}<button type="button" class="js-btn-index-{{.}}">{{.}}</button>{{/questionButtons}}
	`;

/* == PRIVATE VARIABLES ===================================================== */



/* ========================================================================== *\
	PRIVATE METHODS
\* ========================================================================== */

function formControlsAnswer() {
	previousQuestionButton.classList.add(cssClasses.hidden);
	nextQuestionButton.classList.add(cssClasses.hidden);
	resultsButton.classList.add(cssClasses.hidden);

	previousAnswerButton.classList.remove(cssClasses.hidden);
	nextAnswerButton.classList.remove(cssClasses.hidden);

	if (answerIndex == 0) {
		previousAnswerButton.disabled = true;
		nextAnswerButton.disabled = false;
	} else if ((answerIndex + 1) == totalQuestions) {
		previousAnswerButton.disabled = false;
		nextAnswerButton.disabled = true;
	}
}

function formControlsQuestion() {
	if (questionIndex == 0) {
		previousQuestionButton.disabled = true;
		nextQuestionButton.disabled = false;
	} else if ((questionIndex + 1) == totalQuestions) {
		nextQuestionButton.classList.add(cssClasses.hidden);
		resultsButton.classList.remove(cssClasses.hidden);
	}
	else {
		previousQuestionButton.disabled = false;
		nextQuestionButton.classList.remove(cssClasses.hidden);
		resultsButton.classList.add(cssClasses.hidden);
	}
}

function getCorrectAnswers() {
	data.questions.forEach(item => {
		correctAnswers.push(item.correctAnswer);
	});
}

function getSelectedValue(form: HTMLFormElement) {
	const
		checkedItem: HTMLInputElement = form.querySelector('input:checked');

	return (checkedItem === null)
		? null
		: parseInt(checkedItem.value, 10);
}

function givenAnswer() {
	const
		chosenRadio = getSelectedValue(questionPane);

	return chosenRadio;
}

function initAnswer() {
	renderAnswer();
	renderButtons();
	formControlsAnswer();
}

function initQuestion() {
	renderQuestion();
	renderButtons();
	formControlsQuestion();
}

function renderAnswer() {
	const
		currentCorrectAnswer = data.questions[answerIndex].correctAnswer,
		currentQuestion = data.questions[answerIndex],
		newData = {
			...currentQuestion,
			answers: currentQuestion.answers.map(answer => {
				return {
					...answer,
					currentCorrectAnswer: answer.value === currentCorrectAnswer
				}
			}),
			totalQuestions
		},
		html = Mustache.render(templateAnswer, newData);

	questionPane.innerHTML = html;
}

function renderQuestion() {
	const
		currentQuestion = data.questions[questionIndex],
		newData = {
			...currentQuestion,
			answers: currentQuestion.answers.map(answer => {
				return {
					...answer,
					checked: answer.value === givenAnswers[questionIndex]
				}
			}),
			totalQuestions,
			questionNumber: (questionIndex + 1)
		},
		html = Mustache.render(templateQuestion, newData);

	questionPane.innerHTML = html;
}

function renderButtons() {
	const
		newData = {
			...data.questions[questionIndex],
			questionButtons: data.questions.map((question, index) => index + 1)
		},
		html = Mustache.render(templateButtons, newData);
	questionButtons.innerHTML = html;

	let btnIndex = document.querySelector('.js-btn-index-3');
	btnIndex.addEventListener('click', event => {
		renderQuestion();
	});

}

function storeGivenAnswers(index, value) {
	givenAnswers[index] = value;
}

function validate() {
	const
		isValid = getSelectedValue(questionPane) !== null,
		validationText = document.querySelector('.js-validation');

	if (!isValid) {
		validationText.classList.add('is-error');
	} else {
		validationText.classList.remove('is-error');
	}
	return isValid;
}

/* == PRIVATE METHODS ======================================================= */



/* ========================================================================== *\
	EVENT HANDLING
\* ========================================================================== */

nextAnswerButton.addEventListener('click', event => {
	answerIndex++;
	initAnswer();
});

previousAnswerButton.addEventListener('click', event => {
	answerIndex--;
	initAnswer();
});

nextQuestionButton.addEventListener('click', event => {
	if (validate()) {
		storeGivenAnswers(questionIndex, givenAnswer());
		questionIndex++;
		initQuestion();
	}
});

previousQuestionButton.addEventListener('click', event => {
	questionIndex--;
	initQuestion();
});

questionPane.addEventListener('change', event => {
	validate();
});

resultsButton.addEventListener('click', event => {
	getCorrectAnswers();
	initAnswer();
});

/* == EVENT HANDLING ======================================================== */



/* ========================================================================== *\
	INITIALIZATION
\* ========================================================================== */

initQuestion();

/* == INITIALIZATION ======================================================== */

// Type examen kiezen
// image ophalen vanuit ander endpoint
// Opslaan van correctAnswers in array - CHECK!
// Switchen tussen de vragen
// Active state meegegeven in de buttonreeks waar je op dat moment bent
// Na het drukken op de uitslag knop in een 'read-only' status komen - CHECK
// Na uitslag weergeven hoeveel vragen er in totaal goed waren
// Na uitslag het weergeven van het juiste antwoord en uitleg 
// Na uitslag in de vraagnummers weergeven wat goed en fout was
// Na uitslag aanduiden welke antwoord goed was - CHECK