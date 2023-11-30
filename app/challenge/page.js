'use client';
import React, { useState } from 'react';
import { quiz } from '../data-challenge';
import './style.css'

const page = () => {

    const [isStarted, setStart] = useState(false);

    const [activeQuestion, setActiveQuestion] = useState(0);
    const [playerOne, setPlayerOne] = useState({ score: 0, selectedAnswerIndex: null, answered: false });
    const [playerTwo, setPlayerTwo] = useState({ score: 0, selectedAnswerIndex: null, answered: false });
    const [showResult, setShowResult] = useState(false);
    const [allowAnswer, setAllowAnswer] = useState(true);

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

        setAllowAnswer(false);
        setTimeout(() => {
            goToNextQuestion();
            setAllowAnswer(true);
        }, 2000);
    };


    const goToNextQuestion = () => {
        const isLastQuestion = activeQuestion === quiz.questions.length - 1;
        if (isLastQuestion) {
            setShowResult(true);
        } else {
            setActiveQuestion((prev) => prev + 1);
            setPlayerOne({ ...playerOne, selectedAnswerIndex: null, answered: false });
            setPlayerTwo({ ...playerTwo, selectedAnswerIndex: null, answered: false });
        }
    };

    return (
        <div className="container">

            {
                !isStarted &&
                <button onClick={() => handleStart()}>Start</button>
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

const QuizSection = ({ player, playerData, activeQuestion, question, answers, correctAnswer, handleAnswerSelection }) => (
    <div className={`quiz-section ${player}`}>
        <h2>Question: {activeQuestion + 1}/{quiz.questions.length}</h2>
        <h3>{question}</h3>
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
    </div>
);

const Results = ({ playerOne, playerTwo }) => {
    const playerOneWon = playerOne.score > playerTwo.score;

    return (
        <div className="results-container">
            {/* Winner's Result */}
            <div className={`result winner ${playerOneWon ? "playerOne" : "playerTwo"}`} style={{ backgroundColor: 'green' }}>
                <h4>{playerOneWon ? "Player One" : "Player Two"} Wins!</h4>
                <p>Player One Score: {playerOne.score}</p>
                <p>Player Two Score: {playerTwo.score}</p>
            </div>

            {/* Loser's Result */}
            <div className={`result loser ${playerOneWon ? "playerTwo" : "playerOne"}`} style={{ backgroundColor: 'red' }}>
                <h4>{playerOneWon ? "Player Two" : "Player One"} Loses</h4>
                <p>Player One Score: {playerOne.score}</p>
                <p>Player Two Score: {playerTwo.score}</p>
            </div>
        </div>
    );
};


export default page;
