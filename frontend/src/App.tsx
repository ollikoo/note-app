import React from "react";
import "./App.scss";
import { Routes, Route } from "react-router-dom";
import Notes from "./components/Notes";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  styleReset,
  AppBar,
  Toolbar,
  Button,
  List,
  ListItem,
  Divider,
} from "react95";
import original from "react95/dist/themes/original";
import logoIMG from "./assets/windows-logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import notesIMG from "./assets/notes-logo.png";
import Alert from "./components/Alert";
import axios from "axios";
import bgIMG from "./assets/clouds.png";
import Screensaver from "./components/Screensaver";
axios.defaults.withCredentials = true;

console.log("API url:", process.env.REACT_APP_API_URL);

const GlobalStyles = createGlobalStyle`
  ${styleReset}

  .app {
    background-image: url(${bgIMG})
    position: relative;
    max-width: 100%;
    min-height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .app-bar {
    top: calc(100% - 48px);
  }

  .menu-list {
    position: absolute;
    left: 0;
    bottom: 100%;
  }
`;

const Wrapper = styled.div`
  background-image: url(${bgIMG});
  position: relative;
  max-width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Shortcut = styled.div`
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  width: 42px;

  img {
    width: 100%;
    height: auto;
  }

  a {
    width: 100%;
    text-align: center;
  }
`;

const App = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  return (
    <Wrapper>
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <AppBar className="app-bar">
          <Toolbar>
            <div>
              <Button
                onClick={() => setMenuOpen(!menuOpen)}
                active={menuOpen}
                style={{ fontWeight: "bold" }}
              >
                <img
                  src={logoIMG}
                  alt="Start"
                  style={{ height: "20px", marginRight: 4 }}
                />
                Start
              </Button>
              {menuOpen && (
                <List className="menu-list" onClick={() => setMenuOpen(false)}>
                  <Link to="/notes">
                    <ListItem>
                      <img
                        src={notesIMG}
                        alt="Start"
                        style={{ height: "16px" }}
                      />
                      Notes
                    </ListItem>
                  </Link>
                  <ListItem disabled>
                    <span>🎨</span> Paint
                  </ListItem>
                  <Divider />
                  <ListItem disabled>
                    <span style={{ marginRight: "12px" }}>🔒</span> Logout
                  </ListItem>
                </List>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Shortcut>
          <Link to="/notes">
            <img src={notesIMG} alt="" />
            Notes
          </Link>
        </Shortcut>
        {error !== "" && (
          <Alert type="error" content={error} dismiss={() => setError("")} />
        )}
        {success !== "" && (
          <Alert
            type="success"
            content={success}
            dismiss={() => setSuccess("")}
          />
        )}
        <Routes>
          <Route path="/" element={<></>} />
          <Route
            path="/notes"
            element={<Notes setError={setError} setSuccess={setSuccess} />}
          />
        </Routes>
        <Screensaver />
      </ThemeProvider>
    </Wrapper>
  );
};

export default App;
