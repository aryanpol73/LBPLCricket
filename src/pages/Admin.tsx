import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Teams state
  const [teams, setTeams] = useState<any[]>([]);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);

  // Points Table state
  const [pointsTable, setPointsTable] = useState<any[]>([]);
  const [editingPoints, setEditingPoints] = useState<any>(null);
  const [pointsDialogOpen, setPointsDialogOpen] = useState(false);

  // Matches state
  const [matches, setMatches] = useState<any[]>([]);
  const [editingMatch, setEditingMatch] = useState<any>(null);
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

  useEffect(() => {
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { password }
      });

      if (error) throw error;

      if (data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        loadAllData();
      } else {
        toast.error(data.message || "Invalid password");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const loadAllData = async () => {
    await Promise.all([loadTeams(), loadPointsTable(), loadMatches()]);
  };

  const loadTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('name');
    setTeams(data || []);
  };

  const loadPointsTable = async () => {
    const { data } = await supabase
      .from('points_table')
      .select('*, team:teams(*)')
      .order('round')
      .order('points', { ascending: false });
    setPointsTable(data || []);
  };

  const loadMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select(`
        *,
        team_a:teams!matches_team_a_id_fkey(id, name),
        team_b:teams!matches_team_b_id_fkey(id, name),
        winner:teams!matches_winner_id_fkey(id, name)
      `)
      .order('match_date', { ascending: false });
    setMatches(data || []);
  };

  // Team CRUD
  const saveTeam = async (team: any) => {
    try {
      if (team.id) {
        const { error } = await supabase.from('teams').update(team).eq('id', team.id);
        if (error) throw error;
        toast.success("Team updated!");
      } else {
        const { error } = await supabase.from('teams').insert(team);
        if (error) throw error;
        toast.success("Team created!");
      }
      loadTeams();
      setTeamDialogOpen(false);
      setEditingTeam(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteTeam = async (id: string) => {
    if (!confirm("Delete this team?")) return;
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Team deleted!");
      loadTeams();
    }
  };

  // Points Table CRUD
  const savePoints = async (points: any) => {
    try {
      if (points.id) {
        const { error } = await supabase.from('points_table').update(points).eq('id', points.id);
        if (error) throw error;
        toast.success("Points updated!");
      } else {
        const { error } = await supabase.from('points_table').insert(points);
        if (error) throw error;
        toast.success("Points entry created!");
      }
      loadPointsTable();
      setPointsDialogOpen(false);
      setEditingPoints(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deletePoints = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from('points_table').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Entry deleted!");
      loadPointsTable();
    }
  };

  // Match CRUD
  const saveMatch = async (match: any) => {
    try {
      if (match.id) {
        const { error } = await supabase.from('matches').update(match).eq('id', match.id);
        if (error) throw error;
        toast.success("Match updated!");
      } else {
        const { error } = await supabase.from('matches').insert(match);
        if (error) throw error;
        toast.success("Match created!");
      }
      loadMatches();
      setMatchDialogOpen(false);
      setEditingMatch(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteMatch = async (id: string) => {
    if (!confirm("Delete this match?")) return;
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Match deleted!");
      loadMatches();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Shield className="text-secondary" size={32} />
            <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              <Lock className="mr-2" size={16} />
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="text-secondary" size={32} />
            <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="points">Points Table</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Teams</h2>
                <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingTeam({})}>
                      <Plus className="mr-2" size={16} />
                      Add Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTeam?.id ? 'Edit' : 'Add'} Team</DialogTitle>
                    </DialogHeader>
                    <TeamForm team={editingTeam} onSave={saveTeam} onCancel={() => setTeamDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Home City</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.short_name}</TableCell>
                      <TableCell>{team.home_city}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTeam(team);
                            setTeamDialogOpen(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Points Table Tab */}
          <TabsContent value="points">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Points Table</h2>
                <Dialog open={pointsDialogOpen} onOpenChange={setPointsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingPoints({})}>
                      <Plus className="mr-2" size={16} />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingPoints?.id ? 'Edit' : 'Add'} Points Entry</DialogTitle>
                    </DialogHeader>
                    <PointsForm
                      points={editingPoints}
                      teams={teams}
                      onSave={savePoints}
                      onCancel={() => setPointsDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>P</TableHead>
                    <TableHead>W</TableHead>
                    <TableHead>L</TableHead>
                    <TableHead>NRR</TableHead>
                    <TableHead>Pts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pointsTable.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.team?.name}</TableCell>
                      <TableCell>{entry.round}</TableCell>
                      <TableCell>{entry.group_name}</TableCell>
                      <TableCell>{entry.matches_played}</TableCell>
                      <TableCell>{entry.wins}</TableCell>
                      <TableCell>{entry.losses}</TableCell>
                      <TableCell>{entry.net_run_rate}</TableCell>
                      <TableCell>{entry.points}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPoints(entry);
                            setPointsDialogOpen(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePoints(entry.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Matches</h2>
                <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingMatch({})}>
                      <Plus className="mr-2" size={16} />
                      Add Match
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingMatch?.id ? 'Edit' : 'Add'} Match</DialogTitle>
                    </DialogHeader>
                    <MatchForm
                      match={editingMatch}
                      teams={teams}
                      onSave={saveMatch}
                      onCancel={() => setMatchDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Team A</TableHead>
                    <TableHead>Team B</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Winner</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell>{new Date(match.match_date).toLocaleDateString()}</TableCell>
                      <TableCell>{match.team_a?.name}</TableCell>
                      <TableCell>{match.team_b?.name}</TableCell>
                      <TableCell>{match.status}</TableCell>
                      <TableCell>{match.winner?.name || '-'}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMatch(match);
                            setMatchDialogOpen(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMatch(match.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Team Form Component
const TeamForm = ({ team, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(team || {});

  return (
    <div className="space-y-4">
      <div>
        <Label>Team Name</Label>
        <Input
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label>Short Name</Label>
        <Input
          value={formData.short_name || ''}
          onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
        />
      </div>
      <div>
        <Label>Home City</Label>
        <Input
          value={formData.home_city || ''}
          onChange={(e) => setFormData({ ...formData, home_city: e.target.value })}
        />
      </div>
      <div>
        <Label>Logo URL</Label>
        <Input
          value={formData.logo_url || ''}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
        />
      </div>
      <div>
        <Label>Fun Fact</Label>
        <Input
          value={formData.fun_fact || ''}
          onChange={(e) => setFormData({ ...formData, fun_fact: e.target.value })}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="mr-2" size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};

// Points Form Component
const PointsForm = ({ points, teams, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(points || {});

  return (
    <div className="space-y-4">
      <div>
        <Label>Team</Label>
        <Select
          value={formData.team_id || ''}
          onValueChange={(value) => setFormData({ ...formData, team_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team: any) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Round</Label>
          <Input
            type="number"
            value={formData.round || 1}
            onChange={(e) => setFormData({ ...formData, round: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Group</Label>
          <Input
            value={formData.group_name || ''}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
            placeholder="A, B, C, etc."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Matches Played</Label>
          <Input
            type="number"
            value={formData.matches_played || 0}
            onChange={(e) => setFormData({ ...formData, matches_played: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Wins</Label>
          <Input
            type="number"
            value={formData.wins || 0}
            onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Losses</Label>
          <Input
            type="number"
            value={formData.losses || 0}
            onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Points</Label>
          <Input
            type="number"
            value={formData.points || 0}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <Label>Net Run Rate</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.net_run_rate || 0}
          onChange={(e) => setFormData({ ...formData, net_run_rate: parseFloat(e.target.value) })}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="mr-2" size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};

// Match Form Component
const MatchForm = ({ match, teams, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(match || {});

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Team A</Label>
          <Select
            value={formData.team_a_id || ''}
            onValueChange={(value) => setFormData({ ...formData, team_a_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team: any) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Team B</Label>
          <Select
            value={formData.team_b_id || ''}
            onValueChange={(value) => setFormData({ ...formData, team_b_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team: any) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Match Date & Time</Label>
        <Input
          type="datetime-local"
          value={formData.match_date ? new Date(formData.match_date).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
        />
      </div>
      <div>
        <Label>Venue</Label>
        <Input
          value={formData.venue || ''}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Match Phase</Label>
          <Select
            value={formData.match_phase || 'league1'}
            onValueChange={(value) => setFormData({ ...formData, match_phase: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="league1">League 1</SelectItem>
              <SelectItem value="league2">League 2</SelectItem>
              <SelectItem value="semi-final">Semi-Final</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Group</Label>
          <Input
            value={formData.group_name || ''}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Status</Label>
        <Select
          value={formData.status || 'upcoming'}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Team A Score</Label>
          <Input
            value={formData.team_a_score || ''}
            onChange={(e) => setFormData({ ...formData, team_a_score: e.target.value })}
            placeholder="e.g., 150/7 (20)"
          />
        </div>
        <div>
          <Label>Team B Score</Label>
          <Input
            value={formData.team_b_score || ''}
            onChange={(e) => setFormData({ ...formData, team_b_score: e.target.value })}
            placeholder="e.g., 145/10 (19.4)"
          />
        </div>
      </div>
      <div>
        <Label>Winner</Label>
        <Select
          value={formData.winner_id || 'none'}
          onValueChange={(value) => setFormData({ ...formData, winner_id: value === 'none' ? null : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select winner (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No winner</SelectItem>
            {teams.map((team: any) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>YouTube Stream URL (optional)</Label>
        <Input
          value={formData.youtube_stream_url || ''}
          onChange={(e) => setFormData({ ...formData, youtube_stream_url: e.target.value })}
          placeholder="https://youtube.com/..."
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>
          <Save className="mr-2" size={16} />
          Save
        </Button>
      </div>
    </div>
  );
};

export default Admin;
