import { Card } from "./ui/card";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "./ui/badge";

interface Sponsor {
  name: string;
  firmName?: string;
  city: string;
  tier: "Titanium" | "Platinum" | "Gold" | "Silver Plus" | "Silver" | "Advertiser";
  amount: string;
}

const tierStyles = {
  "Titanium": {
    gradient: "linear-gradient(90deg, #001F3F, #005F9E)",
    glow: "0 0 15px rgba(0, 95, 158, 0.35)",
    glowHover: "0 0 25px rgba(0, 95, 158, 0.5)",
    badgeColor: "#003366",
  },
  "Platinum": {
    gradient: "linear-gradient(90deg, #7209B7, #B5179E)",
    glow: "0 0 15px rgba(181, 23, 158, 0.35)",
    glowHover: "0 0 25px rgba(181, 23, 158, 0.5)",
    badgeColor: "#6A0DAD",
  },
  "Gold": {
    gradient: "linear-gradient(90deg, #DAA520, #FFD700)",
    glow: "0 0 15px rgba(255, 215, 0, 0.35)",
    glowHover: "0 0 25px rgba(255, 215, 0, 0.5)",
    badgeColor: "#DAA520",
  },
  "Silver Plus": {
    gradient: "linear-gradient(90deg, #A8A8A8, #D9D9D9)",
    glow: "0 0 15px rgba(217, 217, 217, 0.35)",
    glowHover: "0 0 25px rgba(217, 217, 217, 0.5)",
    badgeColor: "#C0C0C0",
  },
  "Silver": {
    gradient: "linear-gradient(90deg, #808080, #BFBFBF)",
    glow: "0 0 15px rgba(191, 191, 191, 0.35)",
    glowHover: "0 0 25px rgba(191, 191, 191, 0.5)",
    badgeColor: "#808080",
  },
  "Advertiser": {
    gradient: "linear-gradient(90deg, #2ECC71, #6DFFB3)",
    glow: "0 0 15px rgba(109, 255, 179, 0.35)",
    glowHover: "0 0 25px rgba(109, 255, 179, 0.5)",
    badgeColor: "#2ECC71",
  },
};

export const SponsorsSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const sponsors: Sponsor[] = [
    { name: "Govind Mahajan", city: "Chikhli", tier: "Titanium", amount: "₹61,000" },
    { name: "Dr. Devesh Minase & Ajinkya Saoji", firmName: "Boli Bhishi Group", city: "Mumbai + Dongaon", tier: "Platinum", amount: "₹51,000" },
    { name: "Abhijit (Jitu) Saoji & Vishwajit Saoji", firmName: "Saoji Group of Companies", city: "Nagpur", tier: "Gold", amount: "₹41,000" },
    { name: "Sagar Umalkar", firmName: "Satyajit Group", city: "Pune", tier: "Gold", amount: "₹41,000" },
    { name: "Suresh Vyawahare", city: "Akot", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Prashant Shriram Saoji Family", firmName: "Arthayojan Finserve Pvt. Ltd.", city: "Mehkar", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Siddhant Vishwesh Saraf", firmName: "Grow Gold", city: "Dongaon", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Nobel Infratech", firmName: "Nobel Infratech", city: "Nagpur", tier: "Silver", amount: "₹25,000" },
    { name: "Subhash & Mandar Saoji", firmName: "Swati Udyog Samuh", city: "Akola", tier: "Silver", amount: "₹25,000" },
    { name: "Jayant Umalkar", firmName: "Saral Enterprises", city: "Mumbai", tier: "Silver", amount: "₹25,000" },
    { name: "Abhijit Saoji", city: "Pune", tier: "Silver", amount: "₹25,000" },
    { name: "Vijay Vyawahare", city: "Buldhana", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Harshal Saoji", firmName: "Dr. Saoji's Ortho Pain Clinic", city: "Pune", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Girish Saoji", firmName: "Saoji Cancer Clinic", city: "CSN", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Rajesh Saoji", city: "CSN", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Sachin Saoji", city: "CSN", tier: "Advertiser", amount: "₹11,000" },
    { name: "Dr. Kedar Saoji", firmName: "Anay Dental & Implant Clinic", city: "Pune", tier: "Advertiser", amount: "₹11,000" },
    { name: "Mrunmay Saoji", firmName: "First Step Marketers", city: "Mehkar", tier: "Advertiser", amount: "₹11,000" },
    { name: "Pankaj Vyawahare", firmName: "Pankaj Vyawahare and Associates", city: "CSN", tier: "Advertiser", amount: "₹11,000" },
  ];

  return (
    <div className="bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
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
          <CarouselContent className="-ml-4">
            {sponsors.map((sponsor, index) => {
              const style = tierStyles[sponsor.tier];
              return (
                <CarouselItem 
                  key={index} 
                  className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card 
                    className="h-full bg-background/95 backdrop-blur-sm overflow-hidden relative transition-all duration-500 ease-out group border-2"
                    style={{ 
                      boxShadow: style.glow,
                      borderColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = style.glowHover;
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = style.glow;
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {/* Gradient header bar */}
                    <div 
                      className="h-3 w-full" 
                      style={{ background: style.gradient }}
                    />
                    
                    {/* Subtle diagonal pattern background */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)',
                      }}
                    />
                    
                    <div className="p-6 space-y-3 relative z-10">
                      {/* 3D floating badge */}
                      <Badge 
                        className="text-xs font-bold px-3 py-1 shadow-lg"
                        style={{ 
                          background: style.gradient,
                          color: sponsor.tier === "Gold" || sponsor.tier === "Silver Plus" ? "#000" : "#fff",
                          boxShadow: `0 4px 12px ${style.badgeColor}40`,
                        }}
                      >
                        {sponsor.tier.replace(" ", " ")} Sponsor
                      </Badge>
                      
                      {/* Sponsor name - enhanced typography */}
                      <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' }}>
                        {sponsor.name}
                      </h3>
                      
                      {/* Firm name */}
                      {sponsor.firmName && (
                        <p className="text-sm font-medium text-foreground/80 leading-snug">
                          {sponsor.firmName}
                        </p>
                      )}
                      
                      {/* City */}
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {sponsor.city}
                      </p>
                      
                      {/* Amount */}
                      <div className="pt-2 mt-auto border-t border-border/50">
                        <p className="text-2xl font-bold text-foreground" style={{ 
                          background: style.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          {sponsor.amount}
                        </p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Powered by LBPL Pune Cricket Team
        </p>
      </div>
    </div>
  );
};
