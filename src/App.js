import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";

import HelpButton from "./components/HelpButton"
import HomePage from "./components/HomePage/HomePage"
import IncludePage from "./components/IncludePage/IncludePage"
import DetailsPage from "./components/DetailsPage/DetailsPage"
import RegisterPage from "./components/RegisterPage/RegisterPage"
import LoginPage from "./components/LoginPage/LoginPage"
import ConsentPage from "./components/ConsentPage/ConsentPage"
import CollectorPage from "./components/CollectorPage/CollectorPage"
import Auth from "./stores/auth";

import './style.css';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function LogoutRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        {
          Auth.logout();
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        }
      }
    />
  );
}

// Followed https://github.com/gothinkster/react-mobx-realworld-example-app
// To adopt mobx faster later on
export default class App extends React.Component {
  render() {
    return (
      <div>
        { !window.FOR_INSTRUCTOR && <HelpButton /> }
        <HashRouter>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/consent" component={ConsentPage} />
            <Route exact path="/collect" component={CollectorPage} />
            <LogoutRoute exact path="/logout" />
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/tasks/include" component={IncludePage} />
            <PrivateRoute exact path="/tasks/:id/details" component={DetailsPage} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}