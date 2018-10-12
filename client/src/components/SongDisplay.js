import React, { Component } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import queryString from "query-string";

const spotifyApi = new SpotifyWebApi();

export default class SongDisplay extends Component {
  componentDidMount() {
    // const params = this.props.match.params.redirectParams;
    console.log(this.props.location.search);
    const values = queryString.parse(this.props.location.search);
    console.log(values.access_token);
    console.log(values.refresh_token);
    spotifyApi.setAccessToken(values.access_token);
    // this.setState({ loggedIn: true });
    // console.log(params);
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url
        }
      });
    });
  }

  constructor() {
    super();
    this.state = {
      loggedIn: true,
      nowPlaying: { name: "Not Checked", albumArt: "" }
    };
  }

  render() {
    return (
      <div className="App">
        <div>Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} />
        </div>
        {this.state.loggedIn && (
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        )}
      </div>
    );
  }
}
