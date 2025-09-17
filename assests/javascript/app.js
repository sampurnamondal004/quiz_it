
var app = {
    $startBtn: $("#start-btn"),
    $timerSection: $("#timer-section"),
    $timer: $("#timer"),
    $progress: $(".progress"),
    $questionSection: $("#question-section"),
    $question: $("#question"),
    $possibleAnswers: $(".possible-answer"),
    $chosenAnswer: "",

    $message: $(".message"),
    $rwMessage: $("#right-wrong-message"),
    $rightAnswerP: $("#correct-answer-p"),
    $rightAnswer: $("#right-answer-is"),
    $imgMessage: $("#img-message"),

    time: 30,
    intervalTimer: "",
    nextQuestion: "",
    numOfQuestions: "",
    percent: 0,

    currentQuestion: "",
    currentChoices: "",
    currentAnswer: "",
    usedQuestions: [],

    right: 0,
    wrong: 0,
    unanswered: 0,

    $endScreen: $(".end-screen"),
    $right: $("#right"),
    $wrong: $("#wrong"),
    $unanswered: $("#unanswered"),
    $startOverBtn: $("#start-over-btn"),

    trivia: [
        {
            question: "Which creatures pull the carriages that take students from the Hogwarts Express to the Castle?",
            choices: ["Hippogriffs", "Thestrals", "Centaurs", "Manticores"],
            answer: "Thestrals"
        },
        {
            question: "Where is the Slytherin common room located?",
            choices: ["Next to the kitchens", "In the west tower", "Below the Great Hall", "In the dungeons"],
            answer: "In the dungeons"
        },
        {
            question: "Who was the headmaster of Hogwarts when the Chamber of Secrets was opened for the first time?",
            choices: ["Armando Dippet", "Phineas Nigellus Black", "Albus Dumbledore", "Brutus Scrimgeour"],
            answer: "Armando Dippet"
        },
        {
            question: "Who is the Hufflepuff house ghost?",
            choices: ["The Fat Friar", "Cuthbert Binns", "The Grey Lady", "Sir Patrick Delaney-Podmore"],
            answer: "The Fat Friar"
        },
        {
            question: "Who posed as Mad-Eye Moody during Harry's 4th year?",
            choices: ["Peter Pettigrew", "Barty Crouch Jr.", "Sirius Black", "Voldemort"],
            answer: "Barty Crouch Jr."
        },
        {
            question: "How does Harry breathe underwater for the second task of the Triwizard Tournament?",
            choices: ["He transfigures himself", "He uses the bubble-head charm", "He eats gillyweed", "He asks the mermen for help"],
            answer: "He eats gillyweed"
        },
        {
            question: "What does O.W.L. stand for?",
            choices: ["Official Wizarding Levels", "Outstanding Wizard Learning", "Outstanding Wonderful Luck", "Ordinary Wizarding Level"],
            answer: "Ordinary Wizarding Level"
        },
        {
            question: "What is the name of Filch's cat?",
            choices: ["Buttercup", "Mrs. Filch", "Mrs. Norris", "Ser Pounce"],
            answer: "Mrs. Norris"
        },
        {
            question: 'Which other boy might have ended up as the "Chosen One?"',
            choices: ["Cedric Diggory", "Draco Malfoy", "Ernie Macmillan", "Neville Longbottom"],
            answer: "Neville Longbottom"
        },
        {
            question: "What do Hermione's parents do for a living?",
            choices: ["Dentists", "Healers", "Teachers", "Librarians"],
            answer: "Dentists"
        }
    ],

    rightGifs: ["https://media.giphy.com/media/qLHzYjlA2FW8g/giphy.gif", "https://media.giphy.com/media/qU3ygbyBm0ynC/giphy.gif", "https://media.giphy.com/media/12c664V5sG9OaQ/giphy.gif", "https://media.giphy.com/media/VwUquCGtIatGg/giphy.gif"],

    wrongGifs: ["https://media.giphy.com/media/14gESmcGjeqSZO/giphy.gif", "https://media.giphy.com/media/mlPUJrMgkEays/giphy.gif", "https://media.giphy.com/media/GD8ypYfe6WnBu/giphy.gif", "https://media.giphy.com/media/13wZTPmMABczcs/giphy.gif", "https://media.giphy.com/media/sMxMzHzea6g3m/giphy.gif", "https://media.giphy.com/media/83LWb2PshIJ5C/giphy.gif"],

    convertTime: function (t) {
        var minutes = Math.floor(t / 60);
        var seconds = t - minutes;

        if (minutes === 0) {
            minutes = "00";
        } else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;
    },

    count: function () {
        // subtract 1 second
        app.time--;
        // console.log(app.time);

        // update time on page
        app.$timer.text(app.convertTime(app.time));

        // stop interval at 00:00
        if (app.time === 0) {
            clearInterval(app.intervalTimer);
            console.log("clear interval");
            app.answerScreen();
        }
    },

    startGame: function () {
        if (app.trivia.length === app.numOfQuestions) {
            app.percent = 0;
            app.$progress.children().css("width", app.percent + "%");
            app.$progress.children().text(app.percent + "%");

            app.$endScreen.addClass("hide");
        }


        if (app.trivia.length === 0) { // if all questions have been answered
            app.endScreen();

        } else {
            // show questions, answers, and timer - hide start button & message area
            app.$timerSection.removeClass("hide");
            app.$questionSection.removeClass("hide");
            app.$message.addClass("hide");
            app.$startBtn.parent().parent().addClass("hide");
            app.$rightAnswerP.addClass("hide");

            // show progress bar
            app.$progress.removeClass("hide");

            // reset timer
            app.time = 30;
            app.$timer.text(app.convertTime(app.time));

            app.intervalTimer = setInterval(app.count, 1000); // counts every second
            console.log("game started");

            app.loadQuestion();
        }
        

    },

    loadQuestion: function () {
        var randomNumber = Math.floor(Math.random() * app.trivia.length);

        // get random question & answers
        app.currentQuestion = app.trivia[randomNumber].question;
        app.currentChoices = app.trivia[randomNumber].choices;
        app.currentAnswer = app.trivia[randomNumber].answer;

        // add question to new array of asked questions
        app.usedQuestions.push(app.trivia[randomNumber]);

        // remove that question from the array (at index of randomNumber, 1 item to remove)
        app.trivia.splice(randomNumber, 1);

        // add question to page
        app.$question.text(app.currentQuestion);

        // add each possible answer to page
        $.each(app.$possibleAnswers, function(index, value) {
            value.textContent = app.currentChoices[index]; 
        })

    },

    answerScreen: function () {
        // stop timer
        clearInterval(app.intervalTimer);

        // hide question area
        app.$questionSection.addClass("hide");

        // show message area
        app.$message.removeClass("hide");

        // percentage for progress bar
        app.percent += (100 / app.numOfQuestions);

        // update progress bar
        app.$progress.children().css("width", app.percent + "%");
        app.$progress.children().text(app.percent + "%");

        // check user picked an answer & if that was the right answer
        if (app.$chosenAnswer !== "" && app.$chosenAnswer.text() === app.currentAnswer) {
            // if right
            console.log("that's right");

            // add 1 to # of right answers
            app.right++;
            console.log("right: " + app.right);

            // follow up screen display
            app.$rwMessage.text("Brilliant!");
            var random = Math.floor(Math.random() * app.rightGifs.length);
            app.$imgMessage.attr("src", app.rightGifs[random]);

            // hold screen for 5 seconds, then go to next question
            app.nextQuestion = setTimeout(app.startGame, 5000);

        } else {
            // if wrong or not answered
            console.log("that's wrong");

            // show correct answer
            app.$rightAnswerP.removeClass("hide");
            app.$rightAnswer.text(app.currentAnswer);


            if (app.$chosenAnswer === "") { // you didn't answer
                // add 1 to # of unanswered answers
                app.unanswered++;

                // follow up screen display
                app.$rwMessage.text("Time's Up!");
                console.log("unanswered: " + app.unanswered);
            } else { // you got it wrong
                // add 1 to # of wrong answers
                app.wrong++;

                // follow up screen display
                app.$rwMessage.text("Bugger!"); // Bollocks ? // Bugger ? // Bloody hell ?
                console.log("wrong: " + app.wrong);
            }

            var random = Math.floor(Math.random() * app.wrongGifs.length);
            app.$imgMessage.attr("src", app.wrongGifs[random]);

            // hold screen for 5 seconds, then go to next question
            app.nextQuestion = setTimeout(app.startGame, 5000);
        }

        // reset chosen answer each time so it can tell if unanswered
        app.$chosenAnswer = "";
    },

    endScreen: function () {
        // hide timer
        app.$timerSection.addClass("hide");

        // hide message area
        app.$message.addClass("hide");

        // show end screen section
        app.$endScreen.removeClass("hide");
        // pull right, wrong, unanswered #s
        app.$right.text(app.right + "/" + app.numOfQuestions);
        app.$wrong.text(app.wrong + "/" + app.numOfQuestions);
        app.$unanswered.text(app.unanswered + "/" + app.numOfQuestions);

    }


};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


$(document).ready(function () {

    // start button
    app.$startBtn.on("click", function() {
        app.numOfQuestions = app.trivia.length; // save initial total number of questions
        app.startGame();

    });


    // click answer
    app.$possibleAnswers.on("click", function() {
        app.$chosenAnswer = $(this);

        app.answerScreen();

    });


    app.$startOverBtn.on("click", function() {
        // move array of questions already used back to reg array, clear already used questions array
        app.trivia = app.usedQuestions;
        app.usedQuestions = [];

        // reset wins count
        app.right = 0;
        app.wrong = 0;
        app.unanswered = 0;

        // start over game
        app.startGame();
    });


});
