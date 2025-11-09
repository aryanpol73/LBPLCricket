import { Card } from "./ui/card";
import { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const SponsorsSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  // Placeholder sponsors - replace with actual sponsor logos
  const sponsors = [
    { name: "Sponsor 1", logo: "/placeholder.svg" },
    { name: "Sponsor 2", logo: "/placeholder.svg" },
    { name: "Sponsor 3", logo: "/placeholder.svg" },
    { name: "Sponsor 4", logo: "/placeholder.svg" },
    { name: "Sponsor 5", logo: "/placeholder.svg" },
    { name: "Sponsor 6", logo: "/placeholder.svg" },
    { name: "Sponsor 7", logo: "/placeholder.svg" },
    { name: "Sponsor 8", logo: "/placeholder.svg" },
  ];

  return (
    <div className="bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Our Partners
        </h2>
        <Carousel
          plugins={[plugin.current]}
          className="w-full mb-6"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {sponsors.map((sponsor, index) => (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                <Card className="p-6 flex items-center justify-center bg-background hover:bg-accent/50 transition-colors">
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-16 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <p className="text-center text-sm text-muted-foreground">
          Powered by LBPL Pune Cricket Team
        </p>
      </div>
    </div>
  );
};
