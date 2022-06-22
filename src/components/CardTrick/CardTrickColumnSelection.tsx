import React, { useState, useEffect, useRef, memo } from 'react'

import { getRandomOffset } from './CardTrick';
import CardTrickCard from './CardTrickCard';
import CardTrickDialog from './CardTrickDialog';
import { Instructions } from './types';

interface CardTrickColumnSelectionProps {
    cardSet: string[]
    complete: (card: string) => void;
}

const instructions : Instructions = {
    0: {
        title: "Pick a card and <i>React the Magnificent</i> will try to guess your card!",
        message: "Choose one card shown on your screen and keep it a secret. When you are ready, please tell <i>React the Magnificent</i> which column it is in.",
        button: "Ok, I'm ready!"
    },
    1: {
        title: "You have unusual brain patterns which is making this difficult!",
        message: "Please tell me which column your card is in now so that I may continue to calibrate.",
        button: "Ok"
    },
    2: {
        title: "Are you clicking the screen hard enough?",
        message: "Which column is it in now?</>",
        button: "Ok"
    },
    3: {
        title: "Hmmm... The signal is really faint!",
        message: "Do you have a good network connection? One more time, please",
        button: "Ok"
    }
}

const ANIMATION_TIME = 5000;

const CardTrickColumnSelection = ({ cardSet, complete } : CardTrickColumnSelectionProps) => {

    const [cards, setCards] = useState(cardSet);
    const cardRefs = useRef<HTMLDivElement[] | null>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const canChoose = useRef(false);
    const [dialogContent, setDialogContent] = useState(instructions[0]);
    const lastPickedCard = useRef('');
    const colPickCount = useRef(0);

    useEffect(() => {
        setTimeout(() =>{
            animateDealCards();
            setTimeout(() => {
                setOpenDialog(true);
            }, ANIMATION_TIME)
        }, 200);
    }, [])

    const nextDialog = () => {
        if (colPickCount.current > 0) {
            setDialogContent(instructions[colPickCount.current] || instructions[3]);
        }
        
        setTimeout(() => {
            setOpenDialog(true);
        }, ANIMATION_TIME)
    }

    const onColumnSelection = (index: number) => {

        if (!canChoose.current) return;

        canChoose.current = false;

        const newCards: string[] = [];
        const tempCol1 = [];
        const tempCol2 = [];
        const tempCol3 = [];
        const len = cards.length;
        const col = Math.floor(index%3);
        let startCol = col + 1;
        if (startCol > 2)  startCol = 0;
        const lastColumn = 3 - (startCol + col);

        for (let i = startCol; i < len; i += 3) {
            let card = cards[i];
            tempCol1.push(card)
        }

        for (let i = col; i < len; i += 3) {
            let card = cards[i];
            tempCol2.push(card)
        }
        
        for (let i = lastColumn; i < len; i += 3) {
            let card = cards[i];
            tempCol3.push(card)
        }

        newCards.push(...tempCol3, ...tempCol2, ...tempCol1);
        

        if (lastPickedCard.current === newCards[10] && colPickCount.current >= 2) {
            animateCollectCards(newCards, true);
            return;
       }

       colPickCount.current++;
       lastPickedCard.current = newCards[10];
       animateCollectCards(newCards, false);

    }

    const animateDealCards = () => {

        cardRefs.current!.forEach((card: HTMLDivElement, index: number) => {
            const row = Math.floor(index/3);
            const col = Math.floor(index%3) + 1;
            const cardInner: HTMLDivElement = card.querySelector('.js-card-inner')!;
            card.style.transform = `translate3d(0, ${25*row}%, 0) rotateZ(${getRandomOffset(3)}deg)`;
            card.style.transitionDelay = `${.22*(index + 1)}s`;
            card.style.left = `${(25 * col) - getRandomOffset(1.2)}%`;
            card.style.top = '0';
            card.style.zIndex = `${2 + index}`;
            cardInner.style.transitionDelay =`${.22*(index+1)}s`;
            cardInner.style.transform = `rotateY(180deg)`;
        })

    }

    const animateCollectCards = (newCards: string[], isComplete: boolean) => {

        cardRefs.current!.forEach((card: HTMLDivElement, index: number) => {
            const col = Math.floor(index%3) + 1;
            const cardInner: HTMLDivElement = card.querySelector('.js-card-inner')!;
            card.style.transform = `translate3d(0, -100%, 0) rotateZ(${getRandomOffset(3)}deg)`;
            card.style.transitionDelay = `${.2 * col}s`;
            card.style.left = `${(25 * col) - getRandomOffset(1.2)}%`;
            card.style.top =  '100%';
            card.style.zIndex = `${2 + index}`;
            cardInner.style.transitionDelay = `${.2 * 6}s`;
            cardInner.style.transform = `rotateY(0)`;
        });

        setTimeout(() => {
            animateToStart();

            setTimeout(() => {  
                if (isComplete) {
                    complete(lastPickedCard.current);
                }
                else {
                    setCards(newCards);
                    setTimeout(() => {
                        animateDealCards();
                        nextDialog();
                    }, 500);
                }
            }, 800)

        }, 2000)

    }

    const animateToStart = () => {
        cardRefs.current!.forEach((card: HTMLDivElement) => {
            card.removeAttribute('style');
        });
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        canChoose.current = true;
    }

    return (
        <>
            <CardTrickDialog  open={openDialog} close={handleCloseDialog} content={dialogContent}/>
            <div className="card-trick__cards">
                {cards.map((card, index) => {
                    return (
                        <div key={card} 
                            className="card-trick__card"
                            ref={(el: HTMLDivElement) => cardRefs.current![index] = el}
                            onClick={e => onColumnSelection(index)}>
                            <CardTrickCard card={card}/>
                        </div>
                    )
                })}
            </div>
        </>
    )   
  
}

export default memo(CardTrickColumnSelection)