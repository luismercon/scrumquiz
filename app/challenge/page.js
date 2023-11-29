'use client';
import React, { useState } from 'react';

const page = () => {

    const [isStarted, setStart] = useState(false);

    const handleStart = () => {
        setStart(true);
    }


    return (
        <div className="container">
            <h1>Challenge Page</h1>
            {
                !isStarted &&
                <button onClick={() => handleStart()}>Start</button>
            }
            {
                isStarted &&
                <div>
                    <h2>Game Space</h2>
                </div>
            }

        </div>

    )

}

export default page;
