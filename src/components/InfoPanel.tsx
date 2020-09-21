import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useSocket } from "../hooks/useSocket";

const CLOSE_TIMEOUT = 15000;
const PANEL_WIDTH = 400;

const InfoPanelContainer = styled.div`
  align-items: flex-start;
  display: flex;
  width: 100%;
`;

const InfoPanelContent = styled.div`
  background-color: #f0deba;
  border: 1px solid #7b2529;
  color: #7b2529;
  font-size: 16px;
  height: 100%;
  padding: 8px;
  text-align: left;
  width: 100%;
`;

const InfoPanelTitle = styled.div`
  background-color: #7b2529;
  border-radius: 0 4px 4px 0;
  color: #f0deba;
  font-size: 20px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 8px;
`;

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
      initial={{ x: -(PANEL_WIDTH - 36) }}
      animate={{ x: isOpen ? 0 : -(PANEL_WIDTH - 36) }}
      style={{ marginTop: "4px", width: PANEL_WIDTH }}
    >
      <InfoPanelContainer>
        <InfoPanelContent>{children}</InfoPanelContent>
        <InfoPanelTitle onClick={() => setIsOpen(!isOpen)}>
          {title}
        </InfoPanelTitle>
      </InfoPanelContainer>
    </motion.div>
  );
}
