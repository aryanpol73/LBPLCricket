import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Smartphone, Monitor, Apple } from "lucide-react";

interface PwaStats {
  total: number;
  android: number;
  ios: number;
  desktop: number;
}

export const PwaStatsCard = () => {
  const [stats, setStats] = useState<PwaStats>({ total: 0, android: 0, ios: 0, desktop: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pwa_installs')
      .select('platform');
    
    if (error) {
      console.error('Failed to load PWA stats:', error);
      setLoading(false);
      return;
    }

    const platformCounts = (data || []).reduce((acc, install) => {
      const platform = install.platform?.toLowerCase() || 'unknown';
      if (platform === 'android') acc.android++;
      else if (platform === 'ios') acc.ios++;
      else if (platform === 'desktop') acc.desktop++;
      acc.total++;
      return acc;
    }, { total: 0, android: 0, ios: 0, desktop: 0 });

    setStats(platformCounts);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            PWA Installations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          PWA Installations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Installs</p>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-500">
              <Smartphone className="w-5 h-5" />
              {stats.android}
            </div>
            <p className="text-sm text-muted-foreground">Android</p>
          </div>
          <div className="text-center p-4 bg-blue-500/10 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-500">
              <Apple className="w-5 h-5" />
              {stats.ios}
            </div>
            <p className="text-sm text-muted-foreground">iOS</p>
          </div>
          <div className="text-center p-4 bg-orange-500/10 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-500">
              <Monitor className="w-5 h-5" />
              {stats.desktop}
            </div>
            <p className="text-sm text-muted-foreground">Desktop</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
