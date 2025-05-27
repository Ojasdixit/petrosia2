import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { PetSpecies } from "@shared/schema";

interface PetTypeHeaderProps {
  activeType?: PetSpecies;
}

const PetTypeHeader: React.FC<PetTypeHeaderProps> = ({ activeType = "dog" }) => {
  const [location] = useLocation();

  const petTypes: { id: PetSpecies; label: string; path: string; icon: string }[] = [
    { id: "dog", label: "Dogs", path: "/pets/dogs", icon: "🐕" },
    { id: "cat", label: "Cats", path: "/pets/cats", icon: "🐈" },
    { id: "bird", label: "Birds", path: "/pets/birds", icon: "🦜" },
    { id: "fish", label: "Fish", path: "/pets/fish", icon: "🐠" },
  ];

  return (
    <div className="bg-background shadow-sm">
      <div className="container mx-auto py-4">
        <h1 className="text-3xl font-bold mb-6">Pet Directory</h1>
        <div className="flex flex-wrap gap-2">
          {petTypes.map((type) => (
            <Link key={type.id} href={type.path}>
              <div
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center",
                  activeType === type.id
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetTypeHeader;