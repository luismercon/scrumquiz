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
    const [allowAnswer, setAllowAnswer] = useState(true);

    console.log("Updated Player One:", playerOne);
    console.log("Updated Player Two:", playerTwo);


    const { question, answers, correctAnswer } = quiz.questions[activeQuestion];

    const handleStart = () => {
        setStart(true);
    }

    const handleAnswerSelection = (answer, index, player) => {
        if (!allowAnswer) return;

        const isCorrect = answer === correctAnswer;
        let updatedPlayer = { selectedAnswerIndex: index, answered: true };

        if (player === "playerOne") {
            setPlayerOne({ ...playerOne, ...updatedPlayer, score: playerOne.score + (isCorrect ? 2 : -1) });
        } else {
            setPlayerTwo({ ...playerTwo, ...updatedPlayer, score: playerTwo.score + (isCorrect ? 2 : -1) });
        }

        let seconds = isCorrect ? 2000 : 10000

        setAllowAnswer(false);
        setTimeout(() => {
            goToNextQuestion();
            setAllowAnswer(true);
        }, seconds);
    };


    const goToNextQuestion = () => {
        const isLastQuestion = activeQuestion === quiz.questions.length - 1;
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setActiveQuestion((prev) => prev + 1);
            setPlayerOne(prevState => ({ ...prevState, selectedAnswerIndex: null, answered: false }));
            setPlayerTwo(prevState => ({ ...prevState, selectedAnswerIndex: null, answered: false }));
        }
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
                                activeQuestion={activeQuestion}
                                question={question}
                                answers={answers}
                                correctAnswer={correctAnswer}
                                handleAnswerSelection={handleAnswerSelection}
                            />
                            <QuizSection
                                player="playerTwo"
                                playerData={playerTwo}
                                activeQuestion={activeQuestion}
                                question={question}
                                answers={answers}
                                correctAnswer={correctAnswer}
                                handleAnswerSelection={handleAnswerSelection}
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

const QuizSection = ({ player, playerData, activeQuestion, question, answers, correctAnswer, handleAnswerSelection }) => {

    console.log("xxxxxxxxx", correctAnswer)

    return (
        <div className={`quiz-section ${player}`}>

            <h3>{question}</h3>
            <span>Question: {activeQuestion + 1}/{quiz.questions.length}</span>
            <ul>
                {answers.map((answer, idx) => (
                    <li key={idx}
                        className={playerData.selectedAnswerIndex === idx ? 'selected' : ''}
                        onClick={() => handleAnswerSelection(answer, idx, player)}
                        style={{ backgroundColor: playerData.selectedAnswerIndex === idx ? (answer === correctAnswer ? 'green' : 'red') : 'transparent' }}>
                        {answer}
                    </li>
                ))}
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
