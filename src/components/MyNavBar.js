import React from "react";
import logo from "./logo.png";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <div>
    <Navbar bg="light" variant="dark">
      <Navbar.Brand>
        <img
          src={logo}
          alt="logo"
          width="40"
          height="40"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <LinkContainer to="/">
          <Button variant="link">Home</Button>
        </LinkContainer>
        <LinkContainer to="/orders/include">
          <Button variant="link">Include</Button>
        </LinkContainer>
        <LinkContainer to="/orders/scan">
          <Button variant="link">ScanQRCode</Button>
        </LinkContainer>
        <LinkContainer to="/logout">
          <Button variant="link">Logout</Button>
        </LinkContainer>
      </Nav>
    </Navbar>
    <br/>
  </div>
);