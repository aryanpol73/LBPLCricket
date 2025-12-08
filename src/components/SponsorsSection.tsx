import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Sponsor {
  name: string;
  firmName?: string;
  city: string;
  tier: "Titanium" | "Platinum" | "Gold" | "Silver Plus" | "Silver" | "Advertiser";
  amount: string;
}

const tierStyles = {
  "Titanium": {
    gradient: "linear-gradient(180deg, #4CA1AF 0%, #2C3E50 100%)",
    badgeColor: "#1A252F",
    borderColor: "#4CA1AF",
  },
  "Platinum": {
    gradient: "linear-gradient(180deg, #DCE9F5 0%, #B8C7D9 100%)",
    badgeColor: "#8FA8C0",
    borderColor: "#B8C7D9",
  },
  "Gold": {
    gradient: "linear-gradient(180deg, #F6C645 0%, #D9A12C 100%)",
    badgeColor: "#B8841F",
    borderColor: "#D9A12C",
  },
  "Silver Plus": {
    gradient: "linear-gradient(180deg, #B0B4B8 0%, #8F9AA0 100%)",
    badgeColor: "#6B7278",
    borderColor: "#8F9AA0",
  },
  "Silver": {
    gradient: "linear-gradient(180deg, #E0E0E0 0%, #CFCFCF 100%)",
    badgeColor: "#A8A8A8",
    borderColor: "#CFCFCF",
  },
  "Advertiser": {
    gradient: "linear-gradient(180deg, #3BFFAB 0%, #00D56F 100%)",
    badgeColor: "#009F52",
    borderColor: "#00D56F",
  },
};

export const SponsorsSection = () => {
  const sponsors: Sponsor[] = [
    { name: "Govind Mahajan", city: "Chikhli", tier: "Titanium", amount: "₹61,000" },
    { name: "Dr. Devesh Minase & Ajinkya Saoji", firmName: "Boli Bhishi Group", city: "Mumbai + Dongaon", tier: "Platinum", amount: "₹51,000" },
    { name: "Abhijit (Jitu) Saoji & Vishwajit Saoji", firmName: "Saoji Group of Companies", city: "Nagpur", tier: "Gold", amount: "₹41,000" },
    { name: "Sagar Umalkar", firmName: "Satyajeet Group", city: "Pune", tier: "Gold", amount: "₹41,000" },
    { name: "Suresh Vyawahare", city: "Akot", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Prashant Shriram Saoji Family", firmName: "Arthayojan Finserve Pvt. Ltd.", city: "Mehkar", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Siddhant Vishwesh Saraf", firmName: "Grow Gold", city: "Dongaon", tier: "Silver Plus", amount: "₹35,000" },
    { name: "Nobel Infratech", firmName: "Nobel Infratech", city: "Nagpur", tier: "Silver", amount: "₹25,000" },
    { name: "Subhash & Mandar Saoji", firmName: "Swati Udyog Samuh", city: "Akola", tier: "Silver", amount: "₹25,000" },
    { name: "Jayant Umalkar", firmName: "Saral Enterprises", city: "Mumbai", tier: "Silver", amount: "₹25,000" },
    { name: "Abhijit Saoji", city: "Pune", tier: "Silver", amount: "₹25,000" },
    { name: "Vijay Vyawahare", city: "Buldhana", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Harshal Saoji", firmName: "Dr. Saoji's Ortho Pain Clinic", city: "Pune", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Girish Saoji", city: "CSN", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Rajesh Saoji & Dr. Sonali Saoji", firmName: "Saoji Cancer Clinic & Rainbow Pathology Laboratory", city: "CSN", tier: "Silver", amount: "₹25,000" },
    { name: "Dr. Sachin Saoji", city: "CSN", tier: "Advertiser", amount: "₹11,000" },
    { name: "Dr. Kedar Saoji", firmName: "Anay Dental & Implant Clinic", city: "Pune", tier: "Advertiser", amount: "₹11,000" },
    { name: "Mrunmay Saoji", firmName: "First Step Marketers", city: "Mehkar", tier: "Advertiser", amount: "₹11,000" },
    { name: "Pankaj Vyawahare", firmName: "Pankaj Vyawahare and Associates", city: "CSN", tier: "Advertiser", amount: "₹11,000" },
    { name: "Dr. Amit Vinay Saoji & Dr. Priya Amit Saoji", firmName: "Ortho Sports Care", city: "CSN", tier: "Advertiser", amount: "₹11,000" },
  ];

  // Duplicate sponsors for seamless infinite scroll
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div id="sponsors" className="bg-muted/30 py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-gold bg-clip-text text-transparent">
          Season 3 Sponsors
        </h2>
        
        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden mb-8">
          <div 
            className="flex gap-4 animate-infinite-scroll"
            style={{
              width: `${duplicatedSponsors.length * 220}px`,
            }}
          >
            {duplicatedSponsors.map((sponsor, index) => {
              const style = tierStyles[sponsor.tier];
              return (
                <Card
                  key={`sponsor-${index}`}
                  className="flex-shrink-0 w-[200px] overflow-hidden transition-all duration-300 hover:scale-105 rounded-3xl hover:pause-animation"
                  style={{
                    background: style.gradient,
                    border: `6px solid ${style.borderColor}`,
                    boxShadow: `
                      0 12px 24px rgba(0, 0, 0, 0.5),
                      0 6px 12px rgba(0, 0, 0, 0.3),
                      inset 0 2px 4px rgba(255, 255, 255, 0.4),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.4)
                    `,
                  }}
                >
                  {/* Embossed Title Badge */}
                  <div 
                    className="px-4 py-3 flex justify-center"
                    style={{
                      background: `linear-gradient(180deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))`,
                      boxShadow: `
                        inset 0 2px 4px rgba(0, 0, 0, 0.6),
                        inset 0 -1px 2px rgba(255, 255, 255, 0.2)
                      `,
                      borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <Badge
                      className="font-bold text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: style.badgeColor,
                        color: '#FFFFFF',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)',
                        boxShadow: `
                          0 3px 6px rgba(0, 0, 0, 0.5),
                          inset 0 1px 2px rgba(255, 255, 255, 0.3),
                          inset 0 -2px 4px rgba(0, 0, 0, 0.4)
                        `,
                        border: '1px solid rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      {sponsor.tier}
                    </Badge>
                  </div>
                  
                  {/* Card Content */}
                  <div 
                    className="p-4 space-y-1"
                    style={{
                      boxShadow: `
                        inset 0 4px 8px rgba(0, 0, 0, 0.3),
                        inset 0 -2px 4px rgba(255, 255, 255, 0.2)
                      `,
                      background: `linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 100%)`,
                    }}
                  >
                    <h3 
                      className="font-bold text-base text-white leading-tight line-clamp-2"
                      style={{
                        textShadow: `
                          0 3px 6px rgba(0, 0, 0, 0.8),
                          0 1px 2px rgba(0, 0, 0, 0.6),
                          0 -1px 1px rgba(255, 255, 255, 0.3)
                        `,
                      }}
                    >
                      {sponsor.name}
                    </h3>
                    {sponsor.firmName && (
                      <p 
                        className="text-white/95 text-xs font-medium line-clamp-1"
                        style={{
                          textShadow: `
                            0 2px 4px rgba(0, 0, 0, 0.7),
                            0 1px 2px rgba(0, 0, 0, 0.5)
                          `,
                        }}
                      >
                        {sponsor.firmName}
                      </p>
                    )}
                    <p 
                      className="text-white/90 text-xs"
                      style={{
                        textShadow: '0 2px 3px rgba(0, 0, 0, 0.6)',
                      }}
                    >
                      📍 {sponsor.city}
                    </p>
                    <div 
                      className="pt-2 mt-1"
                      style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <p 
                        className="text-white font-bold text-lg"
                        style={{
                          textShadow: `
                            0 3px 6px rgba(0, 0, 0, 0.8),
                            0 1px 2px rgba(0, 0, 0, 0.6),
                            0 -1px 1px rgba(255, 255, 255, 0.3)
                          `,
                        }}
                      >
                        {sponsor.amount}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* View More Button */}
        <div className="flex justify-center mb-6">
          <Button asChild variant="outline" className="border-secondary/50 hover:border-secondary hover:bg-secondary/10">
            <Link to="/sponsors" className="flex items-center gap-2">
              View All Sponsors
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Powered by LBPL Pune Cricket Team
        </p>
      </div>
    </div>
  );
};
