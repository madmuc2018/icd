import React from "react";
import Auth from "../../stores/auth";
import api from "../../Data/api";
import FormRow from '../FormRow';
import MyAuthNavBar from '../MyAuthNavBar';
import { Button, Container } from "react-bootstrap";
import AsyncAwareContainer from '../AsyncAwareContainer';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    if (Auth.loggedIn()) {
      this.props.history.replace("/");
    }

    this.state = {
      email: "test1@test.com",
      password: "123"
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleLogin = async event => {
      try {
        this.setState({loading: 'Logging in'});
        Auth.setToken(await api.login(this.state.email, this.state.password));
        this.props.history.replace("/");
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    return (
      <div>
        <MyAuthNavBar/>
        <Container>
          <h1>Login</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <FormRow name="email" onChange={this.handleChange} />
            <FormRow name="password" type="password" onChange={this.handleChange} />
            <Button onClick={this.handleLogin}>Log in</Button>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default LoginPage;