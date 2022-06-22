import { useEffect, useState, useRef, useCallback } from 'react'

import CardTrickColumnSelection from './CardTrickColumnSelection';
import CardTrickPileSelection from './CardTrickPileSelection';
import CardTrickCardSelection from './CardTrickCardSelection';

import './CardTrick.scss';

const suites = ['H', 'D', 'S', 'C'];
const cardValues = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K'
]

const cards: string[] = [];
suites.forEach(suite => {
    cards.push(...cardValues.map(value => value+suite))
})

const shuffleCards = () => {
    for (let i = cards.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cards[i];
        cards[i] = cards[j];
        cards[j] = temp;
    }
    return [...cards];
}

const getRandomOffset = (limiter: number) => {
    return ((Math.random() - 0.5) * limiter);
}

const CardTrick = () => {
    const [shuffledCards, setShuffledCards] = useState(cards);
    const cardTrick = useRef<HTMLDivElement>(null);
    const [startColumnSelection, setStartColumnSelection] = useState(false);
    const [startPileSelection, setStartPileSelection] = useState(false);
    const [startCardSelection, setStartCardSelection] = useState(false);
    const selectedCard = useRef<string>('');

    useEffect(() => {
        let startingCards = shuffleCards();
        startingCards = startingCards.slice(0, 21);
        setShuffledCards(startingCards);
        setTimeout(() => {
            setStartColumnSelection(true);
        }, 200)
    }, [])
    

    const onColumnSelectionComplete = useCallback((card: string) => {
        selectedCard.current = card;
        setStartPileSelection(true);
        setTimeout(() => {
            setStartColumnSelection(false);
        }, 200);
    }, []);

    const onPileSelectionComplete = useCallback(() => {
        setStartCardSelection(true);
        setTimeout(() => {
            setStartPileSelection(false);
        }, 200);
    }, []);

    const onCardSelectionComplte = useCallback(() => {
        selectedCard.current = '';
        setStartCardSelection(false);
        let startingCards = shuffleCards();
        startingCards = startingCards.slice(0, 21);
        setShuffledCards(startingCards);
        setTimeout(() => {
            setStartColumnSelection(true);
        }, 200)
    }, [])

    return (
        <div className="card-trick" ref={cardTrick}>
            {startColumnSelection && <CardTrickColumnSelection cardSet={shuffledCards} complete={onColumnSelectionComplete}/>}
            {startPileSelection && <CardTrickPileSelection cardSet={shuffledCards} complete={onPileSelectionComplete}/>}
            {startCardSelection && <CardTrickCardSelection selectedCard={selectedCard.current} complete={onCardSelectionComplte}/>}
        </div>
    )
}

export default CardTrick
export { getRandomOffset }