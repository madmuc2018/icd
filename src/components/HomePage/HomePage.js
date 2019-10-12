import React, { Component } from "react";
import api from "../../Data/api";
import { Container, Card, ListGroup, Button} from 'react-bootstrap';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import moment from 'moment';
import { IoMdCheckmark, IoMdDoneAll, IoMdStopwatch } from 'react-icons/io';


class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      assignments: []
    };

    this.changeAssignment = async (guid, operation) => {
      try {
        this.setState({loading: 'Updating ...'});

        const filtered = this.state.assignments.filter(a => a.guid === guid);
        if (filtered.length !== 1)
          return console.warn(`Error updating ${guid}`);
        const assignment = filtered[0].data;

        switch(operation) {
          case "START": 
            if (assignment.startTime)
              return console.warn("Already started")
            assignment.startTime = moment().format('MMMM Do YYYY, h:mm:ss a');
            break;
          case "END": 
            if (assignment.endTime)
              return console.warn("Already end");
            assignment.endTime = moment().format('MMMM Do YYYY, h:mm:ss a');
            break;
          default:
            return console.warn(`No ${operation}`);
        }

        await api.updateAssignment(guid, assignment);
        const assignments = await api.getAssignments();
        this.setState({
          assignments
        });
        this.props.history.push("/");
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.cardStatus = a => {
      if (!a.startTime)
        return "danger"
      if (a.startTime && !a.endTime)
        return "warning"
      if (a.startTime && a.endTime)
        return "success"
      return "dark"
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const assignments = await api.getAssignments();
      // console.log(assignments);
      this.setState({
        assignments
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
          <AsyncAwareContainer loading={this.state.loading}>
            <h1 className="text-center">{ this.state.assignments && this.state.assignments.length > 0 ? "Assignments" : "Please include assignments" } <IoMdStopwatch /></h1>
            {this.state.assignments
              .map(i =>
                <div key={i.guid}>
                  <Card bg={this.cardStatus(i.data)}>
                    <Card.Header as="h5" className="text-center">{i.data.name}</Card.Header>
                    <Card.Body>
                      <ListGroup>
                        <ListGroup.Item variant="secondary"> <IoMdCheckmark /> Start time: {i.data.startTime} </ListGroup.Item>
                        <ListGroup.Item variant="secondary"> <IoMdDoneAll /> End time: {i.data.endTime} </ListGroup.Item>
                        { !i.data.startTime ?
                            <ListGroup.Item className="text-center" variant="secondary">
                              <Button variant="info" onClick={() => this.changeAssignment(i.guid, "START")}>Start</Button>
                            </ListGroup.Item>
                          : <div/>
                        }
                        { !i.data.endTime && i.data.startTime ?
                            <ListGroup.Item className="text-center" variant="secondary">
                              <Button variant="info" onClick={() => this.changeAssignment(i.guid, "END")}>End</Button>
                            </ListGroup.Item>
                          : <div/>
                        }
                      </ListGroup>
                    </Card.Body>
                  </Card>
                  <br/><br/>
                </div>
            )}
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default HomePage;