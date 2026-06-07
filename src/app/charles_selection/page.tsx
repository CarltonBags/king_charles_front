"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import pub_beer_003 from "./pub_beer_003.json";
import pub_gin_014 from "./pub_gin_014.json";
import pub_special_001 from "./pub_special_001.json";
import pub_special_004 from "./pub_special_004.json";
import pub_whisky_015 from "./pub_whisky_015.json";

interface CharlesDrink {
  id: string;
  name: string;
  category: string;
  category_de: string;
  subcategory: string;
  subcategory_de: string;
  abv: number;
  origin: string;
  notes: string;
  notes_de: string;
  brand_or_producer: string;
  food_pairings?: string[];
  tags_de?: string[];
}

const drinks: CharlesDrink[] = [pub_beer_003, pub_gin_014, pub_special_001, pub_special_004, pub_whisky_015];

function DrinkCard({ drink, rank }: { drink: CharlesDrink; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const isTop = rank === 1;

  return (
    <div
      className="animate-fade-in-up flex gap-3 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: "10px", border: "2px solid #f0f0e0", backgroundColor: "#0d0d0f",
        transition: "all 0.3s ease",
        transform: expanded ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div className="flex-shrink-0 flex items-center justify-center"
        style={{ width: "36px", height: "36px", backgroundColor: isTop ? "#e8b830" : "#151518", color: isTop ? "#020201" : "#808090", fontFamily: "'Jersey 10', monospace", fontSize: "24px", border: isTop ? "2px solid #f0f0e0" : "1px solid #606068" }}>
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 style={{ fontFamily: "'Jersey 10', monospace", fontSize: "24px", color: "#f5d060", lineHeight: "1.3" }}>{drink.name}</h3>
          <span style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", padding: "1px 5px", backgroundColor: "rgba(232,184,48,0.75)", color: "#020201", border: "1px solid rgba(184,144,32,0.5)" }}>{drink.abv}%</span>
        </div>
        <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "18px", color: "#5cc8d0", marginBottom: "4px" }}>
          {drink.category_de || drink.category}{drink.origin ? ` // ${drink.origin}` : ""}
        </p>
        <p style={{
          fontFamily: "'Jersey 10', monospace", fontSize: "16px", color: "#b0b0c0", lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 4,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          transition: "all 0.3s ease",
        }}>
          {drink.notes_de || drink.notes}
        </p>

        <div style={{
          maxHeight: expanded ? "300px" : "0px", overflow: "hidden",
          opacity: expanded ? 1 : 0, transition: "all 0.35s ease",
        }}>
         
          {drink.subcategory_de && (
            <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", color: "#707080", marginTop: "2px" }}>
              {drink.subcategory_de || drink.subcategory}
            </p>
          )}
          {drink.tags_de && drink.tags_de.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {drink.tags_de.slice(0, 5).map((tag: string) => (
                <span key={tag} style={{ fontFamily: "'Jersey 10', monospace", fontSize: "12px", padding: "1px 6px", border: "1px solid #606068", color: "#a0a0b0" }}>{tag}</span>
              ))}
            </div>
          )}
          {drink.food_pairings && drink.food_pairings.length > 0 && (
            <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", color: "#807860", marginTop: "4px" }}>
              dazu am besten: {drink.food_pairings.slice(0, 3).join(", ")}
            </p>
          )}
        </div>

        <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "12px", color: "#606068", marginTop: "4px", textAlign: "center" }}>
          {expanded ? "▲" : "▼ MORE"}
        </p>
      </div>
    </div>
  );
}

export default function CharlesSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: "#020201" }}>
      <div className="w-full max-w-2xl mx-auto p-3">
        <div className="flex flex-col overflow-hidden" style={{ border: "2px solid #f0f0e0", boxShadow: "0 0 0 2px #020201, 0 0 0 4px #f0f0e0", backgroundColor: "#0d0d0f", minHeight: "100vh" }}>
          <header className="flex items-center justify-center" style={{ backgroundColor: "#020201" }}>
            <img src="/images/HEADER.png" alt="The Londoner Drink Guide" onClick={() => router.push("/")} className="w-full max-w-[180px] h-auto object-contain mx-auto cursor-pointer" style={{ imageRendering: "pixelated" }} />
          </header>
          <div className="pxl-divider w-full" />
          <div className="flex-1 p-4" style={{ backgroundColor: "#020201", display: "flex", flexDirection: "column", gap: "10px" }}>
            {drinks.map((drink, i) => (<DrinkCard key={drink.id} drink={drink} rank={i + 1} />))}
          </div>
        </div>
      </div>
    </div>
  );
}
