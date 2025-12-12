import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const plugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false })
      .limit(12);
    
    // Duplicate images for seamless infinite scroll
    const duplicatedImages = data ? [...data, ...data] : [];
    setGalleryImages(duplicatedImages);
  };

  return (
    <>
      <section className="bg-muted/30 py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Gallery</h2>
            <p className="text-muted-foreground">Capturing the best moments of LBPL</p>
          </div>

        {/* Gallery Coming Soon */}
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl font-semibold text-muted-foreground">Gallery Coming Soon...</p>
        </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Gallery lightbox"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
