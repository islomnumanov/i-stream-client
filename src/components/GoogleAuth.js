import React from "react";
import { connect } from "react-redux";

import { signIn, signOut } from "../actions";

// when the component first renders to the screen we will load google auth library as follows:
// componentDidMount() { window.gapi.load('client:auth2') }

// loading a library will take some time, therefore we need to wait and when it loads we go the next step
// we do it using a callback function:
// componentDidMount() { window.gapi.load('client:auth2', () => {}) }

// inside that callback function we should pass clientId and scope, so that later we can initialize GoogleAuth object!

// window.gapi.client.init({}) is going to return us a promise. Thus, we should proceed with .then(() => {})
// inside .then() we have a a callback function -> one being a one time setting of our state & two a listener wth its own callback that will change our state

// the first setState will be invoked as soon as the window.gapi library is loaded.
// the second setState will be invoked when we signIn or signOut

// From here on the google auth logic has to be moved into redux

// The first thing I am doing is to import actions creators and hook them up to my GoogleAuth component => using react-redux connect function
class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: process.env.REACT_APP_GOOGLE,
          scope: "email",
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton = () => {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui green google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  };

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
