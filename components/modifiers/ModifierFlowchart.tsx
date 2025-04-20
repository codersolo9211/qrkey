"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FlowchartNode {
  id: string;
  type: "start" | "process" | "decision" | "end";
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FlowchartConnection {
  from: string;
  to: string;
  label?: string;
  path?: string;
}

const nodes: FlowchartNode[] = [
  // Availability Management Flow
  { id: "start-availability", type: "start", text: "Start Availability Management", x: 100, y: 50, width: 200, height: 60 },
  { id: "store-selection", type: "process", text: "Store & Service Selection", x: 100, y: 150, width: 200, height: 60 },
  { id: "validate-selection", type: "decision", text: "Valid Selection?", x: 100, y: 250, width: 160, height: 80 },
  { id: "manage-availability", type: "process", text: "Configure Availability Settings", x: 100, y: 350, width: 200, height: 60 },
  { id: "validate-changes", type: "decision", text: "Changes Valid?", x: 100, y: 450, width: 160, height: 80 },
  { id: "preview-changes", type: "process", text: "Preview Changes", x: 100, y: 550, width: 200, height: 60 },
  { id: "apply-changes", type: "process", text: "Apply Changes", x: 100, y: 650, width: 200, height: 60 },
  { id: "end-availability", type: "end", text: "End Availability Management", x: 100, y: 750, width: 200, height: 60 },

  // Price Management Flow
  { id: "start-price", type: "start", text: "Start Price Management", x: 500, y: 50, width: 200, height: 60 },
  { id: "price-selection", type: "process", text: "Store & Service Selection", x: 500, y: 150, width: 200, height: 60 },
  { id: "validate-price-selection", type: "decision", text: "Valid Selection?", x: 500, y: 250, width: 160, height: 80 },
  { id: "price-adjustment", type: "process", text: "Configure Price Adjustments", x: 500, y: 350, width: 200, height: 60 },
  { id: "validate-price", type: "decision", text: "Price Rules Valid?", x: 500, y: 450, width: 160, height: 80 },
  { id: "preview-price", type: "process", text: "Preview Price Changes", x: 500, y: 550, width: 200, height: 60 },
  { id: "apply-price", type: "process", text: "Apply Price Changes", x: 500, y: 650, width: 200, height: 60 },
  { id: "end-price", type: "end", text: "End Price Management", x: 500, y: 750, width: 200, height: 60 },
];

const connections: FlowchartConnection[] = [
  // Availability Management Flow
  { from: "start-availability", to: "store-selection" },
  { from: "store-selection", to: "validate-selection" },
  { from: "validate-selection", to: "manage-availability", label: "Yes" },
  { from: "validate-selection", to: "store-selection", label: "No" },
  { from: "manage-availability", to: "validate-changes" },
  { from: "validate-changes", to: "preview-changes", label: "Yes" },
  { from: "validate-changes", to: "manage-availability", label: "No" },
  { from: "preview-changes", to: "apply-changes" },
  { from: "apply-changes", to: "end-availability" },

  // Price Management Flow
  { from: "start-price", to: "price-selection" },
  { from: "price-selection", to: "validate-price-selection" },
  { from: "validate-price-selection", to: "price-adjustment", label: "Yes" },
  { from: "validate-price-selection", to: "price-selection", label: "No" },
  { from: "price-adjustment", to: "validate-price" },
  { from: "validate-price", to: "preview-price", label: "Yes" },
  { from: "validate-price", to: "price-adjustment", label: "No" },
  { from: "preview-price", to: "apply-price" },
  { from: "apply-price", to: "end-price" },
];

function drawNode(ctx: CanvasRenderingContext2D, node: FlowchartNode) {
  ctx.save();
  ctx.strokeStyle = "#0D9488";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 2;

  const x = node.x;
  const y = node.y;
  const width = node.width;
  const height = node.height;

  switch (node.type) {
    case "start":
    case "end":
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      break;
    case "process":
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 8);
      ctx.fill();
      ctx.stroke();
      break;
    case "decision":
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y);
      ctx.lineTo(x + width, y + height / 2);
      ctx.lineTo(x + width / 2, y + height);
      ctx.lineTo(x, y + height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }

  // Draw text
  ctx.fillStyle = "#1F2937";
  ctx.font = "14px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  const words = node.text.split(" ");
  let line = "";
  let lines: string[] = [];
  const maxWidth = node.width - 20;

  for (let word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      lines.push(line);
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const lineHeight = 20;
  const startY = y + height / 2 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line.trim(), x + width / 2, startY + i * lineHeight);
  });

  ctx.restore();
}

function drawConnection(ctx: CanvasRenderingContext2D, from: FlowchartNode, to: FlowchartNode, label?: string) {
  ctx.save();
  ctx.strokeStyle = "#0D9488";
  ctx.fillStyle = "#0D9488";
  ctx.lineWidth = 2;

  const startX = from.x + from.width / 2;
  const startY = from.y + from.height;
  const endX = to.x + to.width / 2;
  const endY = to.y;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  const arrowSize = 10;
  const angle = Math.atan2(endY - startY, endX - startX);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle - Math.PI / 6),
    endY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    endX - arrowSize * Math.cos(angle + Math.PI / 6),
    endY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Draw label if provided
  if (label) {
    ctx.fillStyle = "#6B7280";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    ctx.fillText(label, midX, midY - 10);
  }

  ctx.restore();
}

export function ModifierFlowchart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 850;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = "#1F2937";
    ctx.font = "bold 16px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Modifier Bulk Operations Flow", canvas.width / 2, 20);

    // Draw legend
    const legendItems = [
      { type: "start", text: "Start/End" },
      { type: "process", text: "Process" },
      { type: "decision", text: "Decision" },
    ];

    ctx.font = "14px Inter";
    ctx.textAlign = "left";
    legendItems.forEach((item, i) => {
      const x = 20;
      const y = 20 + i * 30;
      
      const dummyNode: FlowchartNode = {
        id: "legend",
        type: item.type as any,
        text: "",
        x: x,
        y: y - 10,
        width: 40,
        height: 20,
      };
      
      drawNode(ctx, dummyNode);
      ctx.fillStyle = "#1F2937";
      ctx.fillText(item.text, x + 50, y);
    });

    // Draw nodes
    nodes.forEach(node => drawNode(ctx, node));

    // Draw connections
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        drawConnection(ctx, fromNode, toNode, conn.label);
      }
    });
  }, []);

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-lg font-medium text-teal-700">Modifier Bulk Operations Flowchart</Label>
          <p className="text-sm text-muted-foreground">
            Visual representation of the availability and price management flows
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full border rounded-lg bg-white"
          style={{ maxWidth: "800px" }}
        />
      </div>
    </Card>
  );
}