import React, { useEffect } from 'react';

const WrongAnswerModal = ({ timer, setTimer, closeModal }) => {
    useEffect(() => {
        if (timer === 0) {
            closeModal();
            return;
        }

        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer, closeModal, setTimer]);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2 id='h2-modal'>Wrong Answer, go study...</h2>
                <div className='image-container'>
                    <img src="/go-study.png" alt="Finish Line" className="responsive-image" />
                </div>
                <div className='reading-suggestion-container'>
                    <a href='https://scrumguides.org/scrum-guide.html' target="_blank">Click for suggested reading</a>
                </div>
                <p className='timer'>{Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}</p>
            </div>
        </div >
    );
};

export default WrongAnswerModal;