"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import Celebration from "./completion/day/celebration";
import StreakProgression from "./completion/day/streak-progression";
import TaskImpactVisualization from "./completion/day/task-impact";
import DimensionDetail from "./completion/day/dimension-detail";
import RadarChart from "./completion/day/radar-chart";
import AnimatedCounter from "./completion/day/animated-counter";
import Particle from "./completion/day/particle";
import {
  CompletedTask,
  DailyTask,
  Dimension,
  DimensionValue,
  Task,
} from "@prisma/client";
import { isSameDay } from "date-fns";

interface DimensionValueWithDimension extends DimensionValue {
  dimension: Dimension;
}

interface CompleteFlowProps {
  tasks: (DailyTask & {
    task: Task & {
      dimension: Dimension;
    };
    completions: CompletedTask[];
  })[];
  currentStreak: number;
  onComplete: (newStreak: number) => void;
  dimensionValues: DimensionValueWithDimension[];
  dimensions: Dimension[];
  challengeDuration: number;
  userLevel: number;
}

const TaskCompletionFlow = ({
  tasks,
  currentStreak,
  onComplete,
  dimensionValues,
  dimensions,
  challengeDuration,
  userLevel,
}: CompleteFlowProps) => {
  const [flowStep, setFlowStep] = useState("welcome");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [updatedDimensions, setUpdatedDimensions] = useState(
    dimensions.map((dimension) => {
      const valueEntry = dimensionValues.find(
        (dv) => dv.dimension.id === dimension.id
      );
      return {
        ...dimension,
        value: valueEntry ? valueEntry.value : 0,
      };
    })
  );
  const [animatingDimension, setAnimatingDimension] = useState<{
    name: string;
    oldValue: number;
    newValue: number;
  } | null>(null);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [calculatedNewStreak, setCalculatedNewStreak] = useState(currentStreak);

  const today = new Date();
  const completedTasks = tasks.filter((task) =>
    task.completions.some((c) => isSameDay(new Date(c.completedAt), today))
  );

  const calculateXpEarned = () => {
    const baseXp = completedTasks.length * 50;
    const streakBonus = Math.floor(calculatedNewStreak / 7) * 50;
    return baseXp + streakBonus;
  };

  const calculateImpactMultiplier = () => {
    return 1 + Math.floor(calculatedNewStreak / 7) * 0.5;
  };

  // Calculate new streak on component mount
  useEffect(() => {
    // Simple streak calculation logic for display
    // The actual streak will be calculated on the server
    const newStreak = currentStreak + 1;
    setCalculatedNewStreak(newStreak);
  }, [currentStreak]);

  useEffect(() => {
    if (
      flowStep === "dimensions" &&
      currentTaskIndex < completedTasks.length &&
      !isAnimating
    ) {
      const task = completedTasks[currentTaskIndex];
      if (!task) return;

      const dimensionIndex = updatedDimensions.findIndex(
        (d) => d.name === task.task.dimension.name
      );

      if (dimensionIndex !== -1) {
        const oldValue = updatedDimensions[dimensionIndex].value;
        const baseImpact = 0.1; // Base impact per task
        const impactMultiplier = calculateImpactMultiplier();
        const impactValue = baseImpact * impactMultiplier;

        const newValue = Math.min(100, oldValue + impactValue);

        setIsAnimating(true);
        setAnimatingDimension({
          name: task.task.dimension.name,
          oldValue: oldValue,
          newValue,
        });

        const timer = setTimeout(() => {
          setUpdatedDimensions((prevDimensions) => {
            const newDimensions = [...prevDimensions];
            newDimensions[dimensionIndex] = {
              ...newDimensions[dimensionIndex],
              value: newValue,
            };
            return newDimensions;
          });
          setAnimatingDimension(null);
          setIsAnimating(false);
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [
    flowStep,
    currentTaskIndex,
    isAnimating,
    updatedDimensions,
    completedTasks,
    calculatedNewStreak,
  ]);

  const handleNextTask = useCallback(() => {
    if (currentTaskIndex < completedTasks.length - 1) {
      setCurrentTaskIndex((prevIndex) => prevIndex + 1);
    } else {
      setFlowStep("streak");
    }
  }, [currentTaskIndex, completedTasks.length]);

  const handleDimensionClick = useCallback((dimension: string) => {
    setSelectedDimension(dimension);
  }, []);

  const handleContinue = useCallback(() => {
    if (flowStep === "welcome") setFlowStep("dimensions");
    else if (flowStep === "streak") setFlowStep("celebration");
    else if (flowStep === "celebration") onComplete(calculatedNewStreak);
  }, [flowStep, calculatedNewStreak, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        className="bg-[#282828] rounded-xl border border-[#3c3836] w-full max-w-md overflow-hidden shadow-xl"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            {flowStep === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                    duration: 0.8,
                  }}
                  className="mb-4"
                >
                  <Sparkles className="w-16 h-16 text-[#fe8019] mx-auto" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-[#ebdbb2] mb-2"
                >
                  Day Complete!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#a89984] mb-6"
                >
                  Congratulations! You&apos;ve completed all your tasks for
                  today.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative mb-6"
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Particle key={i} color="#fe8019" speed={1.5} />
                  ))}

                  <div className="relative z-10 bg-[#1d2021] rounded-lg p-6 border border-[#3c3836]">
                    <div className="text-center mb-4">
                      <div className="text-sm text-[#a89984]">
                        Tasks Completed
                      </div>
                      <motion.div
                        className="text-4xl font-bold text-[#ebdbb2]"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                          delay: 0.3,
                        }}
                      >
                        <AnimatedCounter value={completedTasks.length} />
                      </motion.div>
                    </div>

                    <div className="flex justify-center gap-2 mb-4">
                      {completedTasks.map((dailyTask, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.4 + i * 0.08,
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                          }}
                          className="h-8 w-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: dailyTask.task.dimension.color,
                          }}
                        >
                          <Check className="h-4 w-4 text-[#1d2021]" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-sm text-[#a89984] text-center">
                      Let&apos;s see how these tasks have improved your
                      spiritual dimensions.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: 1,
                  }}
                >
                  <Button
                    className="bg-[#fe8019] text-[#1d2021] hover:bg-[#fe8019]/90 px-8"
                    onClick={handleContinue}
                    size="lg"
                  >
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {flowStep === "dimensions" && (
              <motion.div
                key="dimensions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-[#ebdbb2]">
                    Spiritual Growth
                  </h2>
                  <Badge className="bg-[#3c3836] text-[#a89984]">
                    {currentTaskIndex + 1}/{completedTasks.length}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div className="mb-4">
                    <RadarChart
                      dimensions={updatedDimensions}
                      showAnimation={true}
                      animateDimension={animatingDimension}
                      highlightDimension={
                        completedTasks[currentTaskIndex]?.task.dimension.name
                      }
                      interactive={true}
                      onDimensionClick={handleDimensionClick}
                    />
                  </div>

                  <AnimatePresence>
                    {selectedDimension ? (
                      <DimensionDetail
                        dimension={updatedDimensions.find(
                          (d) => d.name === selectedDimension
                        )}
                        value={
                          updatedDimensions.find(
                            (d) => d.name === selectedDimension
                          )?.value || 5
                        }
                        onClose={() => setSelectedDimension(null)}
                      />
                    ) : (
                      <TaskImpactVisualization
                        task={completedTasks[currentTaskIndex]?.task}
                        dimension={
                          completedTasks[currentTaskIndex]?.task?.dimension
                        }
                        impact={
                          updatedDimensions.find(
                            (d) =>
                              d.id ===
                              completedTasks[currentTaskIndex]?.task
                                ?.dimensionId
                          )?.value || 0
                        }
                        onComplete={handleNextTask}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {flowStep === "streak" && (
              <motion.div
                key="streak"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <StreakProgression
                  currentStreak={currentStreak}
                  newStreak={calculatedNewStreak}
                  onComplete={handleContinue}
                  challengeDuration={challengeDuration}
                  impactMultiplier={calculateImpactMultiplier()}
                />
              </motion.div>
            )}

            {flowStep === "celebration" && (
              <Celebration
                onComplete={handleContinue}
                currentLevel={userLevel}
                levelUp={calculatedNewStreak % challengeDuration === 0}
                currentStreak={calculatedNewStreak}
                completedTasks={completedTasks.length}
                totalTasks={tasks.length}
                xpEarned={calculateXpEarned()}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskCompletionFlow;