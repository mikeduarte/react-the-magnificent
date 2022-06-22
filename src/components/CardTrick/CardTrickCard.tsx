
interface CardTrickCardProps {
    card: string
}

const CardTrickCard = ({ card } : CardTrickCardProps) => {
  return (
    <div className="card-trick__card-inner js-card-inner">
        <div className="card-trick__card-front">
            <img src={`/imgs/cards/${card}.svg`} alt=""/>
        </div>
        <div className="card-trick__card-back">
            <img src="/imgs/cards/back.svg" alt="" />
        </div>
    </div>
  )
}

export default CardTrickCard