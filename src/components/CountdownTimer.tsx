import { useEffect, useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Clock } from "lucide-react";

// Match timing mapping
const MATCH_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: "7:00 AM", end: "7:40 AM" },
  2: { start: "7:50 AM", end: "8:30 AM" },
  3: { start: "8:40 AM", end: "9:20 AM" },
  4: { start: "9:30 AM", end: "10:10 AM" },
  5: { start: "10:20 AM", end: "11:00 AM" },
  6: { start: "11:10 AM", end: "11:50 AM" },
  7: { start: "12:00 PM", end: "12:40 PM" },
  8: { start: "12:50 PM", end: "1:30 PM" },
  9: { start: "1:40 PM", end: "2:20 PM" },
  10: { start: "2:30 PM", end: "3:10 PM" },
  11: { start: "3:20 PM", end: "4:00 PM" },
  12: { start: "4:10 PM", end: "4:50 PM" },
  13: { start: "5:00 PM", end: "5:40 PM" },
  14: { start: "5:50 PM", end: "6:30 PM" },
  15: { start: "6:40 PM", end: "7:20 PM" },
  16: { start: "7:30 PM", end: "8:10 PM" },
  17: { start: "8:20 PM", end: "9:00 PM" },
  18: { start: "9:10 PM", end: "9:50 PM" },
  19: { start: "7:00 AM", end: "7:40 AM" },
  20: { start: "7:50 AM", end: "8:30 AM" },
  21: { start: "8:40 AM", end: "9:20 AM" },
  22: { start: "9:30 AM", end: "10:10 AM" },
  23: { start: "10:20 AM", end: "11:00 AM" },
  24: { start: "11:10 AM", end: "11:50 AM" },
  25: { start: "12:00 PM", end: "12:40 PM" },
  26: { start: "12:50 PM", end: "1:30 PM" },
  27: { start: "1:40 PM", end: "2:20 PM" },
  28: { start: "2:30 PM", end: "3:10 PM" },
  29: { start: "3:20 PM", end: "4:00 PM" },
  30: { start: "4:10 PM", end: "4:50 PM" },
  31: { start: "5:10 PM", end: "5:50 PM" },
  32: { start: "6:00 PM", end: "6:40 PM" },
  33: { start: "7:00 PM", end: "7:40 PM" },
};

interface CountdownTimerProps {
  targetDate: Date;
  matchNo?: number;
  matchLabel: string;
}

export const CountdownTimer = ({ targetDate, matchNo, matchLabel }: CountdownTimerProps) => {
  // Calculate the actual countdown target based on match number and date
  const countdownTarget = useMemo(() => {
    if (!matchNo || !MATCH_TIMES[matchNo]) return targetDate;
    
    const matchDate = new Date(targetDate);
    const [time, period] = MATCH_TIMES[matchNo].start.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let adjustedHours = hours;
    if (period === 'PM' && hours !== 12) {
      adjustedHours = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
    
    matchDate.setHours(adjustedHours, minutes, 0, 0);
    return matchDate;
  }, [targetDate, matchNo]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = countdownTarget.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [countdownTarget]);

  return (
    <Card className="p-4 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="text-[hsl(45,90%,55%)]" size={20} />
        <h3 className="font-bold text-foreground text-base">{matchLabel}</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-gradient-hero text-white rounded-lg p-2 md:p-3 mb-1 shadow-glow">
              <p className="text-xl md:text-2xl font-bold">{String(item.value).padStart(2, "0")}</p>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
