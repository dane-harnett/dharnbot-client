import * as React from "react";

const EncounterInstructions = () => {
  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        fontSize: "20px",
        marginTop: 4,
        padding: 4,
        position: "absolute",
        top: 571,
        right: 0,
        width: 390,
      }}
    >
      Instructions:
      <br />
      A monster is attacking the channel!
      <br />
      Type "!attack" in chat to attack the monster.
    </div>
  );
};

export default EncounterInstructions;
