import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
export const LiveTicker = () => {
  const [tickerMessage, setTickerMessage] = useState<string>('');
  useEffect(() => {
    loadLiveMatch();

    // Refresh ticker every 30 seconds
    const interval = setInterval(loadLiveMatch, 30000);
    return () => clearInterval(interval);
  }, []);
  const loadLiveMatch = async () => {
    const {
      data: liveMatch
    } = await supabase.from('matches').select(`
        *,
        team_a:teams!matches_team_a_id_fkey(name),
        team_b:teams!matches_team_b_id_fkey(name)
      `).eq('status', 'live').order('match_date', {
      ascending: true
    }).limit(1).single();
    if (liveMatch) {
      setTickerMessage(`🔴 LIVE NOW: ${liveMatch.team_a?.name} vs ${liveMatch.team_b?.name} • ${liveMatch.venue || 'LBPL Stadium'}`);
    } else {
      setTickerMessage('🏆 Welcome to LBPL Season 3 — The Ultimate Cricket Showdown Begins!');
    }
  };
  if (!tickerMessage) return null;
  return <div className="bg-gradient-gold border-y border-secondary/20 overflow-hidden contain-paint">
      <div className="animate-scroll-left whitespace-nowrap py-2 gpu-accelerated">
        <span className="inline-block px-8 text-sm font-semibold text-[hsl(220,70%,15%)]">
          {tickerMessage}
        </span>
        <span className="inline-block px-8 text-sm font-semibold text-[hsl(220,70%,15%)]">
          {tickerMessage}
        </span>
        <span className="inline-block px-8 text-sm font-semibold text-[hsl(220,70%,15%)]">
          {tickerMessage}
        </span>
      </div>
    </div>;
};