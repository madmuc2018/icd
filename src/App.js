import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage"
import IncludePage from "./components/IncludePage/IncludePage"
import DetailsPage from "./components/DetailsPage/DetailsPage"
import RegisterPage from "./components/RegisterPage/RegisterPage"
import LoginPage from "./components/LoginPage/LoginPage"
import ConsentPage from "./components/ConsentPage/ConsentPage"
import Auth from "./stores/auth";

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
      <HashRouter>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/consent" component={ConsentPage} />
          <LogoutRoute exact path="/logout" />
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/tasks/include" component={IncludePage} />
          <PrivateRoute exact path="/tasks/:id/details" component={DetailsPage} />
        </Switch>
      </HashRouter>
    );
  }
}