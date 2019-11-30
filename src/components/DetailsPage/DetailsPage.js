import React, { Component } from "react";
import api from "../../Data/api";
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Button, Card, Table, Container, Form } from 'react-bootstrap';
import StateMachine from 'javascript-state-machine';
import StressSlider from '../StressSlider';
import utils from '../utils';
import RefreshButton from '../RefreshButton';
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const timeFormat = 'MMMM Do YYYY, h:mm:ss a';

//states
const [CREATED, INPROGRESS, PAUSED, FINISHED] = ['created', 'inProgress', 'paused', 'finished'];
// transitions
const [START, STOP, PAUSE, CONTINUE] = ['start', 'stop', 'pause', 'continue'];

class TaskController {
  constructor(task, forced) {
    this.task = task;

    const allowedStatuses = s => [CREATED, INPROGRESS, PAUSED, FINISHED].includes(s);

    this.fsm = new StateMachine({
      init: allowedStatuses(task.status) ? task.status : CREATED,
      transitions: forced ?
      [
        { name: 'forceStop',    from: CREATED,    to: FINISHED },
        { name: 'forceStop',    from: INPROGRESS, to: FINISHED },
        { name: 'forceStop',    from: PAUSED,     to: FINISHED },
      ]
      :
      [
        { name: START,    from: CREATED,    to: INPROGRESS },
        { name: PAUSE,    from: INPROGRESS, to: PAUSED },
        { name: CONTINUE, from: PAUSED,     to: INPROGRESS },
        { name: STOP,     from: PAUSED,     to: FINISHED }
      ],
      methods: {
        onStart() {
          task.startTime = (new Date()).getTime();
          task.status = this.state;
        },
        onPause() {
          const timeNow = (new Date()).getTime();
          if (!task.duration) {
            const diff = timeNow - task.startTime;
            task.duration = diff;
          }
          else {
            const diff = timeNow - task.pauseTime;
            task.duration += diff;
          }
          task.pauseTime = timeNow;

          task.status = this.state;
        },
        onContinue() {
          task.status = this.state;
        },
        onStop() {
          const timeNow = (new Date()).getTime();
          task.endTime = timeNow;
          task.duration += timeNow - task.pauseTime;

          task.status = this.state;
        },
        onForceStop(lifecycle) {
          //after regulatedEndtime

          switch (lifecycle.from) {
            case CREATED:
            // no startTime, no endTime
            task.duration = 0;
            break;
            case INPROGRESS:
            task.endTime = task.regulatedEndDate;
            task.duration = task.regulatedEndDate - task.regulatedStartDate;
            break;
            case PAUSED:
            // when task enters PAUSED state it should be given a duration
            task.endTime = task.pauseTime;
            break;
            default:
            alert('Error onForceStop');
            break;
          }

          task.status = this.state;
        }
      }
    });
  }
}

// function taskIsWithinValidTimeReload(task) {
//   const timenow = (new Date()).getTime();
//   const beforeStartDate = timenow < task.regulatedStartDate;
//   if (beforeStartDate) {
//     alert("You cannot start before the regulated start date of the task");
//     window.location.reload()
//   }
//   const afterEndDate = task.regulatedEndDate < timenow;
//   if (afterEndDate) {
//     alert("The deadline for the task is over");
//     window.location.reload()
//   }
// }

function checkRegulatedTime(task) {
  const timenow = (new Date()).getTime();
  const beforeStartDate = timenow < task.regulatedStartDate;
  const afterEndDate = task.regulatedEndDate < timenow;
  if (beforeStartDate) {
    return -1;
  }
  if (afterEndDate) {
    return 1;
  }
  return 0;
}

class DetailsPage extends Component {
  constructor() {
    super();

    // react seems to be slow and inconsistent when assigning an object to state,
    // set task: null and do console.log in the jsx to see
    this.state = {
      guid: "",
      task: {}
    };

    this.changeTask = async (operation) => {
      try {
        this.setState({loading: 'Updating ...'});
        const controller = new TaskController(this.state.task);
        let res;
        switch(operation) {
          case START: res = controller.fsm.start(); break;
          case STOP: res = controller.fsm.stop(); break;
          case PAUSE: res = controller.fsm.pause(); break;
          case CONTINUE: res = controller.fsm.continue(); break;
          default:
            return console.warn(`No ${operation}`);
        }

        if (!res) {
          return;
        }

        const nGuid = await api.updateTask(this.state.guid, controller.task);
        this.props.history.replace(`/tasks/${nGuid}/details`);
        // Not sure why but history replace does not update guid
        this.setState({guid: nGuid});
      } catch (error) {
        alert(error.message);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.taskStatus = () => {
      const state = (new TaskController(this.state.task)).fsm.state;

      switch(state) {
        case CREATED:
          return "You haven't started this task";
        case INPROGRESS:
          return "You're currently working on this task";
        case PAUSED:
          return "You're currently working on this task";
        case FINISHED:
          return "You've completed this task";
        default:
          return "Error"
      }
    }

    this.handleSubmitStress = (redirect, finalStress) => async (stress, comment) => {
      try {
        this.setState({loading: 'Updating ...'});
        const task = this.state.task;

        if (finalStress) {
          task.finalStress = stress;
        } else {
          if (!task.stresses) {
            task.stresses = [stress];
          } else {
            task.stresses.push(stress);
          }

          if (!task.comments) {
            task.comments = [comment];
          } else {
            task.comments.push(comment);
          }

          // stress keeps mean stress
          task.stress = task.stresses.reduce((total, s) => s + total, 0) / task.stresses.length;
        }

        const nGuid = await api.updateTask(this.state.guid, task);

        if (redirect) {
          this.props.history.replace(`/`);
        } else {
          this.props.history.replace(`/tasks/${nGuid}/details`);
          // Not sure why but history replace does not update guid
          this.setState({guid: nGuid});
        }
      } catch (error) {
        alert(error.message);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const task = await api.getTaskLatest(this.props.match.params.id);
      if (task.guid !== this.props.match.params.id) {
        this.props.history.replace(`/tasks/${task.guid}/details`);
      }

      if (checkRegulatedTime(task.data) === 1 && task.data.status !== FINISHED) {
        this.setState({loading: 'Task has reached deadline, updating ...'});
        const controller = new TaskController(task.data, true);
        controller.fsm.forceStop();
        // if (res) {

        // }
        const nGuid = await api.updateTask(task.guid, controller.task);
        this.props.history.replace(`/tasks/${nGuid}/details`);
        // Not sure why but history replace does not update guid
        this.setState({guid: nGuid});
        return;
      }

      this.setState({
      	guid: task.guid,
      	task: task.data
      });
    } catch (error) {
      utils.checkErrorForLogout(error, this.props.history);
    } finally {
      if (!this.componentUnmounted)
        this.setState({loading: undefined});
    }
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    const Buttons = () => {
      if (checkRegulatedTime(this.state.task) === -1) {
        return <h4 className="cdFontColor" style={{'marginTop': '3rem'}}>You can start this task on {moment(this.state.task.regulatedStartDate).format("MMMM Do YYYY, h:mm:ss a")}</h4>
      }

      const transitions = (new TaskController(this.state.task)).fsm.transitions();
      return <div>
        <style type="text/css">
          {`
            .btn-xxl {
              margin: 1rem 0 0 0;
              font-size: 3rem;
              height: 15rem;
              width: 15rem;
              border-radius: 40rem;
            }

            .btn-xxs {
              margin: 10rem 0 0 0;
              font-size: 1rem;
              height: 5rem;
              width: 5rem;
              border-radius: 10rem;
            }
          `}
        </style>
        { transitions.includes(START) && <Button className="cdFore" variant="light" size="xxl" onClick={() => this.changeTask(START)}>Start</Button> }
        { transitions.includes(PAUSE) && <Button className="cdFore" variant="light" size="xxl" onClick={() => this.changeTask(PAUSE)}>Pause</Button> }
        { transitions.includes(CONTINUE) && <Button className="cdFore" variant="light" size="xxl" onClick={() => this.changeTask(CONTINUE)}>Continue</Button> }
        { transitions.includes(STOP) && <Button className="cdFore" variant="light" size="xxs" onClick={() => this.changeTask(STOP)}>Stop</Button> }
        { this.state.task.status === PAUSED && <StressCollector submitStress={this.handleSubmitStress(false)} />}
      </div>;
    };
    return (
      <div>
        <MyNavBar/>
          <RefreshButton />
          <AsyncAwareContainer loading={this.state.loading}>
          	<Container className="text-center">
          	{
          		(this.state.task.status === 'finished') ?

          		(<div>
					      <Card className="cdFore">
          				<Card.Body>
									  <h4>Task {this.state.task.name} completed, time spent: {moment.duration(this.state.task.duration).format("m [minute]")}</h4>
                    <Table bordered style={{'color': 'white'}}>
                      <thead>
                        <tr>
                          <th>Score</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1 - 4 = low stress</td>
                          <td>You are likely <b>not</b> psychologically distressed</td>
                        </tr>
                        <tr>
                          <td>4.1 - 7 = moderate stress</td>
                          <td>You are likely <b>mildly</b> psychologically distressed</td>
                        </tr>
                        <tr>
                          <td>7.1 - 10 = high stress</td>
                          <td>You are likely to be <b>severely</b> psychologically distressed</td>
                        </tr>
                      </tbody>
                    </Table>
								  </Card.Body>
								</Card>
							  <br/><br/>
          			
								{
									this.state.task.status === FINISHED &&
									<h4 className="cdBack">
                    {typeof this.state.task.stress === 'number' && `Submitted average stress level: ${this.state.task.stress}`}
                    <br/>
                    {typeof this.state.task.finalStress === 'number' && `Submitted overall stress level: ${this.state.task.finalStress}`}
                  </h4>
								}

                { this.state.task.status === FINISHED &&
                  typeof this.state.task.finalStress !== 'number' &&
                  <div>
                    <h4 className="cdBack">Please submit an overall stress score: </h4>
                    <StressCollector submitStress={this.handleSubmitStress(true, true)} />
                  </div>
                }
          		</div>)

          		:

	          	(<div>
	          		<Card className="cdFore">
	          			<Card.Body>
									  <h2>{this.state.task.name}</h2>
									  <br/><br/>
									  <h6>{this.taskStatus()}</h6>
									  <br/><br/><br/>
									  <h5>Task Details</h5>
									  <h6>Start Date: {this.state.task.startTime ? moment(this.state.task.startTime).format(timeFormat) : ''} | End Date: {this.state.task.endTime ? moment(this.state.task.endTime).format(timeFormat) : ''}</h6>
								  </Card.Body>
								</Card>
                <Buttons />
							</div>)
	          }
						</Container>
          </AsyncAwareContainer>
      </div>
    );
  }
}

class StressCollector extends Component {
	state = {
    value: 5,
    comments: ""
  };

  onEnd = () => (render, handle, value, un, percent) => {
    this.setState({
    	value: percent/10
    });
  };

  render() {
    return (
    	<div>
    		<h6 className="cdBack">Drag the scroll bar up to indicate how stressful you felt in completing this activity</h6>
    		<div style={{
    			marginLeft: '10rem',
    			display: 'flex',
				  justifyContent: 'center',
          'height': '35rem'
				}}>
          <StressSlider start={this.state.value} onEnd={this.onEnd} />
	      </div>
        <Form.Group>
          <h6 className="cdBack">Comments</h6>
          <Form.Control
            onChange={e => this.setState({comments: e.target.value})}
            as="textarea"
            rows="4"
          />
        </Form.Group>
	      <Button className="cdFore" variant="light" onClick={() => this.props.submitStress(this.state.value, this.state.comments)}>Submit</Button>
      </div>
    );
  }
}

export default DetailsPage;