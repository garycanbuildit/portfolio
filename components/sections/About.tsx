"use client";

import { motion } from "framer-motion";

const skills = [
  { name: "AI & Machine Learning", level: 95 },
  { name: "Process Automation", level: 90 },
  { name: "Data Analytics", level: 85 },
  { name: "Full-Stack Development", level: 88 },
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-4">
              Transforming Ideas into{" "}
              <span className="text-accent">Automated Reality</span>
            </h3>
            <p className="text-muted mb-6">
              With years of experience in AI and automation, I specialize in creating
              intelligent solutions that streamline operations, enhance customer
              experiences, and drive business growth.
            </p>
            <p className="text-muted mb-6">
              From building conversational AI assistants that understand your customers,
              to designing automated workflows that save countless hours, I bring
              cutting-edge technology to solve real business challenges.
            </p>
            <p className="text-muted">
              Every solution I build is tailored to your specific needs, ensuring
              measurable impact and seamless integration with your existing systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-accent">{skill.level}%</span>
                </div>
                <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
