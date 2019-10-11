import React from "react";
import logo from "./logo.png";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <Navbar bg="light" variant="dark">
    <Navbar.Brand>
      <img
        src={logo}
        alt="logo"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />
    </Navbar.Brand>
    <Nav className="mr-auto">
      <LinkContainer to="/login">
        <Button variant="link">Login</Button>
      </LinkContainer>
      <LinkContainer to="/register">
        <Button variant="link">Register</Button>
      </LinkContainer>
    </Nav>
  </Navbar>
);