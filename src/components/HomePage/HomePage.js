import React, { Component, PureComponent } from "react";
import api from "../../Data/api";
import { Container, Card, Button, Row, Col, Image, Navbar } from 'react-bootstrap';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { IoMdSettings, IoIosAddCircle, IoMdPerson } from 'react-icons/io';
import { LinkContainer } from 'react-router-bootstrap';
import logo from "../logo.png";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class TasksBarChart extends PureComponent {
  state = {
    size: 500
  }
  increaseScale = () => this.setState(({ size }) => ({ size: size + 100 }))
  decreaseScale = () => this.setState(({ size }) => ({ size: size - 100 }))

  render() {
    return (
      <div>
        <Button variant="light" size="lg" onClick={this.decreaseScale}>-</Button>
        <Button variant="light" size="lg" onClick={this.increaseScale}>+</Button>
        <BarChart
          width={this.state.size + 500}
          height={this.state.size}
          data={this.props.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Minutes" fill="green" />
          <Bar dataKey="Stress" fill="red" />
        </BarChart>
      </div>
    );
  }
}

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      tasks: [],
      chartData: []
    };

    this.activeTasks = () => 
      this.state.tasks.filter(t => !(t.data.startTime && t.data.endTime))

    this.completedTasks = () => 
      this.state.tasks.filter(t => t.data.startTime && t.data.endTime)

    this.taskDuration = task => {
      const toSeconds = task.duration / 1000;
      const toMinutes = toSeconds / 60;
      const rounded = Math.round(toMinutes * 100) / 100;
      return rounded;
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const tasks = await api.getTasks();
      // console.log(tasks);
      const chartData = tasks.map(t => ({name: t.data.name, Minutes: this.taskDuration(t.data), Stress: t.data.stress}));
      this.setState({
        tasks,
        chartData
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
    if (window.FOR_INSTRUCTOR) {
      const BlueBreakline = () => (<hr style={{'borderTop': 'solid', 'borderColor': '#2699fb'}}/>);

      const LeftSide = () => (
        <div style={{
          'flex': '1 0 0',
          'order': '1'
        }}>
          <Button style={{'color': '#2699FB', 'width': '100%'}} size='lg' variant="outline-dark">Add Tasks <IoIosAddCircle/></Button>
          <div style={{
            'margin': '2rem 0 0 0',
            'padding': '1rem',
            'minHeight': '100vh',
            'backgroundColor': '#d1eafd'
          }}>
            <h5>Course Load Status</h5>
            <BlueBreakline />
            <h6 style={{'fontWeight': 'lighter', 'textAlign': 'center', 'lineHeight': '3'}}>
              Tip!
              <br />
              You may want to consider revising the curriculum based on the statistics
            </h6>
          </div>
        </div>
      );

      const RightSide = () => (
        <div style={{
          'flex': '1.3 0 0',
          'order': '3',
        }}>
          <Card style={{'minHeight': '100vh'}}>
            <Card.Header style={{
              'backgroundColor': '#2699fb',
              'color': 'white',
              'padding': '2rem'
            }} as="h5">All Tasks</Card.Header>
            <Card.Body style={{
              'color': '#2699fb',
              'margin': '0 1rem'
            }}>
              <Card.Title>Active Tasks</Card.Title>
              <BlueBreakline />
                {
                  this.activeTasks().map(t => (<Card.Text key={t.guid}>{t.data.name}</Card.Text>))
                }
              <Card.Title>Completed Tasks</Card.Title>
              <BlueBreakline />
                {
                  this.completedTasks().map(t => (<Card.Text key={t.guid}>{t.data.name}</Card.Text>))
                }
            </Card.Body>
          </Card>
        </div>
      );

      const TasksStatistics = () => (
        <Container>
          <Row>
            <Col className='text-center' style={{'margin': '0 7rem'}}>
              <Card style={{'backgroundColor': '#2699fb','color': 'white'}}>
                <Card.Body><h1>{this.state.tasks.length}</h1></Card.Body>
              </Card>
              <h6 style={{'color': '#2699fb'}}>Total Tasks</h6>
            </Col>
            <Col className='text-center' style={{'margin': '0 7rem'}}>
              <Card style={{'backgroundColor': '#2699fb','color': 'white'}}>
                <Card.Body>
                  <h1>
                  {
                    this.state.tasks
                      .map(t => this.taskDuration(t.data))
                      .reduce((total, d) => total + d, 0)
                  }
                  </h1>
                </Card.Body>
              </Card>
              <h6 style={{'color': '#2699fb'}}>Total Minutes</h6>
            </Col>
          </Row>
        </Container>
      );

      const Center = () => (
        <div style={{
          'flex': '7 0 0',
          'order': '2'
        }}>
          <TasksStatistics />
          <h6>Assignments</h6>
          <TasksBarChart data={this.state.chartData} />
        </div>
      );

      return (
        <div>
          <Navbar style={{'backgroundColor': "#2699fb"}}>
            <Navbar.Brand><IoMdPerson /> Hello, Instructor!</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <LinkContainer style={{'backgroundColor': "#2699fb", 'fontWeight': 'bold', 'color': 'white'}} to="/logout">
                <Button>Logout</Button>
              </LinkContainer>
            </Navbar.Collapse>
          </Navbar>
          <div style={{
            'display': 'flex',
            'flexFlow': 'row wrap',
            'minHeight': '100vh',
            'margin': '0.5rem'
          }}>
              <LeftSide />
              <RightSide />
              <Center />
          </div>
          <Image src={logo} style={{height: '3rem'}} fluid />
        </div>
      );
    }

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