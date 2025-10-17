import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Settings } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const openBackend = () => {
    toast.info("Opening backend management...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-8 bg-gradient-card shadow-card">
            <div className="flex items-start gap-4 mb-6">
              <Database className="text-primary" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Backend Management</h2>
                <p className="text-muted-foreground">
                  Access the backend to manage all tournament data including teams, matches, 
                  results, points table, and more.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-bold text-foreground mb-2">✅ Manage Teams</h3>
                  <p className="text-sm text-muted-foreground">
                    Add/edit team information, logos, and player rosters
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-bold text-foreground mb-2">⚡ Update Matches</h3>
                  <p className="text-sm text-muted-foreground">
                    Set match status, scores, winners, and POTM
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-bold text-foreground mb-2">📊 Points Table</h3>
                  <p className="text-sm text-muted-foreground">
                    Manually update team standings and statistics
                  </p>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-bold text-foreground mb-2">🎯 Fan Polls</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage weekly fan engagement polls
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={openBackend}
                  className="w-full md:w-auto bg-gradient-hero text-white font-bold py-3 px-8 shadow-glow hover:shadow-gold transition-all"
                >
                  <Settings className="mr-2" size={20} />
                  Open Backend Management
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Shield size={20} />
              Quick Guide
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>Teams Table:</strong> Manage all 18 teams and their details</li>
              <li><strong>Players Table:</strong> Add/edit player information for each team</li>
              <li><strong>Matches Table:</strong> Create matches, update scores and status</li>
              <li><strong>Points Table:</strong> Manually update team standings after each match</li>
              <li><strong>Fan Polls:</strong> Create weekly engagement questions for fans</li>
            </ul>
          </Card>

          <Card className="p-6 bg-secondary/10 border-secondary">
            <p className="text-sm text-foreground">
              <strong>💡 Pro Tip:</strong> Use the backend's table view to quickly update multiple 
              records. You can filter, sort, and edit data directly in the interface.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
