import React, { Component } from "react";
import api from "../../Data/api";
import FormRow from '../FormRow';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Container, Button} from 'react-bootstrap';

class IncludePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      producer: "",
      farm: "",
      elevation: "",
      variety: "",
      process: "",
      quantity: "",
      qc: "",
      tastingNotes: "",
      price:""
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleIncludeOrder = async event => {
      try {
        this.setState({loading: 'Including order'});
        await api.addOrder(this.state);
        this.props.history.push("/");
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
        <MyNavBar/>
        <Container>
          <h1 className="text-center">Include Coffee</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <FormRow name="id" onChange={this.handleChange} />
            <FormRow name="producer" onChange={this.handleChange} />
            <FormRow name="farm" onChange={this.handleChange} />
            <FormRow name="elevation" onChange={this.handleChange} />
            <FormRow name="variety" onChange={this.handleChange} />
            <FormRow name="process" onChange={this.handleChange} />
            <FormRow name="quantity" onChange={this.handleChange} />
            <FormRow name="qc" onChange={this.handleChange} />
            <FormRow name="tastingNotes" onChange={this.handleChange} />
            <FormRow name="price" onChange={this.handleChange} />
            <div className="text-center">
              <Button onClick={this.handleIncludeOrder}>Include</Button>
            </div>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default IncludePage;