import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useSocket } from "../hooks/useSocket";

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
`;

enum DayNames {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

interface StreamScheduleEvent {
  dayName: DayNames;
  startHour: number;
  endHour: number;
  showTitle: string;
}

const schedule: StreamScheduleEvent[] = [
  {
    dayName: DayNames.Monday,
    startHour: 17,
    endHour: 19,
    showTitle: "Game Making Monday - Among Us in Pixel Art with TypeScript!",
  },
  {
    dayName: DayNames.Wednesday,
    startHour: 17,
    endHour: 19,
    showTitle: "Wednesday Q&A - let's chat about coding stuff hooray!",
  },
  {
    dayName: DayNames.Friday,
    startHour: 17,
    endHour: 19,
    showTitle:
      "Friday Free For All - might be chatbot or overlay or something else!",
  },
];

const Today = () => {
  const socket = useSocket();
  const [streamTitle, setStreamTitle] = useState<string>("Untitled stream");
  const [streamTopic, setStreamTopic] = useState<string>("No topic yet");

  useEffect(() => {
    socket.on("CHANGE_STREAM_TITLE", (event: { streamTitle: string }) => {
      setStreamTitle(event.streamTitle);
    });
    socket.on("CHANGE_STREAM_TOPIC", (event: { streamTopic: string }) => {
      setStreamTopic(event.streamTopic);
    });
  }, [socket]);

  const today = new Date();
  const todaysDayName = DayNames[today.getDay()];

  const message = schedule.find((event) => {
    return (
      DayNames[event.dayName] === todaysDayName &&
      today.getHours() >= event.startHour &&
      today.getHours() <= event.endHour
    );
  });

  return (
    <Container>
      {message?.showTitle || "Unscheduled stream"} - {streamTitle} -{" "}
      {streamTopic}
    </Container>
  );
};

export default Today;
