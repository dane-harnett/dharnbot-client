import React from "react";
import styled from "styled-components";

const Container = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
`;

const Command = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  margin: 0 8px;
`;

const Commands = () => {
  return (
    <Container>
      <Command>!commands</Command>
      <Command>!project</Command>
      <Command>!snake</Command>
      <Command>!drop</Command>
      <Command>!challenge</Command>
      <Command>!pomo</Command>
    </Container>
  );
};

export default Commands;
