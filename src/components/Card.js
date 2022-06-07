import './Card.css';

// ! props being destructured from props object
const Card = ({ card, handleChoice, flipped, disabled }) => {
  const cardClick = () => {
    if (!disabled)
      handleChoice(card);
  };

  return (
	<div className="card">
        <div className={flipped ? "flipped": ""}>
            <img src={card.src} className="front" alt="card front" />
            <img 
              src="/img/cover.png" 
              className="back" 
              alt="card back" 
              onClick={cardClick} 
            />
        </div>
    </div>
  )
}

export default Card;