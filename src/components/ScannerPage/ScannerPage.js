import React, { Component } from "react";
import api from "../../Data/api";
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import QrReader from 'react-qr-reader'
import { Container } from 'react-bootstrap';

class ScanningPage extends Component {
  state = {}

  redirect = async guid => {
    try {
      this.setState({loading: 'Checking order'});
      const foundOrder = (await api.getOrders()).filter(o => o.guid === guid);
      if (foundOrder.length === 1) {
        this.props.history.push(`/orders/${foundOrder[0].guid}/update`);
      }
    } catch (error) {
      alert(error);
    } finally {
      if (!this.componentUnmounted)
        this.setState({loading: undefined});
    }
  }

  handleScan = data => {
    if (data && !this.state.loading) {
      console.log("Scanned: " + data);
      this.redirect(data);
    }
  }

  handleError = err => {
    console.error(err);
  }

  componentWillUnmount = () => {
    this.componentUnmounted = true;
  }

  render() {
    return (
      <div>
        <MyNavBar/>
        <Container>
          <h1 className="text-center">Scan QR Code</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <QrReader
              delay={500}
              onError={this.handleError}
              onScan={this.handleScan}
              style={{ width: '100%' }}
            />
          </AsyncAwareContainer>
        </Container>
      </div>
    )
  }
}

export default ScanningPage;