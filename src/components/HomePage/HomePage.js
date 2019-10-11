import React, { Component } from "react";
import api from "../../Data/api";
import { Container, Card, ListGroup, InputGroup, FormControl } from 'react-bootstrap';
import MyNavBar from '../MyNavBar';
import CoffeeItemNav from '../CoffeeItemNav';
import AsyncAwareContainer from '../AsyncAwareContainer';


class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      orders: [],
      filterer: ""
    };

    this.handleFilter = event => {
      const { value } = event.target;
      this.setState({
        filterer: value.trim().toLowerCase()
      });
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const orders = await api.getOrders();
      this.setState({
        orders
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
          <h1 className="text-center">Inventory</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <InputGroup>
              <FormControl
                placeholder="Search by ID"
                name="filterer"
                onChange={this.handleFilter}/>
            </InputGroup>
            <br/>
            {this.state.orders
              .filter(o => {
                const keyword = this.state.filterer;
                return keyword.length === 0 ? true : o.data.id.trim().toLowerCase().includes(keyword);
              })
              .map(o =>
                <Card key={o.guid}>
                  <Card.Header className="text-center">
                    <CoffeeItemNav coffeeGuid={o.guid} coffeeId={o.data.id}></CoffeeItemNav>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item> Producer: {o.data.producer} </ListGroup.Item>
                      <ListGroup.Item> Variety: {o.data.variety} </ListGroup.Item>
                      <ListGroup.Item> Quantity: {o.data.quantity} </ListGroup.Item>
                      <ListGroup.Item> Status: {o.data.status} </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
            )}
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default HomePage;