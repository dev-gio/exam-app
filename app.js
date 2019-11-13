var answers = [];

function addEventsOnAnswer() {
    let answers = document.querySelectorAll('.answer');
    answers.forEach(link => {
        link.addEventListener('change', function (event) {
            compileAnswers(event);
        });
    });
}

function compileAnswers(event) {
    answers = []; // reset
    let allOptions = document.querySelectorAll('.answer');

    allOptions.forEach(link => {
        if (link.checked) {
            answers.push({
                    "id": link.getAttribute("name"),
                    "answer": link.getAttribute("value")
            });
        }
    });

    if (getBrowserCookie("cookieAnswers")) {
        eraseBrowserCookie("cookieAnswers");
        setBrowserCookie("cookieAnswers", JSON.stringify(answers), 1);
    } else {
        setBrowserCookie("cookieAnswers", JSON.stringify(answers), 1);
    }
}


function loadQuestions() {
    fetch('q&a.json')
        .then((res) => res.json())
        .then((data) => {
            let output = '';
            data = shuffle(data);
            data.forEach((question, i) => {
                output += `
                <div class="question-wrapper">
                    <div class="question">
                        <div>Question #${i + 1}:</div>
                        <div class="q-indent">${question.question}</div>
                    </div>
                    <div class="options">
                        <input type="radio" class="answer" name="${question.id}" value="${question.option1}"> ${question.option1}<br>
                        <input type="radio" class="answer" name="${question.id}" value="${question.option2}"> ${question.option2}<br>
                        <input type="radio" class="answer" name="${question.id}" value="${question.option3}"> ${question.option3}<br>  
                        <input type="radio" class="answer" name="${question.id}" value="${question.option4}"> ${question.option4}<br>  
                    </div>
                </div>
            `;
            });

            document.querySelector('.exam-wrapper').innerHTML = output;
            
            addEventsOnAnswer();
            recoverAnswers();
        });
}

function recoverAnswers() {
    let allAnswers = getBrowserCookie("cookieAnswers");

    if (allAnswers) {
        JSON.parse(allAnswers).forEach(answer => {
            let el = document.querySelector(`[name="${answer.id}"][value="${answer.answer}"]`);
            el.checked = true;
        });
    }
}

function getAnswers() {
    return fetch('answers.json')
        .then((res) => res.json())
        .then(data => { return data });
}

function checkAnswer() {
    let student = JSON.parse(getBrowserCookie("cookieAnswers"));
    getAnswers().then((answers) => {
        let correctItems = 0;

        student.forEach((item) => {
            answers.forEach((answer) => {
                if (item.id == answer.id) {
                    if (item.answer == answer.answer) {
                        console.log(item.id + ' correct');
                        correctItems++;
                    } else {
                        console.log(item.id + ' wrong');
                    }
                }
            });
        });

        console.log('Your score: ' + correctItems);
        let score = document.querySelector('#score');
        score.innerHTML = correctItems;
        score.style.display = 'block';
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadQuestions();

    document.getElementById("check").addEventListener('click', function() {
        checkAnswer();
    });
});