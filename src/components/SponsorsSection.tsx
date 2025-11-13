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

const tierColors = {
  "Titanium": "#003366",
  "Platinum": "#6A0DAD",
  "Gold": "#DAA520",
  "Silver Plus": "#C0C0C0",
  "Silver": "#808080",
  "Advertiser": "#2ECC71",
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
            {sponsors.map((sponsor, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <Card className="h-full bg-background hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div 
                    className="h-2 w-full" 
                    style={{ backgroundColor: tierColors[sponsor.tier] }}
                  />
                  <div className="p-6 space-y-3">
                    <Badge 
                      className="text-xs font-semibold"
                      style={{ 
                        backgroundColor: tierColors[sponsor.tier],
                        color: sponsor.tier === "Gold" || sponsor.tier === "Silver Plus" ? "#000" : "#fff"
                      }}
                    >
                      {sponsor.tier.replace(" ", " ")} Sponsor
                    </Badge>
                    
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      {sponsor.name}
                    </h3>
                    
                    {sponsor.firmName && (
                      <p className="text-sm text-foreground/80">
                        {sponsor.firmName}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      {sponsor.city}
                    </p>
                    
                    <div className="pt-2 mt-auto">
                      <p className="text-xl font-bold text-foreground">
                        {sponsor.amount}
                      </p>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Powered by LBPL Pune Cricket Team
        </p>
      </div>
    </div>
  );
};
