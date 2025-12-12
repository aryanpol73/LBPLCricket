import { useState, useEffect } from "react";

import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allGalleryImages, setAllGalleryImages] = useState<any[]>([]);
  useEffect(() => {
    loadGalleryImages();
  }, []);
  const loadGalleryImages = async () => {
    const {
      data
    } = await supabase.from('gallery_images').select('*').order('display_order').order('created_at', {
      ascending: false
    });
    setAllGalleryImages(data || []);
  };
  return <div className="min-h-screen bg-background">
      
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-foreground mb-4 font-serif text-4xl font-semibold text-center">Full Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Browse all the memorable moments from LBPL Season 3
          </p>
        </div>

        {/* Gallery Coming Soon */}
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-2xl font-semibold text-muted-foreground">Gallery Coming Soon...</p>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Close">
            <X className="w-6 h-6 text-white" />
          </button>
          {selectedImage && <img src={selectedImage} alt="Gallery lightbox" className="w-full h-auto max-h-[90vh] object-contain" />}
        </DialogContent>
      </Dialog>
    </div>;
};
export default Gallery;