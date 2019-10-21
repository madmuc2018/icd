import React from "react";
import Auth from "../../stores/auth";
import Consent from "../../stores/consent";
import api from "../../Data/api";
import logo from "../logo.png";
import FormRow from '../FormRow';
import MyAuthNavBar from '../MyAuthNavBar';
import { Button, Container, Image } from "react-bootstrap";
import AsyncAwareContainer from '../AsyncAwareContainer';
import { LinkContainer } from 'react-router-bootstrap';

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
        alert("Invalid email or password");
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
        <Container className="text-center">
          <Image src={logo} fluid />
          {
            Consent.isConsented() ?
              <AsyncAwareContainer loading={this.state.loading}>
                <FormRow name="email" placeholder="email"  onChange={this.handleChange} />
                <FormRow name="password" placeholder="password"  type="password" onChange={this.handleChange} />
                <Button onClick={this.handleLogin}>Log in</Button>
              </AsyncAwareContainer>
            :
              <div>
                <p style={{color: 'blue'}}> To start using this app, you must first give your consent to participate in the study: Impact of curriculum overload on students' mental health using the Curriculum Densitometer </p>
                <LinkContainer to={`/consent`} replace>
                  <Button variant="primary">
                    Give consent
                  </Button>
                </LinkContainer>
              </div>
          }
        </Container>
      </div>
    );
  }
}

export default LoginPage;