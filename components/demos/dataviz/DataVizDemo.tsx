"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyData, categoryData, weeklyActivity } from "@/lib/sample-data";

type Metric = "revenue" | "users" | "conversions";
type ChartType = "line" | "bar";

export default function DataVizDemo() {
  const [selectedMetric, setSelectedMetric] = useState<Metric>("revenue");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState({ start: 0, end: 11 });

  const filteredData = useMemo(() => {
    return monthlyData.slice(dateRange.start, dateRange.end + 1);
  }, [dateRange]);

  const totalValue = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item[selectedMetric], 0);
  }, [filteredData, selectedMetric]);

  const formatValue = (value: number) => {
    if (selectedMetric === "revenue") {
      return `$${value.toLocaleString()}`;
    }
    if (selectedMetric === "conversions") {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "revenue":
        return "Revenue";
      case "users":
        return "Users";
      case "conversions":
        return "Conversion Rate";
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(["revenue", "users", "conversions"] as Metric[]).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric
                  ? "bg-accent text-white"
                  : "bg-surface-light text-muted hover:text-foreground"
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`p-2 rounded-lg transition-colors ${
              chartType === "line" ? "bg-accent text-white" : "bg-surface-light text-muted"
            }`}
            title="Line Chart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />
            </svg>
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`p-2 rounded-lg transition-colors ${
              chartType === "bar" ? "bg-accent text-white" : "bg-surface-light text-muted"
            }`}
            title="Bar Chart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Date Range Slider */}
      <div className="bg-surface-light rounded-lg p-4">
        <label className="block text-sm font-medium mb-3">
          Date Range: {monthlyData[dateRange.start].month} - {monthlyData[dateRange.end].month}
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min={0}
            max={10}
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: Math.min(parseInt(e.target.value), dateRange.end - 1) })}
            className="flex-1 accent-accent"
          />
          <input
            type="range"
            min={1}
            max={11}
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: Math.max(parseInt(e.target.value), dateRange.start + 1) })}
            className="flex-1 accent-accent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-light rounded-lg p-4">
          <p className="text-muted text-sm">Total {getMetricLabel()}</p>
          <p className="text-2xl font-bold text-accent">{formatValue(totalValue)}</p>
        </div>
        <div className="bg-surface-light rounded-lg p-4">
          <p className="text-muted text-sm">Average</p>
          <p className="text-2xl font-bold">{formatValue(totalValue / filteredData.length)}</p>
        </div>
        <div className="bg-surface-light rounded-lg p-4">
          <p className="text-muted text-sm">Peak</p>
          <p className="text-2xl font-bold text-green-400">
            {formatValue(Math.max(...filteredData.map((d) => d[selectedMetric])))}
          </p>
        </div>
        <div className="bg-surface-light rounded-lg p-4">
          <p className="text-muted text-sm">Growth</p>
          <p className="text-2xl font-bold text-green-400">
            +{(((filteredData[filteredData.length - 1][selectedMetric] - filteredData[0][selectedMetric]) / filteredData[0][selectedMetric]) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-surface-light rounded-lg p-4">
        <h3 className="font-medium mb-4">{getMetricLabel()} Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a38", borderRadius: "8px" }}
                labelStyle={{ color: "#ededed" }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#A78BFA" }}
              />
            </LineChart>
          ) : (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a38", borderRadius: "8px" }}
                labelStyle={{ color: "#ededed" }}
              />
              <Bar dataKey={selectedMetric} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Secondary Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-surface-light rounded-lg p-4">
          <h3 className="font-medium mb-4">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a38", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-surface-light rounded-lg p-4">
          <h3 className="font-medium mb-4">Weekly Task Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
              <XAxis dataKey="day" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a38", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="tasks" fill="#4B5563" name="Total Tasks" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#8B5CF6" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
