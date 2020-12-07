import Mustache from "mustache";
import * as data from '../static/data.json';

const templateQuestion = ` 
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
	`;

const templateButtons = `
	  {{#questionButtons}}<button type="button" class="js-btn-index-{{.}}">{{.}}</button>{{/questionButtons}}
	`;

let
	questionIndex = 0;
const
	nextButton: HTMLButtonElement = document.querySelector('.js-next-button'),
	nextButtonText = nextButton.innerHTML,
	previousButton: HTMLButtonElement = document.querySelector('.js-previous-button'),
	totalQuestions = data.questions.length,
	givenAnswers = new Array(totalQuestions),
	correctAnswers = new Array(),
	questionButtons = document.querySelector('.js-question-buttons'),
	questionPane: HTMLFormElement = document.querySelector('.js-question-pane');

function formControls() {
	if (questionIndex == 0) {
		previousButton.disabled = true;
		nextButton.disabled = false;
	} else if ((questionIndex + 1) == totalQuestions) {
		nextButton.innerHTML = "Uitslag";
		nextButton.classList.add('js-results-button');
		const
			resultButton = document.querySelector('.js-results-button');

		resultButton.addEventListener('click', event => {
			getCorrectAnswers();
		});
	}
	else {
		previousButton.disabled = false;
		nextButton.innerHTML = nextButtonText;
		nextButton.classList.remove('js-results-button');
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

function initQuestion() {
	renderQuestion();
	renderButtons();
	formControls();
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

questionPane.addEventListener('change', event => {
	validate();
});

nextButton.addEventListener('click', event => {
	if (validate()) {
		storeGivenAnswers(questionIndex, givenAnswer());
		questionIndex++;
		initQuestion();
	}
});

previousButton.addEventListener('click', event => {
	questionIndex--;
	initQuestion();
});



initQuestion();

// Type examen kiezen
// Opslaan van correctAnswers in array
// Switchen tussen de vragen
// Na het drukken op de uitslag knop in een 'read-only' status komen
// Na uitslag weergeven hoeveel vragen er in totaal goed waren
// Na uitslag het weergeven van het juiste antwoord en uitleg
// Na uitslag in de vraagnummers weergeven wat goed en fout was
// Na uitslag aanduiden welke antwoord goed was