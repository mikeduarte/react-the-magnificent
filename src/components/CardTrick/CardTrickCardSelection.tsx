import React, { useState, useEffect, useRef, memo } from 'react'

import { getRandomOffset } from './CardTrick';
import CardTrickCard from './CardTrickCard';
import CardTrickDialog from './CardTrickDialog';
import { Instructions } from './types';

interface CardTrickCardSelectionProps {
    selectedCard: string,
    complete: () => void
}

const instructions : Instructions = {
    0: {
        title:  "Please select 3 cards to remove.",
        message: "Your card is one of the four cards you see in front of you. I will guide your hand when you are ready!",
        button: "Ok, I'm ready!"
    }
}

const ANIMATION_TIME = 2000;

const CardTrickCardSelection = ({ selectedCard, complete } : CardTrickCardSelectionProps ) => {
    const cardRefs = useRef<HTMLDivElement[] | null>([]);
    const cardsRemaining = useRef(4);
    const cards = useRef([false, false, false, false]);
    const [openDialog, setOpenDialog] = useState(false);
    const canChoose = useRef(false);

    useEffect(() => {
        setTimeout(() =>{
            animateDealCards();
            setTimeout(() => {
                setOpenDialog(true);
            }, ANIMATION_TIME)
        }, 200);
    }, [])

    const animateElimination = (index: number) => {
        const card = cardRefs.current![index];
        let direction = '-';
        if (index > 1) direction = '';
        card.style.transitionDelay = '0s';
        card.style.transitionDuration = '.5s';
        card.style.transform = `translate3d(0, ${direction}200vh, 0)`;
        card.style.opacity = '0';
    }

    const animateCardReveal = () => {
        const cardRemainingIndex = cards.current.findIndex(card => !card);
        const card = cardRefs.current![cardRemainingIndex]
        card.style.transitionDelay = '0s';
        card.style.transform = 'translate3d(-50%, -50%, 0) scale(1.25, 1.25)';
        card.style.left = '50%';
        card.style.top = '50%';
        card.classList.add('animate-card-reveal');
    }

    const animateDealCards = () => {
        
        cardRefs.current!.forEach((card: HTMLDivElement, index: number) => {
            let y = 0;
            let xOffset = Math.floor(index%2) + 1;
            if (index >= 2) {
                y = 1;
            }
            let left = (25* xOffset + 25/2);
            card.style.transform = `translate3d(0, ${120*y}%, 0) rotateZ(${getRandomOffset(2)}deg)`;
            card.style.transitionDelay = `${.3*(index + 1)}s`;
            card.style.left = `${left - getRandomOffset(1.2)}%`;
            card.style.top = '0';
            card.style.zIndex = `${2 + index}`;
        })

    }

    const onCardSelection = (index: number) => {
        if (cardsRemaining.current === 1 || !canChoose.current) return;
        cardsRemaining.current = cardsRemaining.current - 1;
        cards.current[index] = true;
        if (cardsRemaining.current === 1) {
            setTimeout(() => {
                animateCardReveal();

                setTimeout(() => {
                    complete();
                }, 5000)

            }, 500)
        }
        animateElimination(index);
    }

    const addElementRef = (el: HTMLDivElement, index: number) => {
        cardRefs.current![index] = el;
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        canChoose.current = true;
    }

    return (
        <>
            <CardTrickDialog open={openDialog} close={handleCloseDialog} content={instructions[0]}/>
            <div className="card-trick__cards">
                {cards.current.map((card, index) => {
                    return (
                        <div key={index} 
                            className="card-trick__card"
                            ref={(el:HTMLDivElement) => addElementRef(el, index)}
                            onClick={e => onCardSelection(index)}>
                            <CardTrickCard card={selectedCard}/>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default memo(CardTrickCardSelection)