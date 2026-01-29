"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotDemo from "@/components/demos/chatbot/ChatbotDemo";
import DataVizDemo from "@/components/demos/dataviz/DataVizDemo";
import WorkflowDemo from "@/components/demos/workflow/WorkflowDemo";

const demos = [
  {
    id: "chatbot",
    title: "AI Chatbot",
    description: "Enter any website URL and chat with an AI that knows its content",
    component: ChatbotDemo,
  },
  {
    id: "dataviz",
    title: "Data Analytics",
    description: "Interactive dashboard with real-time data visualization",
    component: DataVizDemo,
  },
  {
    id: "workflow",
    title: "Workflow Automation",
    description: "Visual automation builder with live execution simulation",
    component: WorkflowDemo,
  },
];

export default function Demos() {
  const [activeDemo, setActiveDemo] = useState("chatbot");
  const ActiveComponent = demos.find((d) => d.id === activeDemo)?.component || ChatbotDemo;

  return (
    <section id="demos" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Live Demos</h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="text-muted max-w-2xl mx-auto">
            Don&apos;t just take my word for it. Try these interactive demos to see
            what&apos;s possible with AI and automation.
          </p>
        </motion.div>

        {/* Demo Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeDemo === demo.id
                  ? "bg-accent text-white"
                  : "bg-surface border border-surface-light text-muted hover:border-accent/50"
              }`}
            >
              {demo.title}
            </button>
          ))}
        </div>

        {/* Demo Description */}
        <p className="text-center text-muted mb-8">
          {demos.find((d) => d.id === activeDemo)?.description}
        </p>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface rounded-2xl border border-surface-light overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDemo}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 min-h-[500px]"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
