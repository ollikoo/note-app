import React from "react";
import styled from "styled-components";
import video from "../assets/screensaver.mp4";

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: #000000;
  pointer-events: none;

  video {
    width: 100%;
    height: 100%;
  }
`;

const Screensaver = () => {
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [count, setCount] = React.useState<number>(0);

  const handleMousemove = React.useCallback(() => {
    setIsActive(false);
    setCount(0);
  }, []);

  React.useEffect(() => {
    const timer = setInterval(
      () => setCount((lastCount) => lastCount + 1),
      1000
    );
    return () => {
      window.clearInterval(timer);
    };
  }, [isActive]);

  React.useEffect(() => {
    if (count > 10) {
      setIsActive(true);
    }
  }, [count]);

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("touchstart", handleMousemove);
    window.addEventListener("keydown", handleMousemove);
    window.addEventListener("click", handleMousemove);

    return () => {
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("touchstart", handleMousemove);
      window.removeEventListener("keydown", handleMousemove);
      window.removeEventListener("click", handleMousemove);
    };
  }, [handleMousemove]);

  return isActive ? (
    <Wrapper>
      <video autoPlay muted loop src={video} />
    </Wrapper>
  ) : null;
};

export default Screensaver;
