import { Card } from "./ui/card";

export const SponsorsSection = () => {
  // Placeholder sponsors - replace with actual sponsor logos
  const sponsors = [
    { name: "Sponsor 1", logo: "/placeholder.svg" },
    { name: "Sponsor 2", logo: "/placeholder.svg" },
    { name: "Sponsor 3", logo: "/placeholder.svg" },
    { name: "Sponsor 4", logo: "/placeholder.svg" },
  ];

  return (
    <div className="bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Our Partners
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          {sponsors.map((sponsor, index) => (
            <Card 
              key={index}
              className="p-6 flex items-center justify-center bg-background hover:bg-accent/50 transition-colors"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name}
                className="w-full h-16 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Powered by LBPL Pune Cricket Team
        </p>
      </div>
    </div>
  );
};
