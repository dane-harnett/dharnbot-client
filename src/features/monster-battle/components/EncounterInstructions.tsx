import * as React from "react";

const EncounterInstructions = () => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        fontSize: "50px",
        padding: 4,
      }}
    >
      Instructions:
      <br />
      A monster is attacking the channel!
      <br />
      Type "!attack/!defend/!heal" in chat to attack the monster or defend/heal
      the channel.
    </div>
  );
};

export default EncounterInstructions;
