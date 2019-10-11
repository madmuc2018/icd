import React from "react";
import { HashRouter, Switch, Redirect, Route } from "react-router-dom";

import HomePage from "./components/HomePage/HomePage"
import RegisterPage from "./components/RegisterPage/RegisterPage"
import LoginPage from "./components/LoginPage/LoginPage"
import UpdatePage from "./components/UpdatePage/UpdatePage"
import IncludePage from "./components/IncludePage/IncludePage"
import HistoryPage from "./components/HistoryPage/HistoryPage"
import QRCodePage from "./components/QRCodePage/QRCodePage"
import ScannerPage from "./components/ScannerPage/ScannerPage"
import AccessControlPage from "./components/AccessControlPage/AccessControlPage"
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
          <LogoutRoute exact path="/logout" />
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/orders/include" component={IncludePage} />
          <PrivateRoute exact path="/orders/scan" component={ScannerPage} />
          <PrivateRoute exact path="/orders/:id/update" component={UpdatePage} />
          <PrivateRoute exact path="/orders/:id/history" component={HistoryPage} />
          <PrivateRoute exact path="/orders/:id/access" component={AccessControlPage} />
          <PrivateRoute exact path="/orders/:id/qr" component={QRCodePage} />
        </Switch>
      </HashRouter>
    );
  }
}