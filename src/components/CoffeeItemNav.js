import React, { Component } from "react";
import { Dropdown, Button, SplitButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class CoffeeItemNav extends Component {
  render() {
    return (
      <Dropdown>
        <SplitButton variant='primary' title={`${this.props.coffeeId}`}>
          <Dropdown.Item>
            <LinkContainer to={`/orders/${this.props.coffeeGuid}/update`} replace>
              <Button variant='success' size="sm" block>Update</Button>
            </LinkContainer>
          </Dropdown.Item>

          <Dropdown.Item>
            <LinkContainer to={`/orders/${this.props.coffeeGuid}/history`} replace>
              <Button variant='info' size="sm" block>History</Button>
            </LinkContainer>
          </Dropdown.Item>

          <Dropdown.Item>
            <LinkContainer to={`/orders/${this.props.coffeeGuid}/qr`} replace>
              <Button variant='info' size="sm" block>QRCode</Button>
            </LinkContainer>
          </Dropdown.Item>

          <Dropdown.Item>
            <LinkContainer to={`/orders/${this.props.coffeeGuid}/access`} replace>
              <Button variant='info' size="sm" block>Access Control</Button>
            </LinkContainer>
          </Dropdown.Item>
        </SplitButton>
      </Dropdown>
    );
  }
}

export default CoffeeItemNav;