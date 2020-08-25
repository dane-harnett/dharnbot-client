import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "../hooks/useSocket";

const CLOSE_TIMEOUT = 5000;
const PANEL_WIDTH = 400;

interface InfoPanelProps {
  children: React.ReactNode;
  title: string;
}

export default function InfoPanel({ title = "", children }: InfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    socket.on("INFO_PANEL", (event: { panel: string }) => {
      if (event.panel === title) {
        setIsOpen(true);
        setTimeout(() => {
          setIsOpen(false);
        }, CLOSE_TIMEOUT);
      }
    });
  }, [socket, title]);

  return (
    <motion.div
      initial={{ x: -(PANEL_WIDTH - 32) }}
      animate={{ x: isOpen ? 0 : -(PANEL_WIDTH - 32) }}
      style={{ marginTop: "4px", width: PANEL_WIDTH }}
    >
      <div style={{ alignItems: "flex-start", display: "flex", width: "100%" }}>
        <div
          style={{
            backgroundColor: "#f0deba",
            border: "1px solid #7b2529",
            boxSizing: "border-box",
            color: "#7b2529",
            fontSize: "16px",
            height: "100%",
            padding: "8px",
            textAlign: "left",
            width: "100%",
          }}
        >
          {children}
        </div>
        <div
          style={{
            backgroundColor: "#7b2529",
            borderRadius: "0 4px 4px 0",
            color: "#f0deba",
            fontSize: "16px",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            padding: "8px",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </div>
      </div>
    </motion.div>
  );
}
