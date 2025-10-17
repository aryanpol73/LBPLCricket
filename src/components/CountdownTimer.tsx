import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: Date;
  matchLabel: string;
}

export const CountdownTimer = ({ targetDate, matchLabel }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

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
  }, [targetDate]);

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-secondary" size={20} />
        <h3 className="font-bold text-foreground">{matchLabel}</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Mins", value: timeLeft.minutes },
          { label: "Secs", value: timeLeft.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="bg-gradient-hero text-white rounded-lg p-3 mb-1 shadow-glow">
              <p className="text-2xl font-bold">{String(item.value).padStart(2, "0")}</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
