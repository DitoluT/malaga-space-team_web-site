import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  url: string;
}

const defaultPartners = [
  {
    name: "European Space Agency",
    logo_url: "https://images.pexels.com/photos/23764/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "https://www.esa.int/"
  },
  {
    name: "Spanish National Research Council",
    logo_url: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "https://www.csic.es/"
  },
  {
    name: "Aerospace Engineering Corporation",
    logo_url: "https://images.pexels.com/photos/2166/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "#"
  },
  {
    name: "National Institute of Aerospace Technology",
    logo_url: "https://images.pexels.com/photos/41951/solar-system-emergence-spitzer-telescope-telescope-41951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    url: "https://www.inta.es/"
  }
];

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.webPartners);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setPartners(data.data);
        } else {
            setPartners([]);
        }
      } catch (e) {
        console.error("Failed to fetch partners", e);
        setPartners(defaultPartners as any);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (!loading && partners.length === 0) return null;

  const displayPartners = loading ? defaultPartners : partners;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Our Partners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading organizations in space technology and research to make our CubeSat project a success.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayPartners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-card border hover:border-primary transition-colors hover:scale-105 transform duration-200"
            >
              <div className="w-full aspect-video mb-4 rounded-md overflow-hidden flex items-center justify-center bg-white/5">
                {partner.logo_url ? (
                    <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-full h-full object-contain"
                    />
                ) : (
                    <span className="text-xs text-muted-foreground">{partner.name}</span>
                )}
              </div>
              <span className="text-center font-medium text-sm">{partner.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
