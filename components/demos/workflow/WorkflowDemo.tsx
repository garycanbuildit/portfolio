"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 0 },
    data: { label: "Form Submitted", type: "trigger", icon: "form" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 250, y: 100 },
    data: { label: "Validate Email", type: "condition", icon: "check" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 100, y: 200 },
    data: { label: "Send Error", type: "action", icon: "error" },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 400, y: 200 },
    data: { label: "Add to CRM", type: "action", icon: "database" },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 400, y: 300 },
    data: { label: "Send Welcome Email", type: "action", icon: "email" },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 400, y: 400 },
    data: { label: "Notify Sales Team", type: "action", icon: "notify" },
  },
  {
    id: "7",
    type: "custom",
    position: { x: 400, y: 500 },
    data: { label: "Complete", type: "end", icon: "success" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: false, style: { stroke: "#8B5CF6" } },
  { id: "e2-3", source: "2", target: "3", label: "Invalid", animated: false, style: { stroke: "#ef4444" }, labelStyle: { fill: "#ef4444" } },
  { id: "e2-4", source: "2", target: "4", label: "Valid", animated: false, style: { stroke: "#22c55e" }, labelStyle: { fill: "#22c55e" } },
  { id: "e4-5", source: "4", target: "5", animated: false, style: { stroke: "#8B5CF6" } },
  { id: "e5-6", source: "5", target: "6", animated: false, style: { stroke: "#8B5CF6" } },
  { id: "e6-7", source: "6", target: "7", animated: false, style: { stroke: "#8B5CF6" } },
];

export default function WorkflowDemo() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const resetWorkflow = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setCurrentStep(null);
    setLogs([]);
  }, [setNodes, setEdges]);

  const runWorkflow = useCallback(async () => {
    setIsRunning(true);
    setLogs([]);
    resetWorkflow();

    const steps = [
      { nodeId: "1", log: "New form submission received", delay: 800 },
      { nodeId: "2", log: "Validating email address...", delay: 1000 },
      { nodeId: "4", log: "Email valid! Adding contact to CRM...", delay: 1200 },
      { nodeId: "5", log: "Sending welcome email...", delay: 1000 },
      { nodeId: "6", log: "Notifying sales team via Slack...", delay: 800 },
      { nodeId: "7", log: "Workflow completed successfully!", delay: 500 },
    ];

    for (const step of steps) {
      setCurrentStep(step.nodeId);
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step.log}`]);

      // Highlight current node
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: {
            ...node.data,
            active: node.id === step.nodeId,
            completed: steps.findIndex((s) => s.nodeId === node.id) < steps.findIndex((s) => s.nodeId === step.nodeId),
          },
        }))
      );

      // Animate edges leading to current node
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          animated: edge.target === step.nodeId,
        }))
      );

      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    // Mark all as completed
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, active: false, completed: true },
      }))
    );
    setEdges((eds) => eds.map((edge) => ({ ...edge, animated: false })));

    setIsRunning(false);
    setCurrentStep(null);
  }, [resetWorkflow, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-[500px]">
      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={runWorkflow}
          disabled={isRunning}
          className="px-6 py-2 bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Workflow
            </>
          )}
        </button>
        <button
          onClick={resetWorkflow}
          disabled={isRunning}
          className="px-6 py-2 bg-surface-light hover:bg-surface text-muted hover:text-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* Workflow Canvas */}
        <div className="flex-1 bg-background rounded-lg border border-surface-light overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Controls className="!bg-surface !border-surface-light [&>button]:!bg-surface [&>button]:!border-surface-light [&>button]:!text-foreground [&>button:hover]:!bg-surface-light" />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#2a2a38" />
          </ReactFlow>
        </div>

        {/* Logs Panel */}
        <div className="w-72 bg-background rounded-lg border border-surface-light p-4 overflow-hidden flex flex-col">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Execution Log
          </h4>
          <div className="flex-1 overflow-y-auto space-y-2 text-sm font-mono">
            {logs.length === 0 ? (
              <p className="text-muted text-sm">Click &quot;Run Workflow&quot; to see the automation in action</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-muted">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
