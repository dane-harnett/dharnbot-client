import React, { useEffect, useReducer, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { useSocket } from "../hooks/useSocket";

const FailingTestBanner = styled.div`
  background-color: #ff0000;
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const bounceTransition = {
  borderColor: {
    duration: 1,
    repeat: 5,
    repeatType: "reverse",
  },
};

const TestResultsFailedAnimated = ({
  failingTests = [],
}: {
  failingTests?: Test[];
}) => {
  return (
    <motion.div
      transition={bounceTransition}
      animate={{
        borderColor: ["rgba(255,0,0,1)", "rgba(255,0,0,0)"],
      }}
      style={{
        borderWidth: 10,
        borderStyle: "solid",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        height: 1080,
        width: 1920,
        boxSizing: "border-box",
      }}
    >
      <FailingTestBanner>
        <div>The tests are failing</div>
        <p>{failingTests.map(({ title }) => title)}</p>
      </FailingTestBanner>
    </motion.div>
  );
};

const TestResultsPassedAnimated = () => {
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setExpired(true);
    }, 5000);
  }, []);
  if (expired) {
    return null;
  }
  return (
    <motion.div
      transition={bounceTransition}
      animate={{
        borderColor: ["rgba(0,255,0,1)", "rgba(0,255,0,0)"],
      }}
      style={{
        borderWidth: 10,
        borderStyle: "solid",
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        height: 1080,
        width: 1920,
        boxSizing: "border-box",
      }}
    ></motion.div>
  );
};

interface Test {
  title: string;
  state: "passed" | "failed";
}
interface Suite {
  title: string;
  tests: Array<Test>;
}
interface TestResultsEvent {
  suites: Array<Suite>;
}
type FlattenedTestResults = { [k: string]: "passed" | "failed" };
interface State {
  allTestsPassed: boolean;
  flattenedResults: FlattenedTestResults;
}

type ReceiveTestResultsAction = {
  type: "RECEIVE_TEST_RESULTS";
  payload: TestResultsEvent;
};
type ResetTestResultsAction = {
  type: "RESET_TEST_RESULTS";
};

type Action = ReceiveTestResultsAction | ResetTestResultsAction;

const flattenPayload = (payload: TestResultsEvent) => {
  let flat: { [k: string]: "passed" | "failed" } = {};
  payload.suites.forEach((suite) => {
    suite.tests.forEach((test) => {
      flat[`Suite: ${suite.title} Test: ${test.title}`] = test.state;
    });
  });
  return flat;
};
const mergeFlattenedResults = (
  fr1: FlattenedTestResults,
  fr2: FlattenedTestResults
) => {
  let results: { [k: string]: "passed" | "failed" } = {};
  Object.keys(fr1).forEach((key: string) => {
    results[key] = fr1[key];
  });
  Object.keys(fr2).forEach((key: string) => {
    results[key] = fr2[key];
  });
  return results;
};

const initialState = { allTestsPassed: false, flattenedResults: {} };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "RECEIVE_TEST_RESULTS":
      const flattenedResults = mergeFlattenedResults(
        state.flattenedResults,
        flattenPayload(action.payload)
      );
      const allTestsPassed = Object.keys(flattenedResults).every(
        (key) => flattenedResults[key] === "passed"
      );
      return {
        allTestsPassed,
        flattenedResults,
      };

    case "RESET_TEST_RESULTS":
      return initialState;
    default:
      return state;
  }
};

const TestResults = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socket = useSocket();

  useEffect(() => {
    socket.on("TEST_RESULTS", (event: TestResultsEvent) => {
      dispatch({
        type: "RECEIVE_TEST_RESULTS",
        payload: event,
      });
    });
  }, [socket]);

  if (Object.keys(state.flattenedResults).length === 0) {
    return null;
  }

  // which bear is best?
  // Bear[]
  // Array<Bear>

  let failingTests: Test[] = [];
  Object.keys(state.flattenedResults).forEach((key) => {
    if (state.flattenedResults[key] === "failed") {
      failingTests.push({
        title: key,
        state: "failed",
      });
    }
  });

  return !state.allTestsPassed ? (
    <TestResultsFailedAnimated failingTests={failingTests} />
  ) : (
    <TestResultsPassedAnimated />
  );
};

export default TestResults;
