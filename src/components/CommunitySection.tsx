import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export const CommunitySection = () => {
  return (
    <section id="community" className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/30">
          <Users className="text-secondary" size={32} />
        </div>
        <h2 className="text-4xl font-bold text-primary">Community</h2>
      </div>

      <Card className="p-8 md:p-12 bg-gradient-to-br from-[#0F1B35] via-[#0A1325] to-[#0F1B35] border-secondary/30 shadow-2xl hover:shadow-[0_0_40px_rgba(249,200,70,0.2)] transition-all duration-500">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join the LBPL Fan Community
          </h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Connect with fellow cricket fans, share your thoughts, discuss matches, 
            post memes, and support your favorite teams!
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-secondary">
              <MessageCircle size={24} />
              <span className="text-sm">Discussions</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <Heart size={24} />
              <span className="text-sm">React & Like</span>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <Share2 size={24} />
              <span className="text-sm">Share Posts</span>
            </div>
          </div>

          <Button asChild size="lg" className="font-bold px-8 py-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105">
            <Link to="/community">
              <Users className="mr-2" size={20} />
              Join Community
            </Link>
          </Button>
        </div>
      </Card>
    </section>
  );
};
