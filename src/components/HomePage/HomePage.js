import React, { Component } from "react";
import api from "../../Data/api";
import { Container, Card, Button} from 'react-bootstrap';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { IoMdSettings } from 'react-icons/io';
import { LinkContainer } from 'react-router-bootstrap';


class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      tasks: []
    };

    this.activeTasks = () => 
      this.state.tasks.filter(t => !(t.data.startTime && t.data.endTime))

    this.completedTasks = () => 
      this.state.tasks.filter(t => t.data.startTime && t.data.endTime)
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const tasks = await api.getTasks();
      // console.log(tasks);
      this.setState({
        tasks
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
            <h4 style={{'color': '#2699FB'}}>Active tasks</h4>
            {
              this.activeTasks()
                .map(i =>
                <div key={i.guid}>
                  <Card style={{'backgroundColor': '#F1F8FF', 'color': '#2699FB'}}>
                    <Card.Body>
                      <h5> <IoMdSettings/> {i.data.name} </h5>
                      <LinkContainer to={`/tasks/${i.guid}/details`} replace>
                        <Button variant="primary">Start Task</Button>
                      </LinkContainer>
                    </Card.Body>
                  </Card>
                  <br/>
                </div>
            )}
            <h4 style={{'color': '#2699FB'}}>Completed Tasks</h4>
            {
              this.completedTasks()
                .map(i =>
                <div key={i.guid}>
                  <Card style={{'backgroundColor': '#F1F8FF', 'color': '#2699FB'}}>
                    <Card.Body>
                      <LinkContainer style={{'backgroundColor': '#F1F8FF', 'color': '#2699FB'}} to={`/tasks/${i.guid}/details`} replace>
                        <Button size="lg" variant="light"><IoMdSettings/> {i.data.name}</Button>
                      </LinkContainer>
                    </Card.Body>
                  </Card>
                  <br/>
                </div>
            )}
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default HomePage;