import React from "react";
import { Button, TextField, Tabs, TabBody, Tab } from "react95";
import styled from "styled-components";
import axios from "axios";
import heroIMG from "../assets/wallpaper.png";
import lockIMG from "../assets/lock.png";
import signIMG from "../assets/sign.png";

type LoginProps = {
  setIsLoggedIn: any;
  setError: any;
  setSuccess: any;
};

const Login = ({ setIsLoggedIn, setError, setSuccess }: LoginProps) => {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [regUsername, setRegUsername] = React.useState<string>("");
  const [regPassword, setRegPassword] = React.useState<string>("");
  const [tab, setTab] = React.useState<number>(0);

  const handleLogin = React.useCallback(
    async (username: string, password: string) => {
      await axios
        .post(`${process.env.REACT_APP_API_URL}/login`, { username, password })
        .then((response) => {
          console.log("response:", response);
          if (response?.status === 200) {
            setIsLoggedIn(true);
            setUsername("");
            setPassword("");
          }
        })
        .catch((err: any) => {
          console.log("Login error:", err);
          if (err?.response?.data?.message) setError(err.response.data.message);
          else if (err?.message) setError(err?.message);
        });
    },
    [setError, setIsLoggedIn]
  );

  const handleRegister = React.useCallback(
    async (usr: string, pwd: string) => {
      await axios
        .post(
          `${process.env.REACT_APP_API_URL}/users`,
          {
            username: usr,
            password: pwd,
          },
          { withCredentials: false }
        )
        .then((response) => {
          if (response?.status === 201) {
            setSuccess(response.data.message);
            setRegUsername("");
            setRegPassword("");
          }
        })
        .catch((err: any) => {
          console.log("Register error:", err);
          if (err?.response?.data?.message) setError(err.response.data.message);
          else if (err?.message) setError(err?.message);
        });
    },
    [setError, setSuccess]
  );

  const handlePasswordChange = (tab: number, value: string) => {
    switch (tab) {
      case 0:
        setPassword(value);
        break;
      case 1:
        setRegPassword(value);
        break;
    }
  };

  const handleUsernameChange = (tab: number, value: string) => {
    switch (tab) {
      case 0:
        setUsername(value);
        break;
      case 1:
        setRegUsername(value);
        break;
    }
  };

  const handleChange = (e: any, value: number) => setTab(value);

  return (
    <Wrapper>
      <div className="hero">
        <h1>Notes</h1>
      </div>
      <Tabs value={tab} onChange={handleChange}>
        <Tab value={0}>Login</Tab>
        <Tab value={1}>Register</Tab>
      </Tabs>
      <TabBody>
        <div className="login-wrap">
          <div>
            {tab === 0 ? (
              <img key={lockIMG} src={lockIMG} alt="" />
            ) : (
              <img key={signIMG} src={signIMG} alt="" />
            )}
          </div>
          <div>
            <div className="login-title">
              <p>Type a username and password</p>
            </div>
            <div className="text-field-wrap">
              <p>Username</p>
              <TextField
                className="text-field"
                value={tab === 0 ? username : regUsername}
                placeholder="Type here..."
                onChange={(e: any) => handleUsernameChange(tab, e.target.value)}
                fullWidth
              />
            </div>
            <div className="text-field-wrap">
              <p>Password</p>
              <TextField
                className="text-field"
                value={tab === 0 ? password : regPassword}
                placeholder="Type here..."
                onChange={(e: any) => handlePasswordChange(tab, e.target.value)}
                fullWidth
                type="password"
              />
            </div>

            <div className="submit-wrap">
              {tab === 0 && (
                <Button
                  className="submit"
                  onClick={() => handleLogin(username, password)}
                >
                  Submit
                </Button>
              )}
              {tab === 1 && (
                <Button
                  className="submit"
                  onClick={() => handleRegister(regUsername, regPassword)}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </TabBody>
    </Wrapper>
  );
};

export default Login;

const Wrapper = styled.div`
  .hero {
    width: 100%;
    height: 100px;
    margin-left: -16px;
    background-image: url(${heroIMG});
    background-repeat: no-repeat;
    margin-top: -16px;
    margin-bottom: 32px;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 16px;

    h1 {
      font-size: 38px;
      color: #fff;
      font-weight: 400;
    }
  }

  .login-wrap {
    display: flex;
    flex-direction: column;
    align-item: center;

    @media screen and (min-width: 550px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  img {
    width: 64px;
    height: auto;
    margin-right: 32px;
    margin-bottom: 16px;

    @media screen and (min-width: 550px) {
      margin-bottom: 0;
    }
  }

  .login {
    display: flex;
    flex-direction: row;
  }

  .text-field-wrap {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 8px;

    @media screen and (min-width: 550px) {
      flex-direction: row;
      align-items: center;
    }

    &:last-of-type {
      margin-top: 8px;
    }
  }

  .text-field {
    margin-left: 0px;
    margin-right: 8px;

    @media screen and (min-width: 550px) {
      margin-left: 8px;
    }
  }

  .button-wrap {
    display: flex;
  }

  .login-title {
    margin-bottom: 16px;

    @media screen and (min-width: 550px) {
      margin-bottom: 32px;
    }
  }

  .submit {
    width: 132px;
    margin-top: 32px;

    @media screen and (min-width: 550px) {
      margin-top: 0;
    }
  }

  .submit-wrap {
    margin-top: 16px;
  }
`;
