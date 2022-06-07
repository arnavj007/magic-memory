import './App.css';
import Card from './Card';
import { useEffect, useState } from 'react';

// ! card image srcs stored in normal array outside of component as constant, also this way no re-renders on component re-eval
// ! matched property added to the cards, used as matched cards should remain flipped [visible]
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false }
];

const App = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // shuffle cards
  // * cards are duplicated using the spread operator, used twice
  // * cards are shuffled using sort function BUT with random comparison function
  // * cards are then assigned id using the map function
  const setUpGame = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5) // ! works as outputs [-0.5, 0.5] i.e. less than, equal, or greater than 0
      .map((card) => { 
        return { ...card, id:  Math.random() }; // ! adds random id to each card 
      })

    setChoice1(null);
    setChoice2(null);
    setCards(shuffledCards); // * updating the state with the shuffled cards
    setTurns(0); // ! function always called on new game, i.e. turns should be 0
  }

  // handle a choice
  const handleChoice = (card) => {
    choice1 ? setChoice2(card) : setChoice1(card);
  };

  // compare choices
  // * if choice1 not null [1st choice made] set choice2, else choice1 set [null i.e. no choice made]
  // * don't have to handle duplicate choice as card will flip on selection i.e. back hidden
  // * when both choices made, compare choices using src, then in case of match, update cards state
  // * for cards matching the choice id's, set matched property to true, for remaining retain card
  // * during the comparision we disable the cards, so more than 2 cards dont get selected causing confusion
  useEffect(() => {
    if (choice1 && choice2) {
      setDisabled(true); // ! cards disabled once both choices made 
      if (choice1.src === choice2.src)
        setCards(cards.map((card) => (card.id === choice1.id || card.id === choice2.id) ? { ...card, matched: true } : card));

      setTimeout(() => resetTurn(), 1000); // ! reset turn after 1 second [delay to display cards temporarily]
    }
  }, [choice1, choice2]);
  // ! we must use useEffect hook for comparison and NOT just keep comparison logic within 'handleChoice' function
  // ! this is because the 'setState()' methods are asynchronous and the statements in function will run BEFORE state update
  // ! this will result in choice not being set, so we use the useEffect hook and keep choices as dependencies

  // reset turn
  const resetTurn = () => {
    setChoice1(null);
    setChoice2(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false); // ! cards enabled after turn reset
  };

  // start new game automatically on opening the page
  useEffect(() => {
    setUpGame();
  }, []); // ! empty depenedency array to only run once on component mount

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={setUpGame}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <Card 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice} 
            flipped={card === choice1 || card === choice2 || card.matched}
            disabled={disabled} 
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
    </div>
  );
}

// * flipped property dictates whether card should be VISIBLE
// * this is true in 3 scenarios: card is choice1 or choice2, or card is matched

export default App;