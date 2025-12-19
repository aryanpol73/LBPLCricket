import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, Award, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Stats = () => {
  const [cricherosUrl, setCricherosUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('tournament_settings')
      .select('setting_value')
      .eq('setting_key', 'cricheroes_stats_url')
      .maybeSingle();
    
    if (data?.setting_value) {
      setCricherosUrl(data.setting_value);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const ComingSoonCard = ({ title, icon: Icon }: { title: string; icon: any }) => (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-[#0F1B35] via-[#0A1325] to-[#0F1B35] border-[#F9C846]/30 shadow-2xl h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
          <Icon className="text-[#F9C846]" size={20} />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
      </div>
      <div className="text-center py-8">
        <p className="text-muted-foreground">Statistics will be available once the tournament starts</p>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325]">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Trophy className="text-[#F9C846]" size={28} />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white">Player Statistics</h1>
        </div>

        {cricherosUrl ? (
          <div className="w-full h-[75vh] rounded-lg overflow-hidden border border-[#F9C846]/30">
            <iframe
              src={cricherosUrl}
              className="w-full h-full border-0"
              title="Tournament Stats"
              allow="fullscreen"
            />
          </div>
        ) : (
          <Tabs defaultValue="batting" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-[#0F1B35] border-[#F9C846]/30">
              <TabsTrigger value="batting">Batting</TabsTrigger>
              <TabsTrigger value="bowling">Bowling</TabsTrigger>
              <TabsTrigger value="fielding">Fielding</TabsTrigger>
            </TabsList>

            <TabsContent value="batting" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ComingSoonCard title="Top Run Scorers" icon={Trophy} />
                <ComingSoonCard title="Highest Strike Rate" icon={TrendingUp} />
                <ComingSoonCard title="Best Batting Average" icon={Award} />
              </div>
            </TabsContent>

            <TabsContent value="bowling" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ComingSoonCard title="Top Wicket Takers" icon={Target} />
                <ComingSoonCard title="Best Economy Rate" icon={TrendingUp} />
              </div>
            </TabsContent>

            <TabsContent value="fielding" className="space-y-6">
              <div className="grid grid-cols-1 max-w-2xl mx-auto gap-4">
                <ComingSoonCard title="Top Fielders" icon={Award} />
              </div>
            </TabsContent>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="font-semibold bg-[#2E73FF] hover:bg-[#2E73FF]/90">
                <Link to="/stats">View Full Statistics</Link>
              </Button>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Stats;