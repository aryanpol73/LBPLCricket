
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Trophy, TrendingUp, Target, Award } from "lucide-react";

// Dummy player data for preview
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

  const getTopBatsmen = () => {
    return [...players]
      .sort((a, b) => b.runs_scored - a.runs_scored)
      .slice(0, 10);
  };

  const getTopBowlers = () => {
    return [...players]
      .sort((a, b) => b.wickets_taken - a.wickets_taken)
      .slice(0, 10);
  };

  const getHighestStrikeRate = () => {
    return [...players]
      .sort((a, b) => b.strike_rate - a.strike_rate)
      .slice(0, 10);
  };

  const getHighestAverage = () => {
    return [...players]
      .sort((a, b) => b.batting_average - a.batting_average)
      .slice(0, 10);
  };

  const getBestEconomy = () => {
    return [...players]
      .sort((a, b) => a.economy_rate - b.economy_rate)
      .slice(0, 10);
  };

  const getTopFielders = () => {
    return [...players]
      .sort((a, b) => (b.catches + b.stumpings) - (a.catches + a.stumpings))
      .slice(0, 10);
  };

  const StatCard = ({ title, players, stat, icon: Icon }: { title: string; players: DummyPlayer[]; stat: (p: DummyPlayer) => string; icon: any }) => {
    const topThree = players.slice(0, 3);
    
    return (
      <Card className="p-8 bg-gradient-to-br from-[#2E73FF]/20 via-[#2E73FF]/10 to-transparent border-[#F9C846]/30 shadow-2xl hover:shadow-[0_0_40px_rgba(249,200,70,0.3)] transition-all duration-500 animate-fade-in-up backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Icon className="text-[#F9C846]" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        
        <div className="flex justify-center items-end gap-6 min-h-[320px]">
          <>
            {/* Second Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <div className="relative group">
                  {/* Shield Badge */}
                  <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                    {/* Player Silhouette */}
                    <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                    </div>
                    
                    {/* Rank Badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                      2
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-2 text-center">
                      <p className="text-xl font-bold text-[#F9C846]">{stat(topThree[1])}</p>
                    </div>
                  </div>
                  {/* Player Name Below Shield */}
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">{topThree[1].name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{topThree[1].team_name}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* First Place - Larger */}
            {topThree[0] && (
              <div className="flex flex-col items-center animate-fade-in-up mb-8" style={{ animationDelay: '0s', animationFillMode: 'both' }}>
                <div className="relative group">
                  {/* Shield Badge */}
                  <div className="relative w-40 h-48 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-[3px] border-[#F9C846] shadow-[0_0_30px_rgba(249,200,70,0.5)] transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(249,200,70,0.7)] group-hover:scale-105 animate-pulse-glow">
                    {/* Player Silhouette */}
                    <div className="w-20 h-20 rounded-full bg-[#2E73FF]/40 border-2 border-[#F9C846]/60 flex items-center justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#F9C846]/50 to-transparent"></div>
                    </div>
                    
                    {/* Rank Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#F9C846] to-[#d4a837] rounded-full flex items-center justify-center text-[#0A1325] font-bold text-xl shadow-xl border-2 border-white">
                      1
                    </div>
                    
                    {/* Crown */}
                    <Trophy className="absolute -top-8 text-[#F9C846] animate-bounce-subtle" size={24} />
                    
                    {/* Stats */}
                    <div className="mt-2 text-center">
                      <p className="text-2xl font-bold text-[#F9C846]">{stat(topThree[0])}</p>
                    </div>
                  </div>
                  {/* Player Name Below Shield */}
                  <div className="mt-3 text-center">
                    <p className="text-base font-semibold text-white truncate max-w-[150px]">{topThree[0].name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">{topThree[0].team_name}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Third Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <div className="relative group">
                  {/* Shield Badge */}
                  <div className="relative w-32 h-40 bg-gradient-to-b from-[#0A1325] to-[#0F1B35] rounded-t-full flex flex-col items-center justify-center border-2 border-[#F9C846] shadow-[0_0_20px_rgba(249,200,70,0.4)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(249,200,70,0.6)] group-hover:scale-105">
                    {/* Player Silhouette */}
                    <div className="w-16 h-16 rounded-full bg-[#2E73FF]/30 border-2 border-[#F9C846]/50 flex items-center justify-center mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#F9C846]/40 to-transparent"></div>
                    </div>
                    
                    {/* Rank Badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                      3
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-2 text-center">
                      <p className="text-xl font-bold text-[#F9C846]">{stat(topThree[2])}</p>
                    </div>
                  </div>
                  {/* Player Name Below Shield */}
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-white truncate max-w-[120px]">{topThree[2].name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{topThree[2].team_name}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1325] via-[#0F1B35] to-[#0A1325]">
      {/* Demo Banner */}
      <div className="bg-[#F9C846]/20 border-b border-[#F9C846]/30 py-2 text-center">
        <p className="text-[#F9C846] text-sm font-medium">🎯 Demo Preview - Showing sample player statistics</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 animate-slide-in-left">
          <div className="p-2 rounded-lg bg-[#F9C846]/10 border border-[#F9C846]/30">
            <Trophy className="text-[#F9C846]" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white">Player Statistics</h1>
        </div>

        <Tabs defaultValue="batting" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid animate-fade-in-up bg-[#0F1B35] border-[#F9C846]/30" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <TabsTrigger value="batting" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Batting</TabsTrigger>
            <TabsTrigger value="bowling" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Bowling</TabsTrigger>
            <TabsTrigger value="fielding" className="transition-all duration-300 hover:scale-105 data-[state=active]:bg-[#2E73FF] data-[state=active]:text-white">Fielding</TabsTrigger>
          </TabsList>

          <TabsContent value="batting" className="space-y-6">
            <div className="relative">
              {/* Horizontal Scrollable Container */}
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-[#F9C846]/50 scrollbar-track-[#0F1B35]/50 hover:scrollbar-thumb-[#F9C846] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#0F1B35]/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F9C846]/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#F9C846]">
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Top Run Scorers"
                    players={getTopBatsmen()}
                    stat={(p: DummyPlayer) => `${p.runs_scored} runs`}
                    icon={Trophy}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Highest Strike Rate"
                    players={getHighestStrikeRate()}
                    stat={(p: DummyPlayer) => `${p.strike_rate.toFixed(2)}`}
                    icon={TrendingUp}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Best Batting Average"
                    players={getHighestAverage()}
                    stat={(p: DummyPlayer) => `${p.batting_average.toFixed(2)}`}
                    icon={Award}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bowling" className="space-y-6">
            <div className="relative">
              {/* Horizontal Scrollable Container */}
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-[#F9C846]/50 scrollbar-track-[#0F1B35]/50 hover:scrollbar-thumb-[#F9C846] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#0F1B35]/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F9C846]/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#F9C846]">
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Top Wicket Takers"
                    players={getTopBowlers()}
                    stat={(p: DummyPlayer) => `${p.wickets_taken} wickets`}
                    icon={Target}
                  />
                </div>
                <div className="flex-none w-[90vw] md:w-[45vw] lg:w-[30vw] snap-center">
                  <StatCard
                    title="Best Economy Rate"
                    players={getBestEconomy()}
                    stat={(p: DummyPlayer) => `${p.economy_rate.toFixed(2)}`}
                    icon={TrendingUp}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fielding" className="space-y-6">
            <div>
              <StatCard
                title="Top Fielders"
                players={getTopFielders()}
                stat={(p: DummyPlayer) => `${p.catches + p.stumpings} dismissals`}
                icon={Award}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Stats;
