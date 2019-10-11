import React, { Component } from "react";
import { Button , FormControl, Container, Card, CardDeck } from 'react-bootstrap';
import api from "../../Data/api";
import MyNavBar from '../MyNavBar';
import CoffeeItemNav from '../CoffeeItemNav';
import AsyncAwareContainer from '../AsyncAwareContainer';

class AccessControlPage extends Component {
  constructor() {
    super();

    this.state = {
      guid: "",
      id: "",
      grantedUsers: [],
      userToBeGranted: "",
      userToBeRevoked: ""
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleGrant = async event => {
      try {
        this.setState({loading: 'Granting access'});
        await api.grantAccess(this.props.match.params.id, [this.state.userToBeGranted]);
        const grantedUsers = await api.getAccessInfo(this.props.match.params.id);
        this.setState({
          grantedUsers
        });
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.handleRevoke = async event => {
      try {
        this.setState({loading: 'Revoking access'});
        await api.revokeAccess(this.props.match.params.id, this.state.userToBeRevoked);
        const grantedUsers = await api.getAccessInfo(this.props.match.params.id);
        this.setState({
          grantedUsers
        });
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const grantedUsers = await api.getAccessInfo(this.props.match.params.id);
      const order = (await api.getOrders()).filter(o => o.guid === this.props.match.params.id)[0];
      this.setState({
        guid: order.guid,
        id: order.data.id,
        grantedUsers
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
          <h1 className="text-center">Access control</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <div className="text-center">
              <CoffeeItemNav coffeeGuid={this.state.guid} coffeeId={this.state.id}></CoffeeItemNav>
              <br/>
            </div>
            <Card>
              <Card.Header>Authorized Users</Card.Header>
              <Card.Body>
                {this.state.grantedUsers.map(u => <p>{u}</p>)}
              </Card.Body>
            </Card>
            <br/>
            <CardDeck>
              <EmailCard bg="success" task="Grant" name="userToBeGranted" onChange={this.handleChange} onClick={this.handleGrant} />
              <EmailCard bg="danger" task="Revoke" name="userToBeRevoked" onChange={this.handleChange} onClick={this.handleRevoke} />
            </CardDeck>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

class EmailCard extends Component {
  render() {
    return (
      <Card bg={this.props.bg}>
        <Card.Header>{this.props.task} Access</Card.Header>
        <Card.Body>
          <FormControl placeholder="Email" name={this.props.name} onChange={this.props.onChange}/>
          <Button onClick={this.props.onClick} size="sm">{this.props.task}</Button>
        </Card.Body>
      </Card>
    );
  }
}

export default AccessControlPage;