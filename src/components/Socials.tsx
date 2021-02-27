import React from "react";
import styled from "styled-components";
import TwitterIcon from "@material-ui/icons/Twitter";
import YouTubeIcon from "@material-ui/icons/YouTube";
import GitHubIcon from "@material-ui/icons/GitHub";

const SocialsContainer = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
`;

const SocialLabel = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  padding: 6px;
`;

const Socials = () => {
  return (
    <SocialsContainer>
      <SocialLabel>
        <TwitterIcon /> /daneharnett
      </SocialLabel>
      <SocialLabel>
        <YouTubeIcon /> /daneharnett
      </SocialLabel>
      <SocialLabel>
        <GitHubIcon /> /dane-harnett
      </SocialLabel>
    </SocialsContainer>
  );
};

export default Socials;
