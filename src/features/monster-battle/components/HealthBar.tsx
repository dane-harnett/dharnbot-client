import * as React from "react";

interface HealthBarProps {
  health: number;
  maxHealth: number;
}

const HealthBar = ({ health, maxHealth }: HealthBarProps): JSX.Element => {
  const normalizedHealth = health < 0 ? 0 : health;
  const healthPercent = Math.floor((normalizedHealth / maxHealth) * 100);
  return (
    <div
      style={{
        backgroundColor: "grey",
        height: 16,
      }}
    >
      <div
        style={{
          backgroundColor:
            healthPercent <= 20
              ? "red"
              : healthPercent <= 40
              ? "gold"
              : "mediumseagreen",
          height: 16,
          width: `${healthPercent}%`,
        }}
      ></div>
    </div>
  );
};

export default HealthBar;
