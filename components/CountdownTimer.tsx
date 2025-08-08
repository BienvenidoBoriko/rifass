"use client";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  endDate,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className={`flex space-x-4 ${className}`}>
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
        </div>
        <div className="text-sm text-slate-600 mt-1">Días</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
        </div>
        <div className="text-sm text-slate-600 mt-1">Horas</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        </div>
        <div className="text-sm text-slate-600 mt-1">Min</div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-3 min-w-[60px]">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        </div>
        <div className="text-sm text-slate-600 mt-1">Seg</div>
      </div>
    </div>
  );
}
