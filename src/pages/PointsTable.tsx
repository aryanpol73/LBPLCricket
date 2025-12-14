
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";

const PointsTable = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Points Table - Season 3</h1>
        </div>

        <Tabs defaultValue="round1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <TabsTrigger value="round1">Round 1</TabsTrigger>
            <TabsTrigger value="round2">Round 2</TabsTrigger>
          </TabsList>

          <TabsContent value="round1" className="space-y-6">
            <Card className="p-8 bg-card border border-border text-center animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <Trophy className="mx-auto mb-4 text-secondary" size={64} />
              <h2 className="text-2xl font-bold text-primary mb-2">Round 1 Coming Soon</h2>
              <p className="text-muted-foreground text-lg">
                Points table will be available once the tournament starts
              </p>
            </Card>

            <div className="p-4 bg-muted/50 rounded-lg animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <p className="text-sm text-muted-foreground">
                <strong>Round 1 Format:</strong> 18 teams divided into 6 groups. Top 2 teams from each group (12 teams total) advance to Round 2.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="round2">
            <div className="text-center py-12 animate-fade-in-up">
              <Trophy className="text-secondary mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-primary mb-2">Round 2 Coming Soon</h2>
              <p className="text-muted-foreground">
                Round 2 will feature the top 12 teams from Round 1, divided into 4 groups. 
                Top team from each group advances to Semi-Finals.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PointsTable;