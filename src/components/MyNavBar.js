import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <div>
    <Navbar className="cdFore">
      <Nav className="mr-auto">
        <LinkContainer className="cdFore" style={{'fontWeight': 'bold'}} to="/">
          <Button variant="link">Home</Button>
        </LinkContainer>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <LinkContainer className="cdFore" style={{'fontWeight': 'bold'}} to="/logout">
          <Button variant="light">Logout</Button>
        </LinkContainer>
      </Navbar.Collapse>
    </Navbar>
    <br />
  </div>
);