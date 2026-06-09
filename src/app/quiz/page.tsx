"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correct: number;
  category: string;
}

type Phase = "start" | "playing" | "finished";

export default function QuizPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [phase, setPhase] = useState<Phase>("start");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timer, setTimer] = useState(8);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch("/api/quiz");
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 3000); return () => clearTimeout(t); }, []);

  const startQuiz = async () => {
    await fetchQuestions();
    setPhase("playing");
    setCurrent(0);
    setScore(0);
    setTimer(8);
    setSelected(null);
  };

  const nextQuestion = useCallback(() => {
    if (current + 1 >= questions.length) {
      setPhase("finished");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setTimer(8);
    }
  }, [current, questions.length]);

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (timer <= 0) {
      nextQuestion();
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, phase, nextQuestion]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions[current].correct) {
      setScore((s) => s + 1);
    }
    setTimeout(() => nextQuestion(), 800);
  };

  const q = questions[current];

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#020201", color: "#f0f0e0", fontFamily: "'Jersey 10', monospace", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative" }}>
      {showSplash && (
        <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "#020201" }}>
          <img src="/images/QUIZ_SPLASH.png" alt="Pub Quiz" className="w-full max-w-md h-auto object-contain animate-pixel-in" style={{ imageRendering: "pixelated" }} />
        </div>
      )}
      <div style={{ width: "100%", maxWidth: "480px", textAlign: "center", opacity: showSplash ? 0 : 1 }}>
        {/* Header */}
        <img src="/images/HEADER.png" alt="The Londoner" onClick={() => router.push("/")} style={{ maxWidth: "160px", margin: "0 auto 16px", imageRendering: "pixelated", cursor: "pointer" }} />

        {phase === "start" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
            <p style={{ fontSize: "24px", color: "#f5d060" }}>PUB QUIZ TRAINER</p>
            <p style={{ fontSize: "16px", color: "#808090", lineHeight: "1.5" }}>
              10 Fragen<br/>7 Sekunden pro Frage<br/>Bist du bereit?
            </p>
            <button
              onClick={startQuiz}
              disabled={loading}
              style={{
                fontFamily: "'Jersey 10', monospace", fontSize: "24px",
                padding: "12px 32px", backgroundColor: "#e8b830", color: "#020201",
                border: "2px solid #b89020", cursor: "pointer",
              }}
            >
              {loading ? "LADE..." : "START"}
            </button>
          </div>
        )}

        {phase === "playing" && q && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", color: "#808090" }}>
              <span>FRAGE {current + 1}/10</span>
              <span style={{ color: timer <= 2 ? "#e04040" : "#5cc8d0" }}>{timer}s</span>
            </div>

            {/* Timer bar */}
            <div style={{ height: "6px", backgroundColor: "#151518", border: "1px solid #606068" }}>
              <div style={{ height: "100%", width: `${Math.max(0, ((timer - 1) / 7)) * 100}%`, backgroundColor: timer <= 2 ? "#e04040" : "#5cc8d0" }} />
            </div>

            {/* Question */}
            <p style={{ fontSize: "20px", color: "#f5d060", lineHeight: "1.4" }}>{q.question}</p>

            {/* Answers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {q.answers.map((answer, idx) => {
                let bg = "#0d0d0f";
                let border = "2px solid #606068";
                if (selected !== null) {
                  if (idx === q.correct) {
                    bg = "#38b840"; border = "2px solid #209828";
                  } else if (idx === selected && idx !== q.correct) {
                    bg = "#e04040"; border = "2px solid #b82828";
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selected !== null}
                    style={{
                      fontFamily: "'Jersey 10', monospace", fontSize: "18px",
                      padding: "10px", backgroundColor: bg, color: selected !== null && idx === q.correct ? "#020201" : "#f0f0e0",
                      border, cursor: selected !== null ? "default" : "pointer",
                      textAlign: "left",
                    }}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === "finished" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
            <p style={{ fontSize: "28px", color: "#f5d060" }}>ERGEBNIS</p>
            <p style={{ fontSize: "48px", color: score >= 7 ? "#38b840" : score >= 4 ? "#e8b830" : "#e04040" }}>
              {score}/10
            </p>
            <p style={{ fontSize: "18px", color: "#808090" }}>
              {score >= 9 ? "Unglaublich!" : score >= 7 ? "Gut gemacht!" : score >= 4 ? "Nicht schlecht!" : "Mehr Glück nächstes Mal!"}
            </p>
            <button
              onClick={startQuiz}
              style={{
                fontFamily: "'Jersey 10', monospace", fontSize: "20px",
                padding: "10px 28px", backgroundColor: "#e8b830", color: "#020201",
                border: "2px solid #b89020", cursor: "pointer",
              }}
            >
              NOCHMAL
            </button>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "6px 0", backgroundColor: "#020201", fontFamily: "'Jersey 10', monospace", fontSize: "12px", color: "#606068" }}>
        built with thirst by <a href="https://byzerolab.de" target="_blank" style={{ color: "#f5d060", textDecoration: "none" }}>byzerolab.de</a>
      </div>
    </div>
  );
}
