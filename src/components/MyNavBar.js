import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default () => (
  <div>
    <Navbar style={{'backgroundColor': "#2699fb"}}>
      <Nav className="mr-auto">
        <LinkContainer style={{'backgroundColor': "#2699fb", 'fontWeight': 'bold', 'color': 'white'}} to="/">
          <Button variant="link">Home</Button>
        </LinkContainer>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <LinkContainer style={{'backgroundColor': "#2699fb", 'fontWeight': 'bold', 'color': 'white'}} to="/logout">
          <Button>Logout</Button>
        </LinkContainer>
      </Navbar.Collapse>
    </Navbar>
    <br />
  </div>
);
