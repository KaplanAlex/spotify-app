import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js";

import Landing from "./components/Landing";
import store from "./store";
import SongDisplay from "./components/SongDisplay";

// Used to manage spotify credentials and information.
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    // Login credentials are passed back as url parameters.
    const params = this.getHashParams();
    console.log(params);
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" }
    };
  }

  getHashParams() {
    var hashParams = {};
    console.log(window.location.hash);
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    console.log("params", q);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  componentWillReceiveProps(nextProps) {
    console.log("will receive", nextProps.match.params.redirectParams);
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route path="/loggedin" component={SongDisplay} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
