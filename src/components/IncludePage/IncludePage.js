import React, { Component } from "react";
import api from "../../Data/api";
import FormRow from '../FormRow';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Container, Button, Modal} from 'react-bootstrap';

class IncludePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.validInput = () => this.state.name.trim().length > 0;

    this.submit = async event => {
      try {
        this.setState({loading: 'Including task'});
        await api.includeTask(this.state);
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
          <h1 className="text-center">Include task</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <FormRow name="name" onChange={this.handleChange} />
            <div className="text-center">
              {
                this.validInput() ? <Button onClick={this.submit}> Include </Button> : <Guard/>
              }
            </div>
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

function Guard() {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Include
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body> Do not leave name empty </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default IncludePage;