import React from "react";
import Auth from "../../stores/auth";
import Consent from "../../stores/consent";
import api from "../../Data/api";
import logo from "../logo.png";
import FormRow from '../FormRow';
import { Button, Container, Image, Row, Col, FormControl, InputGroup } from "react-bootstrap";
import AsyncAwareContainer from '../AsyncAwareContainer';
import { LinkContainer } from 'react-router-bootstrap';
import { IoMdArrowRoundForward } from 'react-icons/io';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    if (Auth.loggedIn()) {
      this.props.routerHistory.replace("/");
    }

    this.state = {
      email: "",
      password: ""
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
        const { token, role } = await api.login(`${this.state.email}@usask.ca`, this.state.password);
        if (window.FOR_INSTRUCTOR && role !== 'INSTRUCTOR') {
          alert("You are not an instructor, please use the app for students instead");
          return;  
        } else if (!window.FOR_INSTRUCTOR && role === 'INSTRUCTOR') {
          alert("You are not a student, please use the app for the instructor instead");
          return;  
        }
        Auth.setToken(token);
        this.props.routerHistory.replace("/");
      } catch (error) {
        alert(error.message);
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
    if(Consent.isConsented()) {
      return <AsyncAwareContainer loading={this.state.loading}>
        <InputGroup className="mb-3">
          <FormControl
            name="email"
            placeholder="User ID"
            onChange={this.handleChange}
          />
          <InputGroup.Append>
            <InputGroup.Text>@usask.ca</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <FormRow name="password" placeholder="Password" type="password" onChange={this.handleChange} />
        <Button className="cdFore" variant="light" size='sm' onClick={this.handleLogin} block><IoMdArrowRoundForward/></Button>
      </AsyncAwareContainer>
    }
    return <div>
      <p className="cdBack"> To start using this app, you must first give your consent to participate in the study: Impact of curriculum overload on students' mental health using the Curriculum Densitometer </p>
      <LinkContainer to={`/consent`} replace>
        <Button className="cdFore" variant="light">
          Give consent
        </Button>
      </LinkContainer>
    </div>;    
  }
}

class LoginPage extends React.Component {
  render() {
    if (window.FOR_INSTRUCTOR) {
      return (
        <div>
          <Container style={{'margin': '1rem'}}>
            <Row style={{
              'minHeight': '100vh',
              'minWidth': '98vw'
            }}>
              <Col className="cdFore" style={{
                'display': 'flex',
                'alignItems': 'center',
                'justifyContent': 'center',
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
              <Col className="cdBack" style={{'margin': '20% 0 20% 0'}}>
                <Image src={logo} style={{width: '10rem'}} fluid />
                <h4 className="text-center">Sign in</h4>
                <LoginForm routerHistory={this.props.history} />
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
          <LoginForm routerHistory={this.props.history} />
        </Container>
      </div>
    );
  }
}

export default LoginPage;