import React from "react";

const getState = (length) => {
  let state = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    state += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return state;
};

const CLIENT_ID = "95924e3c172d415399023262a058e161";
const RESPONSE_TYPE = "token";
const REDIRECT_URI = "http://localhost:3000/";
const STATE = getState(10);
const SCOPE_LIST = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-top-read",
];
const SCOPE = SCOPE_LIST.join("%20");

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=" +
  CLIENT_ID +
  "&redirect_uri=" +
  REDIRECT_URI +
  "&scope=" +
  SCOPE +
  "&response_type=" +
  RESPONSE_TYPE +
  "&state=" +
  STATE;

const Login = () => {
  return (
    <div id="login-button">
      <h1 className="title">Streamlist</h1>
      <a href={AUTH_URL}>Login with Spotify</a>
    </div>
  );
};

export default Login;
