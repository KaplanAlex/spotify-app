const Spotify = require("spotify-web-api-node");
const querystring = require("querystring");
const express = require("express");

// Initialize router.
const router = new express.Router();

const FRONT_END = "http://localhost:3000/loggedin";
const CLIENT_ID = require("../../config/keys").spotify_client_id;
const CLIENT_SECRET = require("../../config/keys").spotify_client_secret;
const REDIRECT_URI = "http://localhost:5000/auth/spotify/callback";

const STATE_KEY = "spotify_auth_state";

// Spotify connection information.
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI
});

// Spotify authorization requests.
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state"
];

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N =>
  (Math.random().toString(36) + Array(N).join("0")).slice(2, N + 2);

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
router.get("/login", (_, res) => {
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page.
 */
router.get("/callback", (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
  // Ensure the returned user is the user sent
  if (state === null || state !== storedState) {
    res.redirect("/#/error/state mismatch");
    // if the state is valid, get the authorization code and pass it on to the client
  } else {
    res.clearCookie(STATE_KEY);
    // Retrieve an access token and a refresh token
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const { expires_in, access_token, refresh_token } = data.body;

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        // use the access token to access the Spotify Web API
        spotifyApi.getMe().then(({ body }) => {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          `${FRONT_END}?access_token=${access_token}&refresh_token=${refresh_token}`
        );
      })
      .catch(err => {
        res.redirect("/#/error/invalid token");
      });
  }
});

module.exports = router;
