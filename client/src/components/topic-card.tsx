import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  points: number;
  canAdd: boolean;
  canRemove: boolean;
  colorClass: string; // e.g., "bg-emerald-100 text-emerald-700"
  onAdd: () => void;
  onRemove: () => void;
}

export function TopicCard({
  id,
  title,
  description,
  icon,
  points,
  canAdd,
  canRemove,
  colorClass,
  onAdd,
  onRemove,
}: TopicCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300",
        points > 0 ? "shadow-md ring-2 ring-offset-2 ring-primary/20" : "hover:shadow-md"
      )}
      data-testid={`card-topic-${id}`}
    >
      <div className={cn("absolute top-0 left-0 w-2 h-full", colorClass)} />
      
      <div className="p-5 pl-7 flex flex-col h-full justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className={cn("p-1.5 rounded-lg bg-opacity-20", colorClass)}>{icon}</span>}
            <h3 className="font-display font-bold text-xl text-gray-800 leading-tight">
              {title}
            </h3>
          </div>
          {description && (
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors duration-300",
                  i <= points 
                    ? "bg-gray-800" 
                    : "bg-gray-100"
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl">
            <button
              onClick={onRemove}
              disabled={!canRemove}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all active:scale-95",
                canRemove
                  ? "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
                  : "bg-transparent text-gray-300 cursor-not-allowed"
              )}
              data-testid={`btn-remove-${id}`}
            >
              <Minus size={18} strokeWidth={3} />
            </button>
            
            <div className="w-6 text-center font-bold text-xl font-display tabular-nums">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={points}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="block"
                >
                  {points}
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              onClick={onAdd}
              disabled={!canAdd}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all active:scale-95",
                canAdd
                  ? "bg-gray-900 text-white shadow-md hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              data-testid={`btn-add-${id}`}
            >
              <Plus size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
