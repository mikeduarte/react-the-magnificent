import React, { useState, useEffect, useRef, memo } from 'react'

import { getRandomOffset } from './CardTrick';
import CardTrickCard from './CardTrickCard';
import CardTrickDialog from './CardTrickDialog';
import { Instructions } from './types';

interface CardTrickPileSelectionProps {
    cardSet: string[]
    complete: () => void
}

const instructions : Instructions = {
    0: {
        title:  "Please select four piles to remove.",
        message:  "Your card is in one of the following piles. I've implanted into your consciousness the pile you should <i><b>not</b></i> remove.",
        button: "Ok!"
    }
}

const ANIMATION_TIME = 6000;

const CardTrickPileSelection = ({ cardSet, complete } : CardTrickPileSelectionProps) => {
    const pileRefs = useRef<HTMLDivElement[][] | null>([]);
    const pilesRemaining = useRef(5);
    const piles = useRef([false, false, false, false, false]);
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

    const animateElimination = (pile: number) => {
        const cards = pileRefs.current![pile];
        let direction = '-';
        if (pile > 2) direction = '';

        cards.forEach(card => {
            card.style.transitionDelay = '0s';
            card.style.transitionDuration = '.5s';
            card.style.transform = `translate3d(0, ${direction}200vh, 0)`;
            card.style.opacity = '0';
        })
    }

    const animateToStartingPosition = () => {
        const pileRemainingIndex = piles.current.findIndex(pile => !pile);
        const cards = pileRefs.current![pileRemainingIndex]
        cards.forEach(card => {
            card.removeAttribute('style');
        })
        setTimeout(() => {
            complete();
        }, 1000);

    }

    const animateDealCards = () => {
        
        pileRefs.current!.forEach((cards: HTMLDivElement[], index: number) => {
            let y = 0;
            let x = index + 1;
            if (x >= 4) {
                x = x - 3;
                y = 1;
            }
            let left = 25 * x;
            if (y === 1) {
                left = (25* x + 25/2);
            }
            cards.forEach((card, cardIndex) => {
                card.style.transform = `translate3d(0, ${120*y}%, 0) rotateZ(${getRandomOffset(3)}deg)`;
                card.style.transitionDelay = `${.25*((index * 4 + cardIndex) + 1)}s`;
                card.style.left = `${left - getRandomOffset(1.2)}%`;
                card.style.top = '0';
                card.style.zIndex = `${2 + (index * 4 + cardIndex)}`;
            })
        })

    }

    const onPileSelection = (index: number) => {

        if (!canChoose.current) return;

        let pile = Math.floor(index/4);
        if (pile === 5) pile = 4;
        if (pilesRemaining.current === 1) return;
        pilesRemaining.current = pilesRemaining.current - 1;
        piles.current[pile] = true;

        if (pilesRemaining.current === 1) {
            setTimeout(() => {
                animateToStartingPosition();
            }, 500)
        }

        animateElimination(pile);
    }

    const addElementRef = (el: HTMLDivElement, index: number) => {
        let pile = Math.floor(index/4);
        if (el === null) return;
        if (pile === 5) pile = 4;
        let cardIndex = index - 4 * pile;
        if (!pileRefs.current![pile]) {
            pileRefs.current![pile] = [el];
        }
        else {
            pileRefs.current![pile][cardIndex] = el;
        }
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        canChoose.current = true;
    }

    return (
        <>
            <CardTrickDialog open={openDialog} close={handleCloseDialog} content={instructions[0]}/> 
            <div className="card-trick__cards">
                {cardSet.map((card, index) => {
                    return (
                        <div key={card} 
                            className="card-trick__card"
                            ref={(el:HTMLDivElement) => addElementRef(el, index)}
                            onClick={e => onPileSelection(index)}>
                            <CardTrickCard card={card} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default memo(CardTrickPileSelection)