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
    gradient: "linear-gradient(135deg, #0038A8, #0090FF)",
    badgeColor: "#0038A8",
  },
  "Platinum": {
    gradient: "linear-gradient(135deg, #E63AFF, #A900C2)",
    badgeColor: "#E63AFF",
  },
  "Gold": {
    gradient: "linear-gradient(135deg, #FFD44D, #FFB800)",
    badgeColor: "#FFD44D",
  },
  "Silver Plus": {
    gradient: "linear-gradient(135deg, #E0E0E0, #CFCFCF)",
    badgeColor: "#E0E0E0",
  },
  "Silver": {
    gradient: "linear-gradient(135deg, #D2D2D2, #BEBEBE)",
    badgeColor: "#D2D2D2",
  },
  "Advertiser": {
    gradient: "linear-gradient(135deg, #3BFFAB, #00D56F)",
    badgeColor: "#3BFFAB",
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-gold bg-clip-text text-transparent">
          Season 3 Sponsors
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
                    className="overflow-hidden transition-all duration-300 hover:scale-105 border-[3px] rounded-2xl h-full"
                    style={{
                      background: style.gradient,
                      boxShadow: `
                        0 8px 16px rgba(0, 0, 0, 0.3),
                        0 4px 8px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3),
                        inset 0 -1px 2px rgba(0, 0, 0, 0.3)
                      `,
                      borderColor: style.badgeColor,
                      borderStyle: 'solid',
                    }}
                  >
                    {/* Embossed Title Bar */}
                    <div 
                      className="px-6 py-3 border-b-2"
                      style={{
                        background: `linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.2))`,
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.4)',
                        borderBottomColor: 'rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <Badge
                        className="font-bold text-sm px-3 py-1 shadow-lg"
                        style={{
                          backgroundColor: style.badgeColor,
                          color: '#FFFFFF',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                          boxShadow: `
                            0 2px 4px rgba(0, 0, 0, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                          `,
                        }}
                      >
                        {sponsor.tier}
                      </Badge>
                    </div>
                    
                    {/* Card Content with Inner Shadow */}
                    <div 
                      className="p-6 space-y-2"
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <h3 
                        className="font-bold text-xl text-white"
                        style={{
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        {sponsor.name}
                      </h3>
                      {sponsor.firmName && (
                        <p 
                          className="text-white/90 text-sm font-medium"
                          style={{
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          {sponsor.firmName}
                        </p>
                      )}
                      <p 
                        className="text-white/80 text-sm"
                        style={{
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        📍 {sponsor.city}
                      </p>
                      <p 
                        className="text-white font-semibold text-lg pt-2"
                        style={{
                          textShadow: '0 2px 3px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        {sponsor.amount}
                      </p>
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
