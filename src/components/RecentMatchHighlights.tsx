import { Card } from "./ui/card";
import { Trophy } from "lucide-react";

export const RecentMatchHighlights = () => {
  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Recent Match Highlights
      </h2>
      <Card className="p-8 bg-gradient-card shadow-card text-center">
        <Trophy className="mx-auto mb-4 text-secondary" size={48} />
        <p className="text-muted-foreground text-lg">
          Match highlights will be available once matches are completed
        </p>
      </Card>
    </div>
  );
};