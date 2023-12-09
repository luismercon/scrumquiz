'use client';
import React, { useState } from 'react';
import { quiz } from '../new_data';
import confetti from 'canvas-confetti';
import WrongAnswerModal from '../components/WrongAnswerModal'

const page = () => {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState({ score: 0, correctAnswers: 0, wrongAnswers: 0 });
    const [showWrongAnswerModal, setShowWrongAnswerModal] = useState(false);
    const [timer, setTimer] = useState(120); // 2 minutes in seconds

    const { question, answers, correctAnswer } = quiz.questions[activeQuestion];

    const handleAnswerSelection = (answer, index) => {
        setSelectedAnswerIndex(index);
        const isCorrect = answer === correctAnswer;
        setSelectedAnswer(isCorrect);

        if (isCorrect) {
            confetti({ particleCount: 200, spread: 170, origin: { y: 0.6 } });
        }

        if (!isCorrect) {
            setShowWrongAnswerModal(true);
            setTimer(120); // Reset timer to 2 minutes
        }

        updateResult(isCorrect);
    };

    const updateResult = (isCorrect) => {
        setResult((prev) => ({
            ...prev,
            score: isCorrect ? prev.score + 1 : prev.score,
            correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1
        }));
    };

    const goToNextQuestion = () => {
        const isLastQuestion = activeQuestion === quiz.questions.length - 1;
        if (isLastQuestion) {
            setShowResult(true);
            setActiveQuestion(0);
        } else {
            setActiveQuestion((prev) => prev + 1);
        }
        setSelectedAnswer(false);
        setSelectedAnswerIndex(null);
    };

    return (
        <div className="container">
            <h1>Quiz Page</h1>
            {!showResult ? <Quiz activeQuestion={activeQuestion} question={question} answers={answers} selectedAnswer={selectedAnswer} selectedAnswerIndex={selectedAnswerIndex} handleAnswerSelection={handleAnswerSelection} goToNextQuestion={goToNextQuestion} /> : <Results result={result} />}
            {showWrongAnswerModal && <WrongAnswerModal timer={timer} setTimer={setTimer} closeModal={() => setShowWrongAnswerModal(false)} />}
        </div>
    );
};

const Quiz = ({ activeQuestion, question, answers, selectedAnswer, selectedAnswerIndex, handleAnswerSelection, goToNextQuestion }) => (
    <div>
        <h2>
            Question: {activeQuestion + 1}
            <span>/{quiz.questions.length}</span>
        </h2>
        <div className="quiz-container">
            <h3>{question}</h3>
            {answers.map((answer, idx) => (
                <li key={idx}
                    onClick={() => handleAnswerSelection(answer, idx)}
                    className={selectedAnswerIndex === idx ? 'li-selected' : 'li-hover'}
                    style={{
                        backgroundColor: selectedAnswer && answer === answers[selectedAnswerIndex] ? 'green' : 'transparent',
                        color: selectedAnswer && answer === answers[selectedAnswerIndex] ? 'white' : '#000105'
                    }}>
                    {answer}
                </li>
            ))}
            {selectedAnswer && (
                <button onClick={goToNextQuestion} className="btn">
                    {activeQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
                </button>
            )}
        </div>
    </div>
);

const Results = ({ result }) => (
    <div className="quiz-container">
        <h3>Welcome to the finish line!</h3>
        <img src="/finish_line2.png" alt="Finish Line" className="responsive-image" />
        <button onClick={() => window.location.reload()}>Restart</button>
    </div>
);

export default page;
