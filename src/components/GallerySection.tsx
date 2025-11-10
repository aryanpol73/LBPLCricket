import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { X } from "lucide-react";

// Placeholder images - replace with actual gallery images
const carouselImages = [
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop",
  "https://images.unsplash.com/photo-1593766787879-e8c78e09cec6?w=800&h=450&fit=crop",
];

const gridImages = [
  "https://images.unsplash.com/photo-1567564911892-81c2b90d5f17?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1611268906276-fa61ed582837?w=400&h=400&fit=crop",
];

export const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
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
      <div className="grid grid-cols-2 gap-4 mb-8">
        {gridImages.map((image, index) => (
          <Card
            key={index}
            className="overflow-hidden cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Grid image ${index + 1}`}
              className="w-full aspect-square object-cover"
            />
          </Card>
        ))}
      </div>

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
