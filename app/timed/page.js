'use client';
import React, { useState } from 'react';
import Link from "next/link"
import { quiz } from '../data-challenge';
import './style.css'

const page = () => {

    const [isStarted, setStart] = useState(false);

    const [activeQuestion, setActiveQuestion] = useState(0);
    const [playerOne, setPlayerOne] = useState({ score: 0, selectedAnswerIndex: null, answered: false });
    const [playerTwo, setPlayerTwo] = useState({ score: 0, selectedAnswerIndex: null, answered: false });
    const [showResult, setShowResult] = useState(false);
    const [wrongAnswerIndex, setWrongAnswerIndex] = useState(null);
    const [timeoutId, setTimeoutId] = useState(null);


    console.log("Updated Player One:", playerOne);
    console.log("Updated Player Two:", playerTwo);


    const { question, answers, correctAnswer } = quiz.questions[activeQuestion];

    const handleStart = () => {
        setStart(true);
    }

    const handleAnswerSelection = (answer, index, player) => {
        const isCorrect = answer === correctAnswer;

        if ((player === "playerOne" && playerOne.disabled) || (player === "playerTwo" && playerTwo.disabled)) {
            return;
        }

        let updatedPlayerOne = { ...playerOne };
        let updatedPlayerTwo = { ...playerTwo };

        if (player === "playerOne") {
            updatedPlayerOne = { ...playerOne, selectedAnswerIndex: index, answered: true };
            if (!isCorrect) {
                updatedPlayerOne.score -= 1;
                updatedPlayerOne.disabled = true;
            } else {
                updatedPlayerOne.score += 2;
            }
        } else if (player === "playerTwo") {
            updatedPlayerTwo = { ...playerTwo, selectedAnswerIndex: index, answered: true };
            if (!isCorrect) {
                updatedPlayerTwo.score -= 1;
                updatedPlayerTwo.disabled = true;
            } else {
                updatedPlayerTwo.score += 2;
            }
        }

        setPlayerOne(updatedPlayerOne);
        setPlayerTwo(updatedPlayerTwo);

        setWrongAnswerIndex(isCorrect ? null : index);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            goToNextQuestion();
        }, isCorrect ? 2000 : 10000);

        setTimeoutId(newTimeoutId);
    };


    const goToNextQuestion = () => {
        const isLastQuestion = activeQuestion === quiz.questions.length - 1;
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setActiveQuestion((prev) => prev + 1);
            setPlayerOne(prevState => ({ ...prevState, selectedAnswerIndex: null, answered: false, disabled: false }));
            setPlayerTwo(prevState => ({ ...prevState, selectedAnswerIndex: null, answered: false, disabled: false }));
            setWrongAnswerIndex(null);
        }

        setTimeoutId(null);
    };





    return (
        <div className="container">

            {
                !isStarted &&
                <div>
                    <p className='how-to-play'>Instructions ....
                    </p>
                    <button onClick={() => handleStart()}>Start</button>
                </div>
            }
            {
                isStarted &&
                <div className="container-in">
                    {!showResult ? (
                        <div className="quiz-container">
                            <QuizSection
                                player="playerOne"
                                playerData={playerOne}
                                opponentData={playerTwo}
                                activeQuestion={activeQuestion}
                                question={question}
                                answers={answers}
                                correctAnswer={correctAnswer}
                                handleAnswerSelection={handleAnswerSelection}
                                wrongAnswerIndex={wrongAnswerIndex}
                            />
                            <QuizSection
                                player="playerTwo"
                                playerData={playerTwo}
                                opponentData={playerOne}
                                activeQuestion={activeQuestion}
                                question={question}
                                answers={answers}
                                correctAnswer={correctAnswer}
                                handleAnswerSelection={handleAnswerSelection}
                                wrongAnswerIndex={wrongAnswerIndex}
                            />
                        </div>
                    ) : (
                        <Results playerOne={playerOne} playerTwo={playerTwo} />
                    )}
                </div>
            }

        </div>

    )

}

const QuizSection = ({ player, playerData, opponentData, activeQuestion, question, answers, correctAnswer, handleAnswerSelection, wrongAnswerIndex }) => {

    return (
        <div className={`quiz-section ${player}`}>

            <h3>{question}</h3>
            <span>Question: {activeQuestion + 1}/{quiz.questions.length}</span>
            <ul>
                {answers.map((answer, idx) => {
                    const isSelectedByPlayer = playerData.selectedAnswerIndex === idx;
                    const isSelectedByOpponent = opponentData.selectedAnswerIndex === idx;
                    const isSelectedCorrectly = answer === correctAnswer;

                    let backgroundColor;
                    if (isSelectedByPlayer) {
                        backgroundColor = isSelectedCorrectly ? 'green' : 'red';
                    } else if (isSelectedByOpponent && isSelectedCorrectly) {
                        console.log("NEVER ENTERS HERES")
                        backgroundColor = 'gray';
                    } else {
                        backgroundColor = 'transparent';
                    }

                    return (
                        <li key={idx}
                            className={isSelectedByPlayer ? 'selected' : ''}
                            onClick={() => !playerData.disabled && handleAnswerSelection(answer, idx, player)}
                            style={{ backgroundColor }}>
                            {answer}
                        </li>
                    );
                })}
            </ul>
        </div >
    );
}



const Results = ({ playerOne, playerTwo }) => {
    const isDraw = playerOne.score === playerTwo.score;

    const playerOneColor = isDraw ? 'black' : (playerOne.score > playerTwo.score ? 'green' : 'red');
    const playerTwoColor = isDraw ? 'black' : (playerOne.score < playerTwo.score ? 'green' : 'red');

    return (
        <div className="results-container">
            {/* Player One's Result */}
            <div className="result playerOne" style={{ backgroundColor: playerOneColor }}>
                <h4>{isDraw ? "It's a Draw" : playerOne.score > playerTwo.score ? "Player One Wins!" : "Player One Loses"}</h4>
                <p>Player One Score: {playerOne.score}</p>
                <p>Player Two Score: {playerTwo.score}</p>
                <Link href='/'>
                    <button>Play Again</button>
                </Link>
            </div>

            {/* Player Two's Result */}
            <div className="result playerTwo" style={{ backgroundColor: playerTwoColor }}>
                <h4>{isDraw ? "It's a Draw" : playerOne.score < playerTwo.score ? "Player Two Wins!" : "Player Two Loses"}</h4>
                <p>Player One Score: {playerOne.score}</p>
                <p>Player Two Score: {playerTwo.score}</p>
                <Link href='/'>
                    <button>Play Again</button>
                </Link>
            </div>
        </div>
    );
};




export default page;
