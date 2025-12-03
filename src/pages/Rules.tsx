
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Target, Award } from "lucide-react";

const Rules = () => {
  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Rules & Format</h1>

        {/* Tournament Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <Trophy size={28} />
            Tournament Format
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Badge className="text-2xl font-bold bg-primary">1</Badge>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 text-center">League 1</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• 18 Teams divided into 6 groups</li>
                <li>• 3 teams per group</li>
                <li>• Each team plays 2 matches</li>
                <li>• Top 2 from each group advance</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Badge className="text-2xl font-bold bg-primary">2</Badge>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 text-center">League 2</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Top 12 teams compete</li>
                <li>• 4 groups of 3 teams</li>
                <li>• 2 matches per team</li>
                <li>• Top team per group qualifies</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <Badge className="text-2xl font-bold bg-secondary">SF</Badge>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3 text-center">Semi Finals</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Top 4 teams compete</li>
                <li>• 2 groups of 2 teams</li>
                <li>• Single knockout match</li>
                <li>• Winners advance to final</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-gold shadow-gold hover:shadow-glow transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                <Trophy className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 text-center">Grand Final</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• 2 teams battle</li>
                <li>• Winner takes all</li>
                <li>• Champion crowned</li>
                <li>• Glory awaits!</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Team Composition */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <Users size={28} />
            Team Composition
          </h2>

          <Card className="p-6 bg-gradient-card shadow-card">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground">
              <li className="flex items-start gap-3">
                <Badge className="mt-1">✓</Badge>
                <span>11 players per team on field</span>
              </li>
              <li className="flex items-start gap-3">
                <Badge className="mt-1">✓</Badge>
                <span>Maximum 2 players below 25 years allowed</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Match Rules */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <Target size={28} />
            Match Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-bold text-primary mb-4">General Rules</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• 10 overs per innings (can be reduced to 8 overs)</li>
                <li>• No Last Man Batting allowed</li>
                <li>• Tie in league matches = 1 point each (no Super Over)</li>
                <li>• Tie in Semi/Finals = Super Over with international rules</li>
                <li>• 10+ minute delay = walkover to opponent</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-bold text-primary mb-4">Batting Rules</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Plastic/Wooden bats permitted</li>
                <li>• No LBW (Leg Before Wicket)</li>
                <li>• No Last Batsman batting</li>
                <li>• Batsmen interchange after every over</li>
                <li>• Retired batsmen can only bat at end</li>
                <li>• No Runners allowed</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-bold text-primary mb-4">Bowling Rules</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• New ball for each innings</li>
                <li>• Bowling from one end only</li>
                <li>• Only throw bowling allowed (no run-up)</li>
                <li>• Must bowl from within 30"x30" box</li>
                <li>• Both feet must be grounded at delivery</li>
                <li>• No round-arm or shoulder swing allowed</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gradient-card shadow-card">
              <h3 className="text-lg font-bold text-primary mb-4">Scoring</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Standard cricket scoring applies</li>
                <li>• 6 runs for clearing boundary</li>
                <li>• 4 runs for touching boundary</li>
                <li>• No-ball/Wide = 1 extra run + free hit</li>
                <li>• Extras count towards team total</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Ground Dimensions */}
        <section>
          <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <Award size={28} />
            Ground Specifications
          </h2>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary mb-2">145 ft</p>
                <p className="text-sm text-muted-foreground">Length (Long End)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">120 ft</p>
                <p className="text-sm text-muted-foreground">Width (Short End)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">35 ft</p>
                <p className="text-sm text-muted-foreground">Top Net Height</p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Rules;
