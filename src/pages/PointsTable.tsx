import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PointsTable = () => {
  const [cricherosUrl, setCricherosUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('tournament_settings')
      .select('setting_value')
      .eq('setting_key', 'cricheroes_points_table_url')
      .maybeSingle();
    
    if (data?.setting_value) {
      setCricherosUrl(data.setting_value);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <Trophy className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Points Table - Season 3</h1>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Live Table
            </TabsTrigger>
            <TabsTrigger value="info">Tournament Info</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            {cricherosUrl ? (
              <div className="w-full h-[70vh] rounded-lg overflow-hidden border border-border">
                <iframe
                  src={cricherosUrl}
                  className="w-full h-full border-0"
                  title="CricHeroes Points Table"
                  allow="fullscreen"
                />
              </div>
            ) : (
              <Card className="p-8 bg-card border border-border text-center animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <Trophy className="mx-auto mb-4 text-secondary" size={64} />
                <h2 className="text-2xl font-bold text-primary mb-2">Points Table Coming Soon</h2>
                <p className="text-muted-foreground text-lg">
                  Live points table will be available once the tournament starts
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="info">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6 bg-card border border-border animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Trophy className="text-secondary" size={24} />
                  Round 1 Format
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 18 teams divided into 6 groups</li>
                  <li>• 3 teams per group</li>
                  <li>• Top 2 teams from each group advance</li>
                  <li>• 12 teams qualify for Round 2</li>
                </ul>
              </Card>

              <Card className="p-6 bg-card border border-border animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Trophy className="text-secondary" size={24} />
                  Round 2 Format
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 12 qualified teams from Round 1</li>
                  <li>• Divided into 4 groups</li>
                  <li>• 3 teams per group</li>
                  <li>• Top team from each group advances to Semi-Finals</li>
                </ul>
              </Card>

              <Card className="p-6 bg-card border border-border md:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <Trophy className="text-secondary" size={24} />
                  Points System
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-3xl font-bold text-secondary">2</div>
                    <div className="text-sm text-muted-foreground">Points for Win</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-3xl font-bold text-secondary">1</div>
                    <div className="text-sm text-muted-foreground">Points for Tie</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-3xl font-bold text-secondary">0</div>
                    <div className="text-sm text-muted-foreground">Points for Loss</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <div className="text-3xl font-bold text-secondary">NRR</div>
                    <div className="text-sm text-muted-foreground">Tiebreaker</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PointsTable;
