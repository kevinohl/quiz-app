import React from "react";
import "./App.css";
import Question from "./Question";
import Shuffle from "fisher-yates";
import { nanoid } from "nanoid";

function App() {
  const [questions, setQuestions] = React.useState([]);
  const [endGame, setEndGame] = React.useState(false);

  function unescapeHTML(str) {
    return str
      .replace(/(&quot;)/g, '"')
      .replace(/&#039;/g, "'".replace(/&eacute;/g, "é").replace(/&reg;/g, "®"));
  }

  React.useEffect(() => {
    async function getQuestions() {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&category=15&difficulty=medium&type=multiple"
      );
      const data = await res.json();
      const questionObjects = await data.results.map((entry) => ({
        id: nanoid(),
        question: unescapeHTML(entry.question),
        correctAnswer: unescapeHTML(entry.correct_answer),
        allAnswers: Shuffle(
          entry.incorrect_answers
            .map((answer) => unescapeHTML(answer))
            .concat([unescapeHTML(entry.correct_answer)])
        ),
      }));
      await setQuestions(questionObjects);
    }
    getQuestions();
  }, [endGame]);

  function newQuestions() {
    setEndGame(!endGame);
  }

  function handleAnswer(buttonId, questionId) {
    const clickedButton = document.getElementById(buttonId);
    const correctAnswer = questions.filter(
      (entry) => entry.id === questionId
    )[0].correctAnswer;

    // Iterate over all answer buttons and disable them.
    // Mark the correct answer.
    const currentListItems =
      document.getElementById(questionId).children[1].children;
    for (let i = 0; i < currentListItems.length; i++) {
      const currentButton = currentListItems[i].children[0];
      currentButton.disabled = true;
      if (currentButton.innerHTML === correctAnswer)
        currentButton.classList.add("right");
    }
    if (clickedButton.innerHTML !== correctAnswer) {
      clickedButton.classList.add("wrong");
    }
  }

  const questionElements = questions.map((question) => {
    return (
      <Question
        question={question.question}
        allAnswers={question.allAnswers}
        key={question.id}
        id={question.id}
        onClick={handleAnswer}
      />
    );
  });

  return (
    <>
      <h1>It's-a me, Quizario!</h1>
      <div className="question-container">{questionElements}</div>
      <div className="evaluation-container">
        <button className="ng-button" onClick={newQuestions}>
          Play again
        </button>
      </div>
    </>
  );
}

export default App;
