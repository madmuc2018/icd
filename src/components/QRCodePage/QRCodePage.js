import React from "react";
import api from "../../Data/api";
import MyNavBar from '../MyNavBar';
import CoffeeItemNav from '../CoffeeItemNav';
import QRCode from 'qrcode.react';
import { Container } from 'react-bootstrap';
import AsyncAwareContainer from '../AsyncAwareContainer';

class QRCodePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guid: "",
      id: ""
    };
  }

  async componentDidMount() {
    try {
      this.setState({loading: 'Generating QR code'});
      const orders = await api.getOrders();
      const order = orders.filter(o => o.guid === this.props.match.params.id)[0];
      this.setState({
        guid: order.guid,
        id: order.data.id
      });
    } catch (error) {
      alert(error);
    } finally {
      if (!this.componentUnmounted)
        this.setState({loading: undefined});
    }
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    return (
      <div>
        <MyNavBar/>
        <Container>
          <h1 className="text-center">QR code</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <div className="text-center">
              <CoffeeItemNav coffeeGuid={this.state.guid} coffeeId={this.state.id}></CoffeeItemNav>
              <br/>
            </div>
            <div className="text-center">
              <QRCode size="100" value={this.state.guid} />
            </div>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default QRCodePage;