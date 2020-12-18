import React from "react";
import styled from "styled-components";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";
import GitHubIcon from "@material-ui/icons/GitHub";

const SocialsContainer = styled.div`
  align-items: center;
  background-color: #212121;
  border-bottom: 3px solid #e91530;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
  width: 100%;
`;

const SocialLabel = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
`;

const items = [
  () => (
    <SocialLabel>
      <TwitterIcon /> /daneharnett
    </SocialLabel>
  ),
  () => (
    <SocialLabel>
      <YouTubeIcon /> /user/daneharnett
    </SocialLabel>
  ),
  () => (
    <SocialLabel>
      <GitHubIcon /> /dane-harnett
    </SocialLabel>
  ),
  () => <SocialLabel>!project - I'm trying to build a game</SocialLabel>,
];

const Socials = () => {
  return <SocialsContainer>{items.map((item) => item())}</SocialsContainer>;
};

export default Socials;
