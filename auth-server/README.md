# Kidplayer backend

Adapted from Authorization Code flow from Spotify Accounts Authentication Examples

This project contains demo modified for kidplayer using authorization code flow, OAuth 2.0 for [authenticating against the Spotify Web API](https://developer.spotify.com/web-api/authorization-guide/).

Why?
To keep the client id/secret outside the frontend code.

### Using your own credentials

You will need to register your app and get your own credentials from the Spotify for Developers Dashboard.

To do so, go to [your Spotify for Developers Dashboard](https://beta.developer.spotify.com/dashboard) and create your application. For the examples, we registered these Redirect URIs:

- http://localhost:8888 (needed for the implicit grant flow)
- http://localhost:8888/callback

Once you have created your app, replace the `client_id`, `redirect_uri` and `client_secret` into these environment variables:

            KIDPLAYER_CLIENT_ID
            KIDPLAYER_CLIENT_SECRET
            KIDPLAYER_REDIRECT_URI

And set this enivornment url to the front end of Kidplayer

            KIDPLAYER_CLIENT_URI

## Running the examples

    npm install
    . ../../environment.sh
    node app.js
