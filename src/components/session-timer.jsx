import React, { useState, useEffect } from "react";

export default function SessionTimer({ onSessionExpired, onSessionClear }) {
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });
  // let sessionExtended = false
  const [sessionExtended,setSessionExtended] = useState(false);
  useEffect(() => {
    let expirationTime = localStorage.getItem("SessionTimer");

    if (expirationTime) {
      expirationTime = Number(expirationTime); 

      if (Date.now() >= expirationTime) {
        onSessionExpired(); 
      }
    } else {
      if(localStorage.getItem('Status')!=='Expired'){
        
        const newExpiration = Date.now() + 2 * 60 * 1000; 
        localStorage.setItem("SessionTimer", newExpiration);
        localStorage.setItem("Status", "Pending");
        expirationTime = newExpiration;
      }
    }

    const updateTimer = () => {
      const timeLeftMs = expirationTime - Date.now();
      console.log(timeLeftMs)
      if (timeLeftMs <= 1*60*1000) {
        if(timeLeftMs <=0){
          onSessionExpired();

          onSessionClear();
        }
        if(sessionExtended ===false){
          onSessionExpired();
          setSessionExtended(true);
        }
      const hours = Math.floor((timeLeftMs) / (1000 * 60 * 60));
      const minutes = Math.floor(((timeLeftMs) % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor(((timeLeftMs) % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
        return;
      }else{
        const hours = Math.floor((timeLeftMs-1*60) / (1000 * 60 * 60));
        const minutes = Math.floor(((timeLeftMs-1*60) % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor(((timeLeftMs-1*60) % (1000 * 60)) / 1000);
  
        setTimeLeft({
          hours: String(hours).padStart(2, "0"),
          minutes: String(minutes).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      }

    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [onSessionExpired]);

  return (
    <div className="tools-title">
      <p>Session</p>
      <div style={{ fontSize: "20px" }}>
        <span>{timeLeft.hours}</span>:<span>{timeLeft.minutes}</span>:<span>{timeLeft.seconds}</span>
      </div>
    </div>
  );
}
