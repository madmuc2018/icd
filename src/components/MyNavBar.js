import React from "react";
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <div>
    <Navbar bg="light" variant="dark">
      <Nav className="mr-auto">
        <LinkContainer to="/">
          <Button variant="link">Home</Button>
        </LinkContainer>
        <LinkContainer to="/tasks/include">
          <Button variant="link">Include</Button>
        </LinkContainer>
        <LinkContainer to="/logout">
          <Button variant="link">Logout</Button>
        </LinkContainer>
      </Nav>
    </Navbar>
    <br/>
  </div>
);