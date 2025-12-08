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

        {/* Auto-scrolling horizontal carousel */}
        <Carousel
          plugins={[plugin.current]}
          className="w-full mb-6"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={`gallery-${image.id}-${index}`} className="basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6">
                <Card 
                  className="overflow-hidden cursor-pointer shadow-sm hover:shadow-glow transition-all duration-300 hover:scale-105 group rounded-lg"
                  onClick={() => setSelectedImage(image.image_url)}
                  onMouseEnter={() => plugin.current.stop()}
                  onMouseLeave={() => plugin.current.play()}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

          {/* View Full Gallery Button */}
          <div className="text-center">
            <Button asChild size="lg" className="font-semibold">
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
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
