import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function SessionTimer({ expiryTimestamp, onSessionExpired }) {
    const {
        seconds,
        minutes,
        hours
    } = useTimer({ expiryTimestamp, onExpire: () => onSessionExpired() });


    return (
    <div className="tools-title">
        <p>Session</p>
        <div style={{fontSize: '20px'}}>
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
    </div>
    );
}