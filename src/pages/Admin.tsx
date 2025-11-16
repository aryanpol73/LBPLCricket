import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Edit, Trash2, Save, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";

// Validation schemas
const teamSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  short_name: z.string().trim().min(1, "Short name is required").max(10, "Short name too long"),
  logo_url: z.string().url("Invalid URL").max(500, "URL too long").nullable().optional(),
  home_city: z.string().trim().max(100, "City name too long").nullable().optional(),
  fun_fact: z.string().trim().max(500, "Fun fact too long").nullable().optional()
});

const pointsSchema = z.object({
  team_id: z.string().uuid("Invalid team"),
  matches_played: z.number().int().min(0, "Must be 0 or more").max(100, "Too many matches"),
  wins: z.number().int().min(0, "Must be 0 or more"),
  losses: z.number().int().min(0, "Must be 0 or more"),
  points: z.number().int().min(0, "Must be 0 or more"),
  net_run_rate: z.number().min(-99, "Invalid NRR").max(99, "Invalid NRR"),
  round: z.number().int().min(1, "Round must be at least 1").max(10, "Round too high"),
  group_name: z.string().trim().max(50, "Group name too long").nullable().optional()
});

const matchSchema = z.object({
  team_a_id: z.string().uuid("Invalid team A"),
  team_b_id: z.string().uuid("Invalid team B"),
  match_date: z.string().min(1, "Match date is required"),
  venue: z.string().trim().max(200, "Venue name too long").nullable().optional(),
  round_no: z.number().int().min(1, "Round must be at least 1").max(50, "Round too high").nullable().optional(),
  match_no: z.number().int().min(1, "Match number must be at least 1").max(500, "Match number too high").nullable().optional(),
  status: z.enum(['upcoming', 'live', 'completed']).nullable().optional(),
  team_a_score: z.string().trim().max(50, "Score too long").nullable().optional(),
  team_b_score: z.string().trim().max(50, "Score too long").nullable().optional(),
  winner_id: z.string().uuid("Invalid winner").nullable().optional(),
  player_of_match_id: z.string().uuid("Invalid player").nullable().optional(),
  match_phase: z.string().trim().max(50, "Phase name too long").nullable().optional(),
  group_name: z.string().trim().max(50, "Group name too long").nullable().optional(),
  youtube_stream_url: z.string().url("Invalid YouTube URL").max(500, "URL too long").nullable().optional()
});

const Admin = () => {
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

  // Players state
  const [players, setPlayers] = useState<any[]>([]);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([loadTeams(), loadPointsTable(), loadMatches(), loadPlayers(), loadGalleryImages()]);
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
        winner:teams!matches_winner_id_fkey(id, name),
        player_of_match:players(id, name)
      `)
      .order('match_date', { ascending: false });
    setMatches(data || []);
  };

  const loadPlayers = async () => {
    const { data } = await supabase.from('players').select('*').order('name');
    setPlayers(data || []);
  };

  // Team CRUD
  const saveTeam = async (team: any) => {
    try {
      const validatedTeam = teamSchema.parse({
        name: team.name,
        short_name: team.short_name,
        logo_url: team.logo_url || null,
        home_city: team.home_city || null,
        fun_fact: team.fun_fact || null
      }) as any;

      if (team.id) {
        const { error } = await supabase.from('teams').update(validatedTeam).eq('id', team.id);
        if (error) throw error;
        toast.success("Team updated!");
      } else {
        const { error } = await supabase.from('teams').insert([validatedTeam]);
        if (error) throw error;
        toast.success("Team created!");
      }
      loadTeams();
      setTeamDialogOpen(false);
      setEditingTeam(null);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(`Validation error: ${error.errors[0].message}`);
      } else {
        toast.error(error.message);
      }
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
      const validatedPoints = pointsSchema.parse({
        team_id: points.team_id,
        matches_played: Number(points.matches_played) || 0,
        wins: Number(points.wins) || 0,
        losses: Number(points.losses) || 0,
        points: Number(points.points) || 0,
        net_run_rate: Number(points.net_run_rate) || 0,
        round: Number(points.round) || 1,
        group_name: points.group_name || null
      }) as any;

      if (points.id) {
        const { error } = await supabase.from('points_table').update(validatedPoints).eq('id', points.id);
        if (error) throw error;
        toast.success("Points updated!");
      } else {
        const { error } = await supabase.from('points_table').insert([validatedPoints]);
        if (error) throw error;
        toast.success("Points entry created!");
      }
      loadPointsTable();
      setPointsDialogOpen(false);
      setEditingPoints(null);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(`Validation error: ${error.errors[0].message}`);
      } else {
        toast.error(error.message);
      }
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
      const validatedMatch = matchSchema.parse({
        team_a_id: match.team_a_id,
        team_b_id: match.team_b_id,
        match_date: match.match_date,
        venue: match.venue || null,
        round_no: match.round_no ? Number(match.round_no) : null,
        match_no: match.match_no ? Number(match.match_no) : null,
        status: match.status || null,
        team_a_score: match.team_a_score || null,
        team_b_score: match.team_b_score || null,
        winner_id: match.winner_id || null,
        player_of_match_id: match.player_of_match_id || null,
        match_phase: match.match_phase || null,
        group_name: match.group_name || null,
        youtube_stream_url: match.youtube_stream_url || null
      }) as any;

      if (match.id) {
        const { error } = await supabase.from('matches').update(validatedMatch).eq('id', match.id);
        if (error) throw error;
        toast.success("Match updated!");
      } else {
        const { error } = await supabase.from('matches').insert([validatedMatch]);
        if (error) throw error;
        toast.success("Match created!");
      }
      loadMatches();
      setMatchDialogOpen(false);
      setEditingMatch(null);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(`Validation error: ${error.errors[0].message}`);
      } else {
        toast.error(error.message);
      }
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

  // Gallery CRUD
  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false });
    setGalleryImages(data || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({ image_url: publicUrl, display_order: galleryImages.length });

      if (insertError) throw insertError;

      toast.success("Image uploaded!");
      loadGalleryImages();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteGalleryImage = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this image?")) return;
    
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts[urlParts.length - 1];

      // Delete from storage
      await supabase.storage.from('gallery').remove([filePath]);

      // Delete from database
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;

      toast.success("Image deleted!");
      loadGalleryImages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3">
          <Shield className="text-secondary" size={32} />
          <h1 className="text-4xl font-bold text-primary">Admin Panel</h1>
        </div>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
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
                      players={players}
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

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Manage Gallery</h2>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <Button asChild disabled={uploadingImage}>
                    <label htmlFor="gallery-upload" className="cursor-pointer">
                      <Upload className="mr-2" size={16} />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Gallery image'}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground truncate">
                        {image.title || 'Untitled'}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteGalleryImage(image.id, image.image_url)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
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
const MatchForm = ({ match, teams, players, onSave, onCancel }: any) => {
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
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Round No.</Label>
          <Input
            type="number"
            value={formData.round_no || ''}
            onChange={(e) => setFormData({ ...formData, round_no: parseInt(e.target.value) })}
            placeholder="1, 2, 3..."
          />
        </div>
        <div>
          <Label>Match No.</Label>
          <Input
            type="number"
            value={formData.match_no || ''}
            onChange={(e) => setFormData({ ...formData, match_no: parseInt(e.target.value) })}
            placeholder="1, 2, 3..."
          />
        </div>
        <div>
          <Label>Group</Label>
          <Input
            value={formData.group_name || ''}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
            placeholder="A, B, C..."
          />
        </div>
      </div>
      <div>
        <Label>Match Phase</Label>
        <Select
          value={formData.match_phase || 'league'}
          onValueChange={(value) => setFormData({ ...formData, match_phase: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="league">League</SelectItem>
            <SelectItem value="semi-final">Semi-Final</SelectItem>
            <SelectItem value="final">Final</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="grid grid-cols-2 gap-4">
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
          <Label>Player of the Match</Label>
          <Select
            value={formData.player_of_match_id || 'none'}
            onValueChange={(value) => setFormData({ ...formData, player_of_match_id: value === 'none' ? null : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select player (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No player</SelectItem>
              {players.map((player: any) => (
                <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
