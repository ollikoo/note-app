import React from "react";
import { Window, WindowHeader, Button, WindowContent } from "react95";
import styled from "styled-components";
import warningIMG from "../assets/warning.png";
import errorIMG from "../assets/error.png";
import successIMG from "../assets/success.png";

type AlertProps = {
  content: string;
  dismiss: () => void;
  type: "error" | "warning" | "success";
};

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  z-index: 1111;

  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      background: ${({ theme }) => theme.materialText};
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .alert-window {
    width: 400px;
    min-height: 200px;
    max-width: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  .alert-icon {
    width: 60px;
    height: auto;
    margin-right: 32px;
    margin-bottom: 16px;
  }

  .window-wrap {
    display: flex;
    flex-direction: row;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  .dismiss {
    width: 132px;
    margin-top: 32px;
  }
`;

const Alert = ({ content, dismiss, type }: AlertProps) => {
  return (
    <Wrapper>
      <Window className="alert-window">
        <WindowHeader className="window-header">
          <span>
            {type === "error" && "Error"}
            {type === "warning" && "Warning"}
            {type === "success" && "Notification"}
          </span>
          <Button className="close-button" onClick={dismiss}>
            <span className="close-icon" />
          </Button>
        </WindowHeader>
        <WindowContent>
          <div className="window-wrap">
            <div>
              <span>
                {type === "error" && (
                  <img className="alert-icon" src={errorIMG} alt="" />
                )}
                {type === "warning" && (
                  <img className="alert-icon" src={warningIMG} alt="" />
                )}
                {type === "success" && (
                  <img className="alert-icon" src={successIMG} alt="" />
                )}
              </span>
            </div>
            <div>
              {content}
              <Button className="dismiss" onClick={dismiss}>
                OK
              </Button>
            </div>
          </div>
        </WindowContent>
      </Window>
    </Wrapper>
  );
};

export default Alert;
