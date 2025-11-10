import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order')
      .order('created_at', { ascending: false })
      .limit(10);
    setGalleryImages(data || []);
  };

  const carouselImages = galleryImages.slice(0, 6);
  const gridImages = galleryImages.slice(6, 10);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-foreground mb-3">Gallery</h2>
        <p className="text-muted-foreground">Capturing the best moments of LBPL</p>
      </div>

      {/* Auto-sliding Carousel */}
      <div className="mb-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {carouselImages.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedImage(image.image_url)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title || 'Gallery image'}
                    className="w-full aspect-video object-cover"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* 2x2 Grid Preview */}
      {gridImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {gridImages.map((image) => (
            <Card
              key={image.id}
              className="overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedImage(image.image_url)}
            >
              <img
                src={image.image_url}
                alt={image.title || 'Gallery image'}
                className="w-full aspect-square object-cover"
              />
            </Card>
          ))}
        </div>
      )}

      {/* View Full Gallery Button */}
      <div className="text-center">
        <Button asChild size="lg" className="font-semibold">
          <Link to="/gallery">View Full Gallery</Link>
        </Button>
      </div>

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
    </section>
  );
};
