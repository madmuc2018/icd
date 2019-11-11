import React from "react";
import Auth from "../../stores/auth";
import Consent from "../../stores/consent";
import api from "../../Data/api";
import logo from "../logo.png";
import FormRow from '../FormRow';
import { Button, Container, Image, Row, Col } from "react-bootstrap";
import AsyncAwareContainer from '../AsyncAwareContainer';
import { LinkContainer } from 'react-router-bootstrap';
import { IoMdArrowRoundForward } from 'react-icons/io';

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
    if (window.FOR_INSTRUCTOR) {
      return (
        <div>
          <Container style={{'margin': '1rem'}}>
            <Row style={{
              'minHeight': '100vh',
              'minWidth': '98vw'
            }}>
                <Col style={{
                  'backgroundColor': '#2699fb',
                  'display': 'flex',
                  'alignItems': 'center',
                  'justifyContent': 'center',
                  'color': 'white'
                }}>
                  <div style={{width: '20rem'}}>
                    <h5>Welcome to CD</h5>
                    <hr style={{'borderTop': 'solid'}}/>
                    <h6 style={{'fontWeight': 'lighter'}}>
                      Welcome to the CD app for instructors. Login and to access
                    </h6>
                    <br/>
                    <Button style={{
                      'borderColor': 'white',
                      'fontWeight': 'bold',
                      'color': 'white'
                    }} variant="outline-dark">Learn more</Button>
                  </div>
                </Col>
                <Col style={{
                  'margin': '20% 0 20% 0',
                  'color': '#2699FB'
                }}>
                  <Image src={logo} style={{width: '10rem'}} fluid />
                  {
                  Consent.isConsented() ?
                    <AsyncAwareContainer loading={this.state.loading}>
                      <div className="text-center">
                        <h4>Sign in</h4>
                        <br/>
                        <FormRow name="email" placeholder="User ID"  onChange={this.handleChange} />
                        <FormRow name="password" placeholder="Password"  type="password" onChange={this.handleChange} />
                        <Button size='sm' onClick={this.handleLogin} block><IoMdArrowRoundForward/></Button>
                      </div>
                    </AsyncAwareContainer>
                  :
                    <div>
                      <p style={{color: '#2699FB'}}> To start using this app, you must first give your consent to participate in the study: Impact of curriculum overload on students' mental health using the Curriculum Densitometer </p>
                      <LinkContainer to={`/consent`} replace>
                        <Button variant="primary">
                          Give consent
                        </Button>
                      </LinkContainer>
                    </div>
                  }
                </Col>
            </Row>
          </Container>
        </div>
      )
    }
    return (
      <div>
        <Container className="text-center">
          <Image src={logo} style={{margin: '5rem', width: '15rem'}} fluid />
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