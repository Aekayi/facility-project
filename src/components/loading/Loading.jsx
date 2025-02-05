import React from "react";
import styled, { keyframes } from "styled-components";

const slideAnimation = keyframes`
  100% { left: calc(100% + 20px); }
`;

const Loader = styled.div`
  width: 120px;
  height: 22px;
  border-radius: 40px;
  color: #05445e;
  border: 2px solid;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    margin: 2px;
    width: 14px;
    top: 0;
    bottom: 0;
    left: -20px;
    border-radius: inherit;
    background: currentColor;
    box-shadow: -10px 0 12px 3px currentColor;
    clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 95%, -30px 50%);
    animation: ${slideAnimation} 1.2s infinite linear;
  }
`;

const Loading = () => {
  return <Loader />;
};

export default Loading;
