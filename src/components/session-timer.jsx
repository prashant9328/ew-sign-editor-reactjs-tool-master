import React, {useState, useEffect} from 'react';

export default function SessionTimer({ timeInSeconds, onSessionExpired }) {
    const [timeLeft, setTimeLeft] = useState(timeInSeconds); // Unit is in seconds

    useEffect(() => {
      const timer = setInterval(() => {     
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer); // Clear the timer when time is up
            onSessionExpired();
            return 0;
          }
          return prevTime - 1; // Decrease time left by 1 second
        });
      }, 1000);
  
      // Cleanup the timer when the component unmounts
      return () => {
        clearInterval(timer);
      }
    }, []);
  
    const formatTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
  
      return {
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      };
    };
  
    const { hours, minutes, seconds } = formatTime(timeLeft);
  
    return (    
      <div className="tools-title">
        <p>Session</p>
        <div style={{ fontSize: "20px" }}>
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
    );
}