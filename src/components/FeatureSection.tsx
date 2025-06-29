import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Code, Lightbulb, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = (
  { icon, title, description }: FeatureCardProps = {
    icon: <Lightbulb className="h-8 w-8 text-yellow" />,
    title: "Feature Title",
    description: "Feature description goes here explaining the benefit.",
  },
) => {
  return (
    <Card className="bg-black border-darkgrey hover:border-yellow transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-darkgrey mb-4">
          {icon}
        </div>
        <CardTitle className="text-white font-body text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400 font-body">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const FeatureSection = () => {
  const features = [
    {
      icon: <Code className="h-8 w-8 text-yellow" />,
      title: "Challenge-Based Learning",
      description:
        "Tackle real-world coding challenges designed to build practical skills and problem-solving abilities.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow" />,
      title: "Methodical Approach",
      description:
        "Learn structured problem-solving techniques that help you break down complex problems into manageable steps.",
    },
    {
      icon: <Users className="h-8 w-8 text-yellow" />,
      title: "Expert Mentorship",
      description:
        "Connect with experinced developers who provide personalized guidance and feedback on your solutions.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-yellow" />,
      title: "Skill Development",
      description:
        "Build a portfolio of solved challenges while developing the critical thinking skills employers value most.",
    },
  ];

  return (
    <section className="w-full py-28 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            How Our Platform Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Our unique approach combines challenging problems with expert
            mentorship to accelerate your growth as a developer.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
