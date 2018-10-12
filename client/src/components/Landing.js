import React, { Component } from "react";

class Landing extends Component {
  render() {
    return (
      <div>
        <a href="http://localhost:5000/auth/spotify/login">
          {" "}
          Login to Spotify{" "}
        </a>
      </div>
    );
  }
}

export default Landing;
