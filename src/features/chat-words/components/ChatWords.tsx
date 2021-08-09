import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { useMessage } from "../../../messages/useMessage";
import machine from "../state-machine/machine";

const FeatureContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  z-index: 99;
`;
const Layout = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  width: 100%;
  height: 100%;
`;
const MainContent = styled.div`
  width: 1520px;
`;
const Sidebar = styled.div`
  width: 400px;
`;
const Panel = styled.div`
  background-color: #212121;
  color: #ffffff;
  padding: 8px;
`;
const Heading = styled.div`
  font-size: 20px;
`;

const ChatWords = () => {
  const [current, send] = useMachine(machine);

  useMessage((event: any) => {
    const msg = event.message.message.toLowerCase() || "";
    switch (msg) {
      case "!resetchatwords":
        send({
          type: "RESET",
        });
        break;
      case "!startchatwords":
        send({
          type: "START",
        });
        break;
      case "!stopchatwords":
        send({
          type: "STOP",
        });
        break;
      default:
        send({
          type: "MESSAGE",
          payload: {
            message: msg,
          },
        });
    }
  }, []);

  const words = current.context.words || new Map();
  const totalWordScoreCount = Array.from(words).reduce(
    (runningTotal, word) => runningTotal + word[1],
    0
  );

  let topFiveWords = Array.from(words)
    .sort((word1, word2) => {
      const word1Count = word1[1];
      const word2Count = word2[1];
      if (word1Count < word2Count) {
        return 1;
      }
      if (word1Count > word2Count) {
        return -1;
      }
      return 0;
    })
    .slice(0, 5);
  if (topFiveWords.length < 5) {
    topFiveWords = topFiveWords.concat(Array(5 - topFiveWords.length).fill([]));
  }

  if (!current.matches("active")) {
    return null;
  }

  return (
    <FeatureContainer>
      <Layout>
        <MainContent></MainContent>
        <Sidebar>
          <Panel>
            <Heading>Chat words</Heading>
            <ol>
              {topFiveWords.map(([word, count], index) => {
                if (!word) {
                  return <li key={index}>{index + 1}. ???</li>;
                }
                const percentage = (count / totalWordScoreCount) * 100;
                return (
                  <li key={`${word}${index}`}>
                    {index + 1}. {word} - {count} - {percentage.toFixed(1)}%
                  </li>
                );
              })}
            </ol>
          </Panel>
        </Sidebar>
      </Layout>
    </FeatureContainer>
  );
};

export default ChatWords;
