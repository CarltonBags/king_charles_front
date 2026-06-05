"use client";

import { submitPrefilter } from "./query";
import { useState, useRef, useEffect, SubmitEventHandler } from "react";
import {
  Send,
  Star,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const welcomeMessages = [
  "WILLKOMMEN IM THE LONDONER!",
  "Ich bin Charles, dein drink guide! Sag mir, worauf du Lust hast und wir finden das passende Getränk für deine Stimmung.",
];


function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div className="max-w-[85%]">
        <div
          className={`px-4 py-3 neo-border neo-shadow-sm ${
            isUser
              ? "bg-pub-green text-white"
              : "bg-paper text-neo-black"
          }`}
        >
          <div
            className="text-sm leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        </div>
        <div
          className={`text-xs mt-1 font-mono ${
            isUser ? "text-pub-green text-right" : "text-brown-light text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in-up">
      <div className="bg-paper neo-border neo-shadow-sm px-4 py-3">
        <div className="flex gap-2 items-center">
          <span className="font-mono text-sm text-brown">typing</span>
          <span className="blink font-mono text-sm">...</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const welcomeMsgs: Message[] = welcomeMessages.map((text, i) => ({
      id: `welcome-${i}`,
      role: "assistant",
      content: text,
      timestamp: new Date(),
    }));
    setMessages(welcomeMsgs);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    try{
        const prefilter = await submitPrefilter(input.trim())
        console.log("prefilter result:", prefilter)
    }catch(e){
      console.log("error prefiltering", e)
    }

  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center relative" style={{ backgroundColor: "#272424" }}>
      {/* Splash Screen */}
      {showSplash && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "#272424" }}
        >
          <img
            src="/images/DRINK GUIDE.png"
            alt="The Londoner Drink Guide"
            className="w-full max-w-md h-auto object-contain animate-[fadeIn_0.3s_ease-out]"
          />
        </div>
      )}

      {/* Chat Container */}
      <div className={`flex flex-col h-screen max-w-2xl mx-auto p-3 transition-opacity duration-500 ${showSplash ? "opacity-0" : "opacity-100"}`}>
        {/* Outer container - neo brutalist frame */}
      <div className="flex-1 flex flex-col neo-border neo-shadow-lg bg-paper overflow-hidden">
        {/* Header */}
        <header className="bg-cream neo-border-b-4 border-neo-black px-5 py-5 flex flex-col items-center justify-center">
          <h1 className="font-black text-2xl tracking-tight leading-none">
            The Londoner
          </h1>
          <span className="font-bold text-xs bg-pub-green text-white px-3 py-1 mt-1 neo-border-sm">
            Drink Guide
          </span>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll p-4 space-y-3 bg-paper-light">
            <div className="space-y-3">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>


          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="neo-border-t-4 border-neo-black bg-cream p-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-white neo-border neo-shadow-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-transparent outline-none text-neo-black placeholder-brown-light/50 text-sm font-mono px-3 py-3"
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-12 h-12 neo-border neo-shadow neo-shadow-hover neo-shadow-active bg-pub-green text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:neo-shadow-sm disabled:neo-shadow-hover"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center mt-3 px-1">
              <button
                type="button"
                className="flex items-center gap-1.5 text-neo-black text-xs font-bold transition-colors neo-border-sm bg-yellow-accent px-4 py-2 neo-shadow-sm neo-shadow-hover"
              >
                <Star className="w-3 h-3" />
                <span>Charles' Selection</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
