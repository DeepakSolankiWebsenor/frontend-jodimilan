import React, { useState, useEffect } from "react";

const Timer = ({ initialMinute = 0, initialSeconds = 0, onTimerEnd }) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          if (onTimerEnd) onTimerEnd();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div className="text-sm text-gray-500 font-semibold mt-2">
      {minutes === 0 && seconds === 0 ? (
        <span className="text-red-500">Expired</span>
      ) : (
        <span>
          Resend OTP in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      )}
    </div>
  );
};

export default Timer;
