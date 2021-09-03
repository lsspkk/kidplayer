/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

import express from "express"; // Express web server framework
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch, { Headers } from "node-fetch";

var client_id = process.env.KIDPLAYER_CLIENT_ID; // my client id
var client_secret = process.env.KIDPLAYER_CLIENT_SECRET; // my secret
var redirect_uri = process.env.KIDPLAYER_REDIRECT_URI; // my redirect uri
var client_uri = process.env.KIDPLAYER_CLIENT_URI; // my react client uri

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app.use(cors()).use(cookieParser());

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope =
    "user-read-private user-read-email user-modify-playback-state user-read-playback-state";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state,
      }).toString()
  );
});

app.get("/callback", async function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect("/#?error=state_mismatch");
  } else {
    res.clearCookie(stateKey);
    const body = new URLSearchParams({
      code,
      redirect_uri,
      grant_type: "authorization_code",
    });
    const headers = new Headers({
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    });
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers,
      body,
    });
    const { access_token, refresh_token } = await result.json();
    const query = {
      access_token,
      refresh_token,
    };
    res.redirect(client_uri + "?" + new URLSearchParams(query).toString());
  }
});

app.get("/refresh_token", async function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  }).toString();

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body,
  });
  if (result.ok) {
    const { access_token } = await result.json();
    res.send({ access_token });
  }
});

console.log("Listening on 8888");
app.listen(8888);
