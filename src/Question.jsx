import { nanoid } from "nanoid";

export default function Question(props) {
  const listElements = props.allAnswers.map((answer) => {
    const buttonId = nanoid(); 
    return (
      <li key={buttonId}>
        <button id={buttonId} onClick={() => props.onClick(buttonId, props.id)}>{answer && answer}</button>
      </li>
    );
  });
  return (
    <div className="question" id={props.id}>
      <h3>{props.question}</h3>
      <ul>{listElements}</ul>
      <hr></hr>
    </div>
  );
}
