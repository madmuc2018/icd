import React from "react";
import Auth from "../../stores/auth";
import api from "../../Data/api";
import FormRow from '../FormRow';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Button, Container, Form } from "react-bootstrap";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    if (Auth.loggedIn()) {
      this.props.history.replace("/");
    }

    this.state = {
      email: "",
      password: "",
      instructor: false
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleRegister = async event => {
      try {
        this.setState({loading: 'Registering'});
        await api.register(this.state.email, this.state.password, this.state.instructor ? 'INSTRUCTOR' : 'student');

        this.setState({loading: 'Logging in'});
        const { token, role } = await api.login(this.state.email, this.state.password);
        if (window.FOR_INSTRUCTOR && role !== 'INSTRUCTOR') {
          alert("Successfully registered but you are not an instructor, please use the app for students instead");
          return;  
        } else if (!window.FOR_INSTRUCTOR && role === 'INSTRUCTOR') {
          alert("Successfully registered but you are not a student, please use the app for the instructor instead");
          return;  
        }
        Auth.setToken(token);
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
        <Container>
          <h1>Register</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <FormRow name="email" placeholder="email" onChange={this.handleChange} />
            <FormRow name="password" placeholder="password" type="password" onChange={this.handleChange} />
            <Form.Check
              name="instructor"
              label="I'm an instructor"
              onChange={() => this.setState({instructor: !this.state.instructor})}
            />
            <br />
            <Button onClick={this.handleRegister}>Register</Button>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default RegisterPage;