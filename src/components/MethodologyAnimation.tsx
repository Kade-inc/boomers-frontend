import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Code,
  Lightbulb,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Methodology = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps: Step[] = [
    {
      id: 1,
      title: "Understand the Problem",
      description:
        "Mentors guide mentees through breaking down complex problems into manageable components.",
      icon: <Lightbulb className="h-8 w-8 text-yellow" />,
    },
    {
      id: 2,
      title: "Plan Your Approach",
      description:
        "Learn to create step-by-step plan before diving into code, a crucial skill for professional developers.",
      icon: <MessageSquare className="w-8 h-8 text-yellow" />,
    },
    {
      id: 3,
      title: "Implement the Solution",
      description:
        "Write Clean, efficient code with guidance from experienced mentors who provide real-time feedback.",
      icon: <Code className="w-8 h-8 text-yellow" />,
    },
    {
      id: 4,
      title: "Review and Refine",
      description:
        "Learn the art of code review, testing, and optimization from developers who do it professionally.",
      icon: <CheckCircle className="w-8 h-8 text-yellow" />,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev: number) => (prev + 1) % steps.length);
      }, 3000); //reset ecery 3 seconds
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev: number) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveStep((prev: number) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-body mb-4 text-gray-900">
            Our Problem-Solving Methodology
          </h2>
          <p className="text-darkgrey font-body max-w-2xl mx-auto">
            Our unique step-by-step approach helps developers build strong
            problem-solving skills through mentorship and practice.
          </p>
        </div>

        <div className="relative">
          {/* progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
            <motion.div
              className="h-full bg-yellow rounded-full"
              initial={{
                width: `${(activeStep / (steps.length - 1)) * 100}%`,
              }}
              animate={{
                width: `${(activeStep / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* step indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center font-body"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setActiveStep(index);
                }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer font-body ${activeStep === index ? "bg-yellow" : "bg-gray-200"}`}
                  animate={{
                    scale: activeStep === index ? 1.2 : 1,
                    backgroundColor:
                      activeStep === index ? "#FACC15" : "#E5E7EB",
                  }}
                >
                  <span className="text-sm font-body font-bold">{step.id}</span>
                </motion.div>
                <span
                  className={`text-xs font-body mt-2 ${activeStep === index ? "font-bold font-body" : ""}`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Main animation area */}
          <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="flex justify-between absolute top-1/2 transform -translate-y-1/2 w-full px-4 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 font-body backdrop-blur-sm hover:bg-white"
                onClick={handlePrev}
              >
                <ChevronLeft className="h-5 text-darkgrey font-body w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 font-body text-darkgrey w-5" />
              </Button>
            </div>

            <div className="p-8">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="flex-shrink-0 w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                  {steps[activeStep].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-body mb-3 text-gray-600">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-gray-600 font-body">
                    {steps[activeStep].description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {activeStep === 0 && (
                      <>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &quot;What are we trying to achieve?&quot;
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &quot;What contraints do we have?&quot;
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {activeStep === 1 && (
                      <>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &quot;Let&apos;s break this down into
                              steps...&quot;
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &quot;What are we trying to achieve?&quot;
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {activeStep === 2 && (
                      <>
                        <Card className="w-full md:auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm font-mono text-violet-400">
                              <span className="text-blue-400">function</span>{" "}
                              <span className="text-green-300">solve</span>()
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {activeStep === 3 && (
                      <>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &apos;Lets optimize this loop for better
                              performance&apos;
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="w-full md:w-auto bg-gray-50 border-yellow border-l-4">
                          <CardContent className="p-4">
                            <p className="text-sm text-darkgrey">
                              &apos;Have we handled all edge cases?&apos;
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;
