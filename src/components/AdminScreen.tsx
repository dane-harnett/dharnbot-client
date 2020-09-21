import React from "react";
import axios from "axios";

const AdminScreen = () => {
  const notifyFailedTests = async () => {
    await axios.post("http://localhost:8080/api/test-results", {
      suites: [
        {
          title: "Test suite",
          tests: [
            {
              title: "Test",
              state: "failed",
            },
          ],
        },
      ],
    });
  };
  const notifyPassedTests = async () => {
    await axios.post("http://localhost:8080/api/test-results", {
      suites: [
        {
          title: "Test suite",
          tests: [
            {
              title: "Test",
              state: "passed",
            },
          ],
        },
      ],
    });
  };
  return (
    <div>
      Admin screen
      <button onClick={() => notifyFailedTests()}>Failed Tests</button>
      <button onClick={() => notifyPassedTests()}>Passed Tests</button>
    </div>
  );
};

export default AdminScreen;
