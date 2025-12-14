import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export const MatchesSection = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">Match Fixtures</h2>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="day1">Day 1 Fixtures</TabsTrigger>
          <TabsTrigger value="day2">Day 2 Fixtures</TabsTrigger>
        </TabsList>

        <TabsContent value="day1">
          <Card className="p-8 bg-card border border-border text-center">
            <Calendar className="mx-auto mb-4 text-secondary" size={48} />
            <p className="text-muted-foreground text-lg">Day 1 fixtures will be updated soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="day2">
          <Card className="p-8 bg-card border border-border text-center">
            <Calendar className="mx-auto mb-4 text-secondary" size={48} />
            <p className="text-muted-foreground text-lg">Day 2 fixtures will be updated soon</p>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-8">
        <Button asChild size="lg" className="font-semibold">
          <Link to="/matches">View All Matches</Link>
        </Button>
      </div>
    </div>
  );
};