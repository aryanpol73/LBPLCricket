import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LeaderboardSnapshot = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 mb-12">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="text-secondary" size={24} />
            <h2 className="text-2xl font-bold text-foreground">Top Teams</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/points-table')}
          >
            View Full Table
          </Button>
        </div>

        <div className="text-center py-8">
          <Trophy className="mx-auto mb-4 text-secondary" size={48} />
          <p className="text-muted-foreground">
            Rankings will be available once the tournament starts
          </p>
        </div>
      </Card>
    </div>
  );
};