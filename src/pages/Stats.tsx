import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, TrendingUp, Target, Award, Medal, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Dummy player data for preview (30 players)
const dummyPlayers = [
  { id: "1", name: "Rahul Sharma", team_name: "Royal Challengers", runs_scored: 456, wickets_taken: 3, batting_average: 57.00, strike_rate: 145.50, bowling_average: 32.00, economy_rate: 8.5, catches: 8, stumpings: 0 },
  { id: "2", name: "Vikas Patel", team_name: "Mumbai Warriors", runs_scored: 398, wickets_taken: 12, batting_average: 44.22, strike_rate: 138.90, bowling_average: 18.50, economy_rate: 6.8, catches: 5, stumpings: 0 },
  { id: "3", name: "Amit Kumar", team_name: "Chennai Kings", runs_scored: 367, wickets_taken: 15, batting_average: 40.78, strike_rate: 152.30, bowling_average: 16.20, economy_rate: 7.2, catches: 6, stumpings: 2 },
  { id: "4", name: "Suresh Reddy", team_name: "Kolkata Riders", runs_scored: 312, wickets_taken: 8, batting_average: 39.00, strike_rate: 128.40, bowling_average: 22.80, economy_rate: 7.9, catches: 4, stumpings: 0 },
  { id: "5", name: "Pradeep Singh", team_name: "Delhi Capitals", runs_scored: 289, wickets_taken: 18, batting_average: 36.13, strike_rate: 135.20, bowling_average: 14.50, economy_rate: 6.2, catches: 7, stumpings: 0 },
  { id: "6", name: "Karthik Nair", team_name: "Punjab Kings", runs_scored: 267, wickets_taken: 2, batting_average: 44.50, strike_rate: 160.80, bowling_average: 45.00, economy_rate: 9.1, catches: 3, stumpings: 0 },
  { id: "7", name: "Deepak Verma", team_name: "Rajasthan Royals", runs_scored: 245, wickets_taken: 14, batting_average: 30.63, strike_rate: 122.50, bowling_average: 17.80, economy_rate: 6.5, catches: 9, stumpings: 0 },
  { id: "8", name: "Arjun Menon", team_name: "Hyderabad Stars", runs_scored: 223, wickets_taken: 10, batting_average: 27.88, strike_rate: 142.60, bowling_average: 20.30, economy_rate: 7.4, catches: 5, stumpings: 3 },
  { id: "9", name: "Sanjay Gupta", team_name: "Lucknow Giants", runs_scored: 198, wickets_taken: 6, batting_average: 33.00, strike_rate: 118.90, bowling_average: 28.50, economy_rate: 8.2, catches: 4, stumpings: 0 },
  { id: "10", name: "Ravi Teja", team_name: "Gujarat Titans", runs_scored: 176, wickets_taken: 11, batting_average: 25.14, strike_rate: 131.40, bowling_average: 19.60, economy_rate: 6.9, catches: 6, stumpings: 1 },
  { id: "11", name: "Ankit Mishra", team_name: "Royal Challengers", runs_scored: 165, wickets_taken: 9, batting_average: 23.57, strike_rate: 126.50, bowling_average: 21.50, economy_rate: 7.1, catches: 3, stumpings: 0 },
  { id: "12", name: "Rohan Das", team_name: "Mumbai Warriors", runs_scored: 154, wickets_taken: 7, batting_average: 22.00, strike_rate: 119.80, bowling_average: 24.30, economy_rate: 7.8, catches: 5, stumpings: 0 },
  { id: "13", name: "Varun Iyer", team_name: "Chennai Kings", runs_scored: 148, wickets_taken: 13, batting_average: 21.14, strike_rate: 134.50, bowling_average: 15.80, economy_rate: 6.4, catches: 4, stumpings: 0 },
  { id: "14", name: "Nikhil Rao", team_name: "Kolkata Riders", runs_scored: 142, wickets_taken: 5, batting_average: 20.29, strike_rate: 115.60, bowling_average: 29.80, economy_rate: 8.6, catches: 2, stumpings: 0 },
  { id: "15", name: "Aditya Joshi", team_name: "Delhi Capitals", runs_scored: 138, wickets_taken: 16, batting_average: 19.71, strike_rate: 141.20, bowling_average: 13.90, economy_rate: 5.9, catches: 6, stumpings: 0 },
  { id: "16", name: "Manish Pandey", team_name: "Punjab Kings", runs_scored: 132, wickets_taken: 4, batting_average: 18.86, strike_rate: 108.90, bowling_average: 33.00, economy_rate: 8.9, catches: 3, stumpings: 2 },
  { id: "17", name: "Gaurav Thakur", team_name: "Rajasthan Royals", runs_scored: 128, wickets_taken: 11, batting_average: 18.29, strike_rate: 124.30, bowling_average: 18.20, economy_rate: 6.7, catches: 7, stumpings: 0 },
  { id: "18", name: "Sachin Yadav", team_name: "Hyderabad Stars", runs_scored: 124, wickets_taken: 8, batting_average: 17.71, strike_rate: 117.50, bowling_average: 22.50, economy_rate: 7.3, catches: 4, stumpings: 0 },
  { id: "19", name: "Vijay Shankar", team_name: "Lucknow Giants", runs_scored: 118, wickets_taken: 6, batting_average: 16.86, strike_rate: 112.40, bowling_average: 26.80, economy_rate: 8.0, catches: 5, stumpings: 1 },
  { id: "20", name: "Rahul Chahar", team_name: "Gujarat Titans", runs_scored: 112, wickets_taken: 17, batting_average: 16.00, strike_rate: 138.80, bowling_average: 12.50, economy_rate: 5.8, catches: 3, stumpings: 0 },
  { id: "21", name: "Krishna Kumar", team_name: "Royal Challengers", runs_scored: 108, wickets_taken: 3, batting_average: 15.43, strike_rate: 105.90, bowling_average: 35.00, economy_rate: 9.2, catches: 2, stumpings: 0 },
  { id: "22", name: "Mohit Sharma", team_name: "Mumbai Warriors", runs_scored: 102, wickets_taken: 14, batting_average: 14.57, strike_rate: 129.10, bowling_average: 14.80, economy_rate: 6.3, catches: 8, stumpings: 0 },
  { id: "23", name: "Shubham Gill", team_name: "Chennai Kings", runs_scored: 98, wickets_taken: 2, batting_average: 14.00, strike_rate: 102.10, bowling_average: 48.00, economy_rate: 9.5, catches: 4, stumpings: 0 },
  { id: "24", name: "Akash Deep", team_name: "Kolkata Riders", runs_scored: 94, wickets_taken: 12, batting_average: 13.43, strike_rate: 133.40, bowling_average: 16.50, economy_rate: 6.6, catches: 5, stumpings: 0 },
  { id: "25", name: "Harpreet Brar", team_name: "Delhi Capitals", runs_scored: 88, wickets_taken: 9, batting_average: 12.57, strike_rate: 121.70, bowling_average: 19.80, economy_rate: 7.0, catches: 3, stumpings: 0 },
  { id: "26", name: "Tushar Deshpande", team_name: "Punjab Kings", runs_scored: 82, wickets_taken: 15, batting_average: 11.71, strike_rate: 145.60, bowling_average: 13.20, economy_rate: 6.1, catches: 2, stumpings: 0 },
  { id: "27", name: "Yash Dayal", team_name: "Rajasthan Royals", runs_scored: 76, wickets_taken: 10, batting_average: 10.86, strike_rate: 114.30, bowling_average: 20.80, economy_rate: 7.5, catches: 4, stumpings: 0 },
  { id: "28", name: "Avesh Khan", team_name: "Hyderabad Stars", runs_scored: 68, wickets_taken: 13, batting_average: 9.71, strike_rate: 136.00, bowling_average: 15.50, economy_rate: 6.8, catches: 1, stumpings: 0 },
  { id: "29", name: "Mukesh Kumar", team_name: "Lucknow Giants", runs_scored: 62, wickets_taken: 8, batting_average: 8.86, strike_rate: 118.20, bowling_average: 23.80, economy_rate: 7.6, catches: 3, stumpings: 0 },
  { id: "30", name: "Arshdeep Singh", team_name: "Gujarat Titans", runs_scored: 54, wickets_taken: 19, batting_average: 7.71, strike_rate: 142.10, bowling_average: 11.80, economy_rate: 5.5, catches: 2, stumpings: 0 },
];

interface DummyPlayer {
  id: string;
  name: string;
  team_name: string;
  runs_scored: number;
  wickets_taken: number;
  batting_average: number;
  strike_rate: number;
  bowling_average: number;
  economy_rate: number;
  catches: number;
  stumpings: number;
}

const Stats = () => {
  const [players] = useState<DummyPlayer[]>(dummyPlayers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogPlayers, setDialogPlayers] = useState<{ player: DummyPlayer; value: string }[]>([]);
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

  const getTopBatsmen = () => [...players].sort((a, b) => b.runs_scored - a.runs_scored).slice(0, 30);
  const getTopBowlers = () => [...players].sort((a, b) => b.wickets_taken - a.wickets_taken).slice(0, 30);
  const getHighestStrikeRate = () => [...players].sort((a, b) => b.strike_rate - a.strike_rate).slice(0, 30);
  const getHighestAverage = () => [...players].sort((a, b) => b.batting_average - a.batting_average).slice(0, 30);
  const getBestEconomy = () => [...players].sort((a, b) => a.economy_rate - b.economy_rate).slice(0, 30);
  const getTopFielders = () => [...players].sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings)).slice(0, 30);

  const openDialog = (title: string, players: DummyPlayer[], statFn: (p: DummyPlayer) => string) => {
    setDialogTitle(title);
    setDialogPlayers(players.map(p => ({ player: p, value: statFn(p) })));
    setDialogOpen(true);
  };

  const StatCard = ({ title, players, stat, icon: Icon, onClick }: { title: string; players: DummyPlayer[]; stat: (p: DummyPlayer) => string; icon: any; onClick: () => void }) => {
    const topThree = players.slice(0, 3);
    
    return (
      <Card 
        onClick={onClick}
        className="p-4 md:p-6 bg-gradient-to-br from-[#2E73FF]/20 via-[#2E73FF]/10 to-transparent border-[#F9C846]/30 shadow-xl hover:shadow-[0_0_30px_rgba(249,200,70,0.3)] transition-all duration-300 cursor-pointer hover:scale-[1.02] backdrop-blur-sm h-full"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Icon className="text-[#F9C846]" size={20} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {topThree.map((player, index) => (
            <div 
              key={player.id} 
              className={`flex items-center gap-3 p-2 rounded-lg ${
                index === 0 ? 'bg-[#F9C846]/10 border border-[#F9C846]/30' : 'bg-[#0F1B35]/50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                index === 0 ? 'bg-gradient-to-br from-[#F9C846] to-[#d4a837] text-[#0A1325]' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                'bg-gradient-to-br from-amber-700 to-amber-900 text-white'
              }`}>
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{player.name}</p>
                <p className="text-xs text-gray-400 truncate">{player.team_name}</p>
              </div>
              
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-bold ${index === 0 ? 'text-[#F9C846]' : 'text-white'}`}>
                  {stat(player)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-[#F9C846]/70 hover:text-[#F9C846] transition-colors">
            Click to view Top 30 →
          </p>
        </div>
      </Card>
    );
  };

  const getRankBadgeStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-br from-[#F9C846] to-[#d4a837] text-[#0A1325]';
    if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white';
    if (index === 2) return 'bg-gradient-to-br from-amber-700 to-amber-900 text-white';
    return 'bg-[#2E73FF]/30 text-white';
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

        {/* Main Tabs: Live Stats vs Preview */}
        <Tabs defaultValue={cricherosUrl ? "live" : "preview"} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#0F1B35] border border-[#F9C846]/30">
            <TabsTrigger value="live" className="flex items-center gap-2 text-sm data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">
              <ExternalLink className="w-4 h-4" />
              Tournament Stats
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-sm data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">
              Preview Stats
            </TabsTrigger>
          </TabsList>

          {/* Live CricHeroes Stats */}
          <TabsContent value="live">
            {cricherosUrl ? (
              <div className="w-full h-[75vh] rounded-lg overflow-hidden border border-[#F9C846]/30">
                <iframe
                  src={cricherosUrl}
                  className="w-full h-full border-0"
                  title="CricHeroes Tournament Stats"
                  allow="fullscreen"
                />
              </div>
            ) : (
              <Card className="p-8 bg-gradient-to-br from-[#2E73FF]/20 via-[#2E73FF]/10 to-transparent border-[#F9C846]/30 text-center">
                <Trophy className="mx-auto mb-4 text-[#F9C846]" size={64} />
                <h2 className="text-2xl font-bold text-white mb-2">Live Stats Coming Soon</h2>
                <p className="text-gray-400 text-lg">
                  Tournament statistics will be available once the tournament starts
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Preview Stats (Existing Dummy Data) */}
          <TabsContent value="preview">
            {/* Demo Banner */}
            <div className="bg-[#F9C846]/20 border border-[#F9C846]/30 rounded-lg py-2 mb-4 text-center">
              <p className="text-[#F9C846] text-sm font-medium">🎯 Demo Preview - Showing sample player statistics</p>
            </div>

            <Tabs defaultValue="batting" className="space-y-4 md:space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-[#0F1B35] border border-[#F9C846]/30">
                <TabsTrigger value="batting" className="text-sm data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Batting</TabsTrigger>
                <TabsTrigger value="bowling" className="text-sm data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Bowling</TabsTrigger>
                <TabsTrigger value="fielding" className="text-sm data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Fielding</TabsTrigger>
              </TabsList>

              <TabsContent value="batting" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    title="Top Run Scorers"
                    players={getTopBatsmen()}
                    stat={(p) => `${p.runs_scored} runs`}
                    icon={Trophy}
                    onClick={() => openDialog("Top Run Scorers", getTopBatsmen(), (p) => `${p.runs_scored} runs`)}
                  />
                  <StatCard
                    title="Highest Strike Rate"
                    players={getHighestStrikeRate()}
                    stat={(p) => `${p.strike_rate.toFixed(1)} SR`}
                    icon={TrendingUp}
                    onClick={() => openDialog("Highest Strike Rate", getHighestStrikeRate(), (p) => `${p.strike_rate.toFixed(2)} SR`)}
                  />
                  <StatCard
                    title="Best Batting Average"
                    players={getHighestAverage()}
                    stat={(p) => `${p.batting_average.toFixed(1)} avg`}
                    icon={Award}
                    onClick={() => openDialog("Best Batting Average", getHighestAverage(), (p) => `${p.batting_average.toFixed(2)} avg`)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="bowling" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatCard
                    title="Top Wicket Takers"
                    players={getTopBowlers()}
                    stat={(p) => `${p.wickets_taken} wkts`}
                    icon={Target}
                    onClick={() => openDialog("Top Wicket Takers", getTopBowlers(), (p) => `${p.wickets_taken} wickets`)}
                  />
                  <StatCard
                    title="Best Economy Rate"
                    players={getBestEconomy()}
                    stat={(p) => `${p.economy_rate.toFixed(2)} eco`}
                    icon={TrendingUp}
                    onClick={() => openDialog("Best Economy Rate", getBestEconomy(), (p) => `${p.economy_rate.toFixed(2)} eco`)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="fielding" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    title="Top Fielders"
                    players={getTopFielders()}
                    stat={(p) => `${p.catches + p.stumpings} dis`}
                    icon={Award}
                    onClick={() => openDialog("Top Fielders", getTopFielders(), (p) => `${p.catches + p.stumpings} dismissals`)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Top 30 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#0A1325] to-[#0F1B35] border-[#F9C846]/30 max-w-lg max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Medal className="text-[#F9C846]" size={24} />
              {dialogTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-2">
            {dialogPlayers.map(({ player, value }, index) => (
              <div 
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index < 3 ? 'bg-[#F9C846]/10 border border-[#F9C846]/30' : 'bg-[#0F1B35]/50 border border-transparent hover:border-[#2E73FF]/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getRankBadgeStyle(index)}`}>
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{player.name}</p>
                  <p className="text-xs text-gray-400">{player.team_name}</p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${index < 3 ? 'text-[#F9C846]' : 'text-white'}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stats;
