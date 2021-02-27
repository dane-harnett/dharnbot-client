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
  streamTitle: string;
}

interface StreamDetails {
  schedule: StreamScheduleEvent[];
  agenda: string[];
  currentAgendaItemIndex: number;
}

const Today = () => {
  const socket = useSocket();
  const [streamDetails, setStreamDetails] = useState<StreamDetails>({
    schedule: [],
    agenda: [],
    currentAgendaItemIndex: 0,
  });
  const [customStreamTitle, setCustomStreamTitle] = useState<string>(
    "Untitled stream"
  );

  useEffect(() => {
    socket.on("CHANGE_STREAM_TITLE", (event: { streamTitle: string }) => {
      setCustomStreamTitle(event.streamTitle);
    });

    socket.on(
      "STREAM_DETAILS_RESPONSE",
      (event: { streamDetails: StreamDetails }) => {
        setStreamDetails(event.streamDetails);
      }
    );

    socket.emit("STREAM_DETAILS_REQUEST");
    const FIVE_MINUTES = 300000;
    setInterval(() => {
      socket.emit("STREAM_DETAILS_REQUEST");
    }, FIVE_MINUTES);
  }, [socket]);

  const today = new Date();
  const todaysDayName = DayNames[today.getDay()];

  const scheduledStream = streamDetails.schedule.find((event) => {
    return (
      DayNames[event.dayName] === todaysDayName &&
      today.getHours() >= event.startHour &&
      today.getHours() <= event.endHour
    );
  });

  const streamTitle = scheduledStream?.streamTitle || customStreamTitle;
  const currentAgendaItem =
    streamDetails.agenda[streamDetails.currentAgendaItemIndex] ||
    "No topic yet";

  return (
    <Container>
      {streamTitle} - {currentAgendaItem}
    </Container>
  );
};

export default Today;
