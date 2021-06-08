import * as React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: black;
  color: white;
  font-size: 24px;
  padding: 4px;
  width: 100%;
`;

const EncounterInstructions = () => {
  return (
    <Wrapper>
      Defeat the monster:
      <ul>
        <li>!attack (the monster)</li>
        <li>!block (the monster's attacks)</li>
        <li>!heal (the channel's HP)</li>
      </ul>
    </Wrapper>
  );
};

export default EncounterInstructions;
