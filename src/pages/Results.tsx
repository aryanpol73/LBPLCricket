import { Trophy, Crown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { MatchResultsTable } from "@/components/MatchResultsTable";
const Results = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Premium Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
          <h1 className="text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            Match Results
          </h1>
          <Crown className="text-[hsl(45,90%,55%)]" size={40} strokeWidth={2.5} />
        </div>

        {/* Premium Golden Background Container */}
        <div className="relative bg-gradient-to-br from-[hsl(220,25%,12%)] via-[hsl(220,30%,15%)] to-[hsl(220,25%,10%)] rounded-3xl p-8 shadow-premium border-2 border-[hsl(45,90%,50%)]/30">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(45,90%,50%)]/10 via-transparent to-[hsl(45,90%,50%)]/5 pointer-events-none" />
          <div className="relative">
            <MatchResultsTable grouped />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;