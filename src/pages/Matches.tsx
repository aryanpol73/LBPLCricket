
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Matches = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Fixtures</h1>

        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
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
      </div>
    </div>
  );
};

export default Matches;