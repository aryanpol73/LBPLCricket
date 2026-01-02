import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageCircle, 
  Heart, 
  Laugh, 
  Frown, 
  PartyPopper,
  ThumbsUp,
  Share2, 
  Pin, 
  MoreVertical, 
  Trash2, 
  Edit,
  Send,
  Upload,
  Megaphone,
  HelpCircle,
  MessageSquare,
  Smile,
  X,
  Loader2,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Post = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  image_url: string | null;
  image_urls: string[] | null;
  post_type: string;
  is_pinned: boolean;
  created_at: string;
  reactions?: { reaction_type: string; count: number; user_reacted: boolean }[];
  comments_count?: number;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
};

const postTypeIcons: Record<string, any> = {
  discussion: MessageSquare,
  meme: Smile,
  announcement: Megaphone,
  question: HelpCircle,
  match_discussion: MessageCircle,
  poll: HelpCircle,
};

const reactionIcons: Record<string, { icon: any; label: string; color: string }> = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-red-500" },
  laugh: { icon: Laugh, label: "Laugh", color: "text-yellow-500" },
  wow: { icon: PartyPopper, label: "Wow", color: "text-purple-500" },
  sad: { icon: Frown, label: "Sad", color: "text-gray-500" },
};

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState("discussion");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    loadPosts();

    const channel = supabase
      .channel('community-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        loadPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_reactions' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    
    if (session?.user) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!roleData);
    }

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
  };

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const loadPosts = async () => {
    setIsLoading(true);
    const { data: postsData, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading posts:', error);
      setIsLoading(false);
      return;
    }

    // Load reactions for each post
    const postsWithReactions = await Promise.all(
      (postsData || []).map(async (post) => {
        const { data: reactions } = await supabase
          .from('community_reactions')
          .select('reaction_type, user_id')
          .eq('post_id', post.id);

        const { count: commentsCount } = await supabase
          .from('community_comments')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', post.id);

        const reactionCounts = Object.keys(reactionIcons).map(type => ({
          reaction_type: type,
          count: reactions?.filter(r => r.reaction_type === type).length || 0,
          user_reacted: reactions?.some(r => r.reaction_type === type && r.user_id === user?.id) || false,
        }));

        return {
          ...post,
          reactions: reactionCounts,
          comments_count: commentsCount || 0,
        };
      })
    );

    setPosts(postsWithReactions);
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Limit to 5 images max
    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      toast({ title: "Maximum 5 images allowed", variant: "destructive" });
      return;
    }
    
    // Check each file size
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Each image must be less than 5MB", variant: "destructive" });
        return;
      }
    }
    
    setSelectedImages(prev => [...prev, ...files]);
    
    // Generate previews for new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0 || !user) return [];
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    for (const image of selectedImages) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('community-images')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({ title: "Failed to upload an image", variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('community-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(urlData.publicUrl);
    }

    setIsUploading(false);
    return uploadedUrls;
  };

  const moderateContent = async (content: string): Promise<{ acceptable: boolean; reason: string | null; reply: string | null }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moderate-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: content }),
      });
      
      if (!response.ok) {
        console.error("Moderation failed:", response.status);
        return { acceptable: true, reason: null, reply: null };
      }
      
      return await response.json();
    } catch (error) {
      console.error("Moderation error:", error);
      return { acceptable: true, reason: null, reply: null };
    }
  };

  const createPost = async () => {
    if (!user) {
      toast({ title: "Please login to post", variant: "destructive" });
      return;
    }
    if (!newPostContent.trim() && selectedImages.length === 0) {
      toast({ title: "Please add some content or an image", variant: "destructive" });
      return;
    }

    // Moderate content before posting
    if (newPostContent.trim()) {
      const modResult = await moderateContent(newPostContent);
      
      if (!modResult.acceptable) {
        toast({ 
          title: "Post not allowed", 
          description: modResult.reason || "Content violates community guidelines",
          variant: "destructive" 
        });
        return;
      }
      
      // If AI has a helpful reply (for questions), show it
      if (modResult.reply) {
        toast({ 
          title: "Quick Answer", 
          description: modResult.reply,
        });
      }
    }

    let imageUrls: string[] = [];
    if (selectedImages.length > 0) {
      imageUrls = await uploadImages();
    }

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      user_name: user.email?.split('@')[0] || 'Anonymous',
      content: newPostContent,
      post_type: newPostType,
      image_url: imageUrls.length > 0 ? imageUrls[0] : null,
      image_urls: imageUrls,
    });

    if (error) {
      toast({ title: "Failed to create post", variant: "destructive" });
      return;
    }

    setNewPostContent("");
    clearImages();
    toast({ title: "Post created!" });
  };

  const updatePost = async () => {
    if (!editingPost) return;

    const { error } = await supabase
      .from('community_posts')
      .update({ content: editingPost.content, updated_at: new Date().toISOString() })
      .eq('id', editingPost.id);

    if (error) {
      toast({ title: "Failed to update post", variant: "destructive" });
      return;
    }

    setEditingPost(null);
    toast({ title: "Post updated!" });
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from('community_posts').delete().eq('id', postId);
    if (error) {
      toast({ title: "Failed to delete post", variant: "destructive" });
      return;
    }
    toast({ title: "Post deleted!" });
  };

  const togglePin = async (post: Post) => {
    const { error } = await supabase
      .from('community_posts')
      .update({ is_pinned: !post.is_pinned })
      .eq('id', post.id);

    if (error) {
      toast({ title: "Failed to pin post", variant: "destructive" });
      return;
    }
    toast({ title: post.is_pinned ? "Post unpinned!" : "Post pinned!" });
  };

  const toggleReaction = async (postId: string, reactionType: string) => {
    if (!user) {
      toast({ title: "Please login to react", variant: "destructive" });
      return;
    }

    const { data: existing } = await supabase
      .from('community_reactions')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        await supabase.from('community_reactions').delete().eq('id', existing.id);
      } else {
        await supabase
          .from('community_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('community_reactions').insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      });
    }
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const addComment = async () => {
    if (!user || !selectedPost || !newComment.trim()) return;

    // Moderate comment before posting
    const modResult = await moderateContent(newComment);
    
    if (!modResult.acceptable) {
      toast({ 
        title: "Comment not allowed", 
        description: modResult.reason || "Content violates community guidelines",
        variant: "destructive" 
      });
      return;
    }

    const { error } = await supabase.from('community_comments').insert({
      post_id: selectedPost.id,
      user_id: user.id,
      user_name: user.email?.split('@')[0] || 'Anonymous',
      content: newComment,
    });

    if (error) {
      toast({ title: "Failed to add comment", variant: "destructive" });
      return;
    }

    setNewComment("");
    loadComments(selectedPost.id);
    loadPosts();
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from('community_comments').delete().eq('id', commentId);
    if (error) {
      toast({ title: "Failed to delete comment", variant: "destructive" });
      return;
    }
    if (selectedPost) loadComments(selectedPost.id);
    loadPosts();
  };

  const sharePost = (post: Post) => {
    const shareText = `Check out this post from LBPL Community: "${post.content.substring(0, 100)}..."`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({ title: 'LBPL Community Post', text: shareText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  const PostTypeIcon = ({ type }: { type: string }) => {
    const Icon = postTypeIcons[type] || MessageSquare;
    return <Icon size={16} />;
  };

  return (
    <div className="min-h-screen bg-background relative pt-16">
      <AnimatedBackground />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/30">
              <MessageCircle className="text-secondary" size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">LBPL Community</h1>
          </div>
          {user && (
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                toast({ title: "Logged out successfully" });
              }}
              className="border-secondary/30 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
            >
              <LogOut className="mr-2" size={16} />
              Logout
            </Button>
          )}
        </div>

        {/* Create Post Section */}
        {user ? (
          <Card className="p-4 md:p-6 mb-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-secondary/30">
            <Textarea
              placeholder="Share your thoughts, memes, or start a discussion..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mb-4 bg-background/50 border-secondary/30 min-h-[100px]"
            />
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative inline-block">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="h-24 w-24 object-cover rounded-lg border border-secondary/30"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={newPostType}
                onChange={(e) => setNewPostType(e.target.value)}
                className="px-3 py-2 rounded-lg bg-background/50 border border-secondary/30 text-sm"
              >
                <option value="discussion">💬 Discussion</option>
                <option value="meme">😂 Meme</option>
                <option value="question">❓ Question</option>
                <option value="poll">📊 Poll</option>
                <option value="match_discussion">🏏 Match Discussion</option>
                {isAdmin && <option value="announcement">📢 Announcement</option>}
              </select>
              
              {/* Image Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="border-secondary/30 hover:bg-secondary/20"
              >
                <Upload className="mr-2" size={16} />
                Upload
              </Button>
              
              <Button 
                onClick={createPost} 
                className="bg-secondary hover:bg-secondary/90"
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="mr-2 animate-spin" size={16} />
                ) : (
                  <Send className="mr-2" size={16} />
                )}
                {isUploading ? 'Uploading...' : 'Post'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-8 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-secondary/30 text-center">
            <p className="text-muted-foreground mb-4">Please login to post and interact with the community</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <a href="/auth">Login / Sign Up</a>
            </Button>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-secondary/30">
              <MessageCircle className="mx-auto mb-4 text-secondary" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to start a conversation!</p>
            </Card>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className={`p-4 md:p-6 bg-gradient-to-br from-[#0F1B35] to-[#0A1325] border-secondary/30 ${
                  post.is_pinned ? 'border-2 border-secondary shadow-gold' : ''
                }`}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-secondary/30">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {post.user_name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{post.user_name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(post.created_at), 'MMM d, yyyy • h:mm a')}</span>
                        <Badge variant="outline" className="text-xs border-secondary/50">
                          <PostTypeIcon type={post.post_type} />
                          <span className="ml-1 capitalize">{post.post_type.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.is_pinned && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Pin size={12} className="mr-1" /> Pinned
                      </Badge>
                    )}
                    {(user?.id === post.user_id || isAdmin) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0F1B35] border-secondary/30">
                          {user?.id === post.user_id && (
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit size={14} className="mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => togglePin(post)}>
                              <Pin size={14} className="mr-2" /> {post.is_pinned ? 'Unpin' : 'Pin'}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => deletePost(post.id)} className="text-red-500">
                            <Trash2 size={14} className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                {post.content && (
                  <p className="text-white whitespace-pre-wrap mb-4">{post.content}</p>
                )}
                
                {/* Post Images */}
                {(post.image_urls && post.image_urls.length > 0 ? post.image_urls : post.image_url ? [post.image_url] : []).length > 0 && (
                  <div className={`mb-4 grid gap-2 ${
                    (post.image_urls?.length || (post.image_url ? 1 : 0)) === 1 ? 'grid-cols-1' :
                    (post.image_urls?.length || 0) === 2 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3'
                  }`}>
                    {(post.image_urls && post.image_urls.length > 0 ? post.image_urls : post.image_url ? [post.image_url] : []).map((imgUrl, idx) => (
                      <img 
                        key={idx}
                        src={imgUrl} 
                        alt={`Post image ${idx + 1}`} 
                        className={`w-full rounded-lg border border-secondary/20 cursor-pointer hover:opacity-90 transition-opacity object-cover ${
                          (post.image_urls?.length || 1) === 1 ? 'max-h-[500px]' : 'h-48'
                        }`}
                        onClick={() => window.open(imgUrl, '_blank')}
                      />
                    ))}
                  </div>
                )}

                {/* Reactions */}
                <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-secondary/20">
                  {post.reactions?.map((reaction) => (
                    <button
                      key={reaction.reaction_type}
                      onClick={() => toggleReaction(post.id, reaction.reaction_type)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all
                        ${reaction.user_reacted 
                          ? 'bg-secondary/20 border border-secondary' 
                          : 'bg-background/30 border border-transparent hover:border-secondary/50'
                        }`}
                    >
                      {(() => {
                        const Icon = reactionIcons[reaction.reaction_type].icon;
                        return <Icon size={14} className={reactionIcons[reaction.reaction_type].color} />;
                      })()}
                      {reaction.count > 0 && <span className="text-white">{reaction.count}</span>}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          loadComments(post.id);
                        }}
                        className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors text-sm"
                      >
                        <MessageCircle size={16} />
                        <span>{post.comments_count} Comments</span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#0A1325] border-secondary/30">
                      <DialogHeader>
                        <DialogTitle className="text-white">Comments</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 p-3 bg-background/30 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {comment.user_name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-white">{comment.user_name}</p>
                                {(user?.id === comment.user_id || isAdmin) && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => deleteComment(comment.id)}
                                  >
                                    <Trash2 size={12} className="text-red-500" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                              <p className="text-xs text-muted-foreground/60 mt-1">
                                {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                        {user && (
                          <div className="flex gap-2 mt-4">
                            <Input
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="bg-background/50 border-secondary/30"
                              onKeyDown={(e) => e.key === 'Enter' && addComment()}
                            />
                            <Button onClick={addComment} className="bg-secondary hover:bg-secondary/90">
                              <Send size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <button
                    onClick={() => sharePost(post)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-secondary transition-colors text-sm"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Edit Post Dialog */}
        <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
          <DialogContent className="bg-[#0A1325] border-secondary/30">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Post</DialogTitle>
            </DialogHeader>
            <Textarea
              value={editingPost?.content || ''}
              onChange={(e) => setEditingPost(prev => prev ? { ...prev, content: e.target.value } : null)}
              className="bg-background/50 border-secondary/30 min-h-[150px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
              <Button onClick={updatePost} className="bg-secondary hover:bg-secondary/90">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Community;
