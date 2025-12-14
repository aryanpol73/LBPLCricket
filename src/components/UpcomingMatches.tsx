import { Card } from "./ui/card";
import { Calendar } from "lucide-react";

export const UpcomingMatches = () => {
  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Upcoming Fixtures
      </h2>
      <Card className="p-8 bg-gradient-card shadow-card text-center">
        <Calendar className="mx-auto mb-4 text-secondary" size={48} />
        <p className="text-muted-foreground text-lg">
          Fixtures will be updated soon
        </p>
      </Card>
    </div>
  );
};