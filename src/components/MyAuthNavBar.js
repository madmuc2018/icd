import React from "react";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <Navbar bg="light" variant="dark">
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