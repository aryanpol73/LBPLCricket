import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const MatchTimeline = () => {
  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Match Timeline</h2>
      
      <Card className="p-8 bg-card border border-border text-center">
        <Calendar className="mx-auto mb-4 text-secondary" size={48} />
        <p className="text-muted-foreground text-lg">Fixtures will be updated soon</p>
      </Card>
    </section>
  );
};