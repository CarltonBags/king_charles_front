"use client";

import { submitPrefilter, getDrinks } from "../query";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Star } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DrinkResult {
  metadata: {
    id: string;
    abv: number;
    name: string;
    notes: string;
    notes_de: string;
    category: string;
    category_de: string;
    origin: string;
    tags: string[];
    tags_de: string[];
    subcategory: string;
    subcategory_de: string;
    brand_or_producer: string;
    food_pairings: string[];
    taste_profile: Record<string, unknown>;
    metadata: Record<string, unknown>;
  };
  similarity: number;
}

const welcomeMessage =
  "WILLKOMMEN IM THE LONDONER!<br/><br/>Ich bin Charles, dein drink guide! Sag mir, worauf du Lust hast und wir finden das passende Getraenk fuer deine Stimmung.";

function formatMessage(content: string): string {
  return content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className="flex justify-center animate-fade-in-up">
      <div className="w-full">
        <div
          style={{
            padding: "10px 14px",
            border: "2px solid #f0f0e0",
            backgroundColor: isUser ? "#e8b830" : "#0d0d0f",
            color: isUser ? "#020201" : "#f0f0e0",
            fontSize: "20px",
            lineHeight: "1.5",
            fontFamily: "'Jersey 10', monospace",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-center animate-fade-in-up">
      <div style={{ padding: "10px 14px", border: "2px solid #f0f0e0", backgroundColor: "#0d0d0f", display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ color: "#f5d060", fontSize: "20px", fontFamily: "'Jersey 10', monospace" }}>TYPING</span>
        <span className="blink" style={{ color: "#f0f0e0", fontSize: "20px", fontFamily: "'Jersey 10', monospace" }}>...</span>
      </div>
    </div>
  );
}

function DrinkCard({ drink, rank }: { drink: DrinkResult; rank: number }) {
  const { metadata, similarity } = drink;
  const pct = Math.round(similarity * 100);
  const isTop = rank === 1;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="animate-fade-in-up flex gap-3 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: "10px",
        border: "2px solid #f0f0e0",
        backgroundColor: "#0d0d0f",
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
          <h3 style={{ fontFamily: "'Jersey 10', monospace", fontSize: "24px", color: "#f5d060", lineHeight: "1.3" }}>{metadata.name}</h3>
          <span style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", padding: "1px 5px", backgroundColor: "rgba(232,184,48,0.75)", color: "#020201", border: "1px solid rgba(184,144,32,0.5)" }}>{metadata.abv}%</span>
        </div>
        <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "18px", color: "#5cc8d0", marginBottom: "4px" }}>
          {metadata.category_de || metadata.category}{metadata.origin ? ` // ${metadata.origin}` : ""}
        </p>
        <p style={{
          fontFamily: "'Jersey 10', monospace", fontSize: "16px", color: "#b0b0c0", lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 3,
          WebkitBoxOrient: "vertical",
          overflow: expanded ? "visible" : "hidden",
          transition: "all 0.3s ease",
        }}>
          {metadata.notes_de || metadata.notes}
        </p>

        {/* Expanded metadata */}
        <div style={{
          maxHeight: expanded ? "300px" : "0px",
          overflow: "hidden",
          opacity: expanded ? 1 : 0,
          transition: "all 0.35s ease",
        }}>
          {metadata.brand_or_producer && (
            <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "16px", color: "#a090c0", marginTop: "6px" }}>
              {metadata.brand_or_producer}
            </p>
          )}
          {metadata.subcategory_de && (
            <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", color: "#707080", marginTop: "2px" }}>
              {metadata.subcategory_de || metadata.subcategory}
            </p>
          )}
          {metadata.tags_de && metadata.tags_de.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {metadata.tags_de.slice(0, 5).map((tag: string) => (
                <span key={tag} style={{ fontFamily: "'Jersey 10', monospace", fontSize: "12px", padding: "1px 6px", border: "1px solid #606068", color: "#a0a0b0" }}>{tag}</span>
              ))}
            </div>
          )}
          {metadata.food_pairings && metadata.food_pairings.length > 0 && (
            <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "14px", color: "#807860", marginTop: "4px" }}>
              ++ {metadata.food_pairings.slice(0, 3).join(", ")}
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <p style={{ fontFamily: "'Jersey 10', monospace", fontSize: "12px", color: "#606068", marginTop: "4px", textAlign: "center" }}>
          {expanded ? "▲" : "▼ MORE"}
        </p>
      </div>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-pixel-in" style={{ backgroundColor: "#020201" }}>
      <img src="/images/THINKING.png" alt="Charles is thinking..." className="w-full max-w-xs h-auto object-contain" style={{ imageRendering: "pixelated" }} />
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [drinks, setDrinks] = useState<DrinkResult[]>([]);
  const [isLoadingDrinks, setIsLoadingDrinks] = useState(false);
  const [selectionSplash, setSelectionSplash] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 3000); return () => clearTimeout(t); }, []);
  useEffect(() => { setMessages([{ id: "welcome-0", role: "assistant", content: welcomeMessage, timestamp: new Date() }]); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "instant" }); }, [messages]);

  // Scroll to top when results arrive
  useEffect(() => {
    if (drinks.length > 0 && !isLoadingDrinks) {
      messagesContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [drinks, isLoadingDrinks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoadingDrinks) return;
    const userMsg: Message = { id: `user-${Date.now()}`, role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setDrinks([]);
    setIsLoadingDrinks(true);
    try {
      const prefilter = await submitPrefilter(userMsg.content);
      if (prefilter) {
        const raw = await getDrinks(prefilter);
        const sorted: DrinkResult[] = (raw as DrinkResult[]).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
        setDrinks(sorted);
        setMessages((prev) => [...prev, { id: `asst-${Date.now()}`, role: "assistant", content: `HIER SIND DEINE TOP-${sorted.length} EMPFEHLUNGEN:`, timestamp: new Date() }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { id: `asst-${Date.now()}`, role: "assistant", content: "FEHLER! BITTE VERSUCHE ES ERNEUT.", timestamp: new Date() }]);
    } finally {
      setIsLoadingDrinks(false);
    }
  };

  return (
    <div className="flex flex-col h-dvh w-full items-center justify-center relative" style={{ backgroundColor: "#020201" }}>
      {isLoadingDrinks && <LoadingOverlay />}
      {selectionSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-pixel-in" style={{ backgroundColor: "#020201" }}>
          <img src="/images/SELECTION.png" alt="Charles' Selection" className="w-full max-w-md h-auto object-contain" style={{ imageRendering: "pixelated" }} />
        </div>
      )}
      {showSplash && (
        <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "#020201" }}>
          <img src="/images/DRINK_GUIDE_OPEN.png" alt="The Londoner Drink Guide" className="w-full max-w-md h-auto object-contain animate-pixel-in" style={{ imageRendering: "pixelated" }} />
        </div>
      )}
      <div className={`flex flex-col h-dvh max-w-2xl mx-auto p-3 ${showSplash ? "opacity-0" : "opacity-100"}`}>
        <div className="flex-1 flex flex-col overflow-hidden" style={{ border: "2px solid #f0f0e0", boxShadow: "0 0 0 2px #020201, 0 0 0 4px #f0f0e0", backgroundColor: "#0d0d0f" }}>
          <header className="flex items-center justify-center" style={{ backgroundColor: "#020201" }}>
            <img src="/images/HEADER.png" alt="The Londoner Drink Guide" onClick={() => router.push("/")} className="w-full max-w-[180px] h-auto object-contain mx-auto cursor-pointer" style={{ imageRendering: "pixelated" }} />
          </header>
          <div className="pxl-divider w-full" />
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto chat-scroll p-4" style={{ backgroundColor: "#020201" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {drinks.length === 0 && (
                <>
                  {messages.map((message) => (<MessageBubble key={message.id} message={message} />))}
                  {isLoadingDrinks && <TypingIndicator />}
                  <div className="flex justify-center animate-fade-in-up">
                    <button type="button" onClick={() => { setSelectionSplash(true); setTimeout(() => router.push("/charles_selection"), 1000); }}
                      className="bg-transparent border-0 p-0 cursor-pointer">
                      <img src="/images/SIGN.png" alt="Charles' Selection" className="w-full max-w-[240px] h-auto object-contain" style={{ imageRendering: "pixelated" }} />
                    </button>
                  </div>
                </>
              )}
              {drinks.length > 0 && !isLoadingDrinks && (
                <div className="animate-pixel-in" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="pxl-divider w-full" />
                  {drinks.map((drink, i) => (<DrinkCard key={drink.metadata.id} drink={drink} rank={i + 1} />))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ borderTop: "2px solid #606068", backgroundColor: "#0d0d0f", padding: "12px" }}>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center" style={{ border: "2px solid #606068", backgroundColor: "#020201" }}>
                <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="> WHAT MOOD?" className="flex-1 bg-transparent outline-none px-3 py-3"
                  style={{ color: "#f0f0e0", fontFamily: "'Jersey 10', monospace", fontSize: "20px" }}
                  disabled={isLoadingDrinks} />
              </div>
              <button type="submit" disabled={!input.trim() || isLoadingDrinks}
                className="flex items-center justify-center bg-transparent border-0 p-0">
                <img src="/images/BUTTON.png" alt="Send" className="w-12 h-12 object-contain" style={{ imageRendering: "pixelated" }} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
