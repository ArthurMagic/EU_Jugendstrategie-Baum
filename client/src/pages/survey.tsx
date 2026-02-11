import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Monitor, Trophy, Heart, CheckCircle2, Plane, ArrowRight, CircleEqual } from "lucide-react";
import { TopicCard } from "@/components/topic-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import bgShapes from "@/assets/images/background-shapes.png";
import successImg from "@/assets/images/success-trophy.png";

type Topic = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
};

const TOPICS: Topic[] = [
  {
    id: "school",
    title: "Bildung & Lernen",
    description: "Bildung entscheidet über Zukunftschancen, Teilhabe und soziale Gerechtigkeit.In der EU sind Bildungssysteme sehr unterschiedlich.",
    icon: <Monitor className="text-blue-600" size={20} />,
    colorClass: "bg-blue-100 text-blue-600",
  },
  {
    id: "work",
    title: "Arbeit & soziale Sicherheit",
    description: "Viele junge Menschen haben unsichere Jobs oder Schwierigkeiten beim Berufseinstieg.",
    icon: <Trophy className="text-orange-600" size={20} />,
    colorClass: "bg-orange-100 text-orange-600",
  },
  {
    id: "klima",
    title: "Klima & nachhaltige Entwicklung",
    description: "Junge Menschen sind besonders von den langfristigen Folgen des Klimawandels betroffen.",
    icon: <Leaf className="text-emerald-600" size={20} />,
    colorClass: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "mental",
    title: "Gesundheit & Wohlbefinden",
    description: "Psychische Belastungen nehmen bei Jugendlichen europaweit zu.",
    icon: <Heart className="text-pink-600" size={20} />,
    colorClass: "bg-pink-100 text-pink-600",
  },
  {
    id: "participation",
    title: "Demokratie & Jugendbeteiligung",
    description: "Viele Jugendliche fühlen sich politisch nicht gehört.",
    icon: <CheckCircle2 className="text-purple-600" size={20} />,
    colorClass: "bg-purple-100 text-purple-600",
  },
  {
    id: "future",
    title: "Digitalisierung & Medien",
    description: "Digitale Medien prägen Alltag, Lernen und Meinungsbildung junger Menschen.",
    icon: <Monitor className="text-blue-600" size={20} />,
    colorClass: "bg-blue-100 text-blue-600",
  },
  {
    id: "equality",
    title: "Gleichstellung & Inklusion",
    description: "Nicht alle Jugendlichen haben die gleichen Chancen – abhängig von Geschlecht, Herkunft oder Behinderung.",
    icon: <CircleEqual className="text-yellow-600" size={20} />,
    colorClass: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "europe",
    title: "Europa & internationale Begegnung",
    description: "Der Austausch zwischen Jugendlichen aus verschiedenen Ländern fördert Verständnis und Zusammenhalt in Europa.",
    icon: <Plane className="text-cyan-600" size={20} />,
    colorClass: "bg-cyan-100 text-cyan-600",
  }
];

export default function SurveyPage() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const totalPoints = 3;
  const usedPoints = Object.values(points).reduce((a, b) => a + b, 0);
  const remainingPoints = totalPoints - usedPoints;

  function checkCookie() {
    const exists = document.cookie
      .split("; ")
      .find(row => row.startsWith("voted="));

    if (exists) {
      setCanVote(false);
    }
  }
  useEffect(() => {
    checkCookie();
  }, []);

  const handleAdd = (id: string) => {
    if (usedPoints >= totalPoints) return;
    setPoints((prev) => {
      const current = prev[id] || 0;
      if (current >= 3) return prev;
      return { ...prev, [id]: current + 1 };
    });
    console.log("Debug Points:", { ...points, [id]: (points[id] || 0) + 1 });
    //console.log("Debug Points:", points);
  };

  const handleRemove = (id: string) => {
    setPoints((prev) => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      const next = { ...prev, [id]: current - 1 };
      if (next[id] === 0) delete next[id];
      return next;
    });
    console.log("Debug Points:", { ...points, [id]: (points[id] || 0) - 1 });
    //console.log("Debug Points:", points);
  };

  const submitSurvey = () => {
    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ points: points })
    });
    document.cookie = "voted=true; max-age=3600; path=/; SameSite=Strict";
    setCanVote(false);
  }
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <img src={bgShapes} alt="" className="w-full h-full object-cover" />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50"
        >
          <motion.img
            src={successImg}
            alt="Success"
            className="w-48 h-48 mx-auto mb-6 object-contain drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <motion.h2
            className="text-3xl font-bold font-display text-gray-900 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Danke für deine Teilnahme!
          </motion.h2>
          <motion.p
            className="text-gray-600 font-medium mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Deine Stimme zählt. Wir werten alle Ergebnisse aus und melden uns bald.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => {
                setPoints({});
                setIsSubmitted(false);
              }}
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900"
            >
              Zurück zum Start
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 relative">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-4xl p-6 relative z-10">
        <header className="mb-10 text-center pt-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm text-sm font-semibold text-primary mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Schüler-Mitbestimmung 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-display mb-3 text-gray-900 tracking-tight"
          >
            Themen-Ranking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 font-medium max-w-xl mx-auto"
          >
            Du hast <span className="text-primary font-bold">3 Prioritätspunkte</span>. Verteile sie frei auf die Themen, die dir am wichtigsten sind.
          </motion.p>
        </header>
        <div>
          {canVote ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {TOPICS.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <TopicCard
                    {...topic}
                    points={points[topic.id] || 0}
                    canAdd={remainingPoints > 0 && (points[topic.id] || 0) < 3}
                    canRemove={(points[topic.id] || 0) > 0}
                    onAdd={() => handleAdd(topic.id)}
                    onRemove={() => handleRemove(topic.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 font-medium mt-20">Du hast bereits abgestimmt. Vielen Dank für deine Teilnahme!</div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50"
      >
        <div className="container mx-auto max-w-4xl flex items-center justify-between gap-6">
          <div className="flex-1 max-w-xs hidden md:block">
            <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
              <span>Vergebene Punkte</span>
              <span className={cn(usedPoints === 3 ? "text-primary" : "text-gray-900")}>
                {usedPoints} / {totalPoints}
              </span>
            </div>
            <Progress value={(usedPoints / totalPoints) * 100} className="h-3 bg-gray-100" />
          </div>

          <div className="flex-1 md:hidden">
            <div className="text-sm font-bold text-gray-600 mb-1">Punkte: {usedPoints}/{totalPoints}</div>
            <div className="flex gap-1 h-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={cn("flex-1 rounded-full", i <= usedPoints ? "bg-primary" : "bg-gray-200")} />
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => { setIsSubmitted(true); submitSurvey() }}
            disabled={usedPoints === 0}
            className={cn(
              "h-14 px-8 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300",
              usedPoints > 0
                ? "bg-gray-900 hover:bg-black text-white hover:scale-105 hover:shadow-xl"
                : "bg-gray-100 text-gray-400"
            )}
            data-testid="button-submit"
          >
            Abgeben
            {usedPoints > 0 && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
