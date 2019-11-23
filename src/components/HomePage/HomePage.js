import React, { Component, PureComponent } from "react";
import api from "../../Data/api";
import { Container, Card, Button, Row, Col, Image, Navbar } from 'react-bootstrap';
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { IoMdSettings, IoIosAddCircle, IoMdPerson } from 'react-icons/io';
import { LinkContainer } from 'react-router-bootstrap';
import logo from "../logo.png";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import utils from '../utils';
import RefreshButton from '../RefreshButton';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const estimatedHours = "Estimated hours";
const duration= "Hours that Students have spent";
const estimatedStress = "Estimated Stress";
const meanStress = "Mean Stress";

function millisecsToHours(mil) {
  const toSeconds = mil / 1000;
  const toMinutes = toSeconds / 60;
  const toHours = toMinutes / 60;
  return toHours;
}

class HomePage extends Component {
  render() {
    return (window.FOR_INSTRUCTOR) ? <HomePageInstructor routerHistory={this.props.history} /> : <HomePageStudent routerHistory={this.props.history}/>;
  }
}

class HomePageInstructor extends Component {
  constructor() {
    super();

    this.state = {
      tasks: [],
      chartData: []
    };

    this.activeTasks = () => 
      this.state.tasks.filter(t => !t.completed)

    this.completedTasks = () => 
      this.state.tasks.filter(t => t.completed)
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const publishedTasks = await api.getPublishedTasks();
      const tasks = publishedTasks
        .map(tasks => {
          const {
            source : { data: s, guid },
            published
          } = tasks;
          const { name, estimatedStress, estimatedHours } = s;
          const duration = published.reduce((d, p) => typeof p.data.duration === 'number' ? d + p.data.duration : d , 0);
          const submittedStress = published.filter(p => typeof p.data.stress === 'number');
          const meanStress = submittedStress.reduce((ms, p) => ms + p.data.stress, 0) / submittedStress.length;
          const completed = published.reduce((a, p) => p.data.status === 'finished' && a, true );
          return {
            guid, name, estimatedHours, estimatedStress, duration, completed, meanStress
          };
        });
      // console.log(tasks);
      const chartData = tasks.map(t => {
        const group = {};
        group.name = t.name;
        group[estimatedStress] = t.estimatedStress;
        group[duration] = millisecsToHours(t.duration);
        group[estimatedHours] = t.estimatedHours;
        group[meanStress] = t.meanStress;
        return group;
      });
      this.setState({
        tasks,
        chartData
      });
    } catch (error) {
      utils.checkErrorForLogout(error, this.props.routerHistory);
    } finally {
      if (!this.componentUnmounted)
        this.setState({loading: undefined});
    }
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    const BlueBreakline = () => (<hr style={{'borderTop': 'solid', 'borderColor': '#2699fb'}}/>);

    // https://css-tricks.com/snippets/css/a-guide-to-flexbox

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
                this.activeTasks().map(t => (<Card.Text key={t.guid}>{t.name}</Card.Text>))
              }
            <Card.Title>Completed Tasks</Card.Title>
            <BlueBreakline />
              {
                this.completedTasks().map(t => (<Card.Text key={t.guid}>{t.name}</Card.Text>))
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
                  moment.duration(
                    this.state.tasks
                      .map(t => typeof t.duration === 'number' ? t.duration : 0)
                      .reduce((total, d) => total + d, 0)
                  ).format("h [hour], m [minute], s [second]")
                }
                </h1>
              </Card.Body>
            </Card>
            <h6 style={{'color': '#2699fb'}}>Total time spent on Task(s)</h6>
          </Col>
        </Row>
      </Container>
    );

    const [kc1, kc2] = [[], []];
    kc1[0] = [estimatedHours, '#81e383'];
    kc1[1] = [duration, '#7e9e7f'];
    kc2[0] = [estimatedStress, '#e38881'];
    kc2[1] = [meanStress, '#ad534c'];

    const Center = () => (
      <div style={{
        'flex': '7 0 0',
        'order': '2'
      }}>
        <LinkContainer to="/tasks/include">
          <Button style={{'color': '#2699FB', 'width': '100%'}} size='lg' variant="outline-dark">Add Tasks <IoIosAddCircle/></Button>
        </LinkContainer>
        <TasksStatistics />
        <h6>Assignments</h6>
        <TasksBarChart data={this.state.chartData} keysColors={kc1} />
        <TasksBarChart data={this.state.chartData} keysColors={kc2} />
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
            <RightSide />
            <Center />
        </div>
        <Image src={logo} style={{height: '3rem'}} fluid />
      </div>
    );  
  }
}

class HomePageStudent extends Component {
  constructor() {
    super();

    this.state = {
      tasks: [],
    };

    this.activeTasks = () => 
      this.state.tasks.filter(t => t.data.status !== 'finished')

    this.completedTasks = () => 
      this.state.tasks.filter(t =>  t.data.status === 'finished')
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const tasks = await api.getTasks();
      this.setState({
        tasks
      });
    } catch (error) {
      utils.checkErrorForLogout(error, this.props.routerHistory);
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
        <RefreshButton />
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
          { this.props.keysColors.map(kc => <Bar dataKey={kc[0]} fill={kc[1]} />) }
        </BarChart>
      </div>
    );
  }
}

export default HomePage;