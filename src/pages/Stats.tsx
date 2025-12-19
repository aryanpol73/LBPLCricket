import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
          <Card className="p-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-[#F9C846]/30 text-center">
            <Trophy className="mx-auto mb-4 text-[#F9C846]" size={48} />
            <p className="text-muted-foreground text-lg">Statistics will be available once the tournament starts</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Stats;