import React, { Component } from "react";
import api from "../../Data/api";
import MyNavBar from '../MyNavBar';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Button, Card, Table, Container } from 'react-bootstrap';
import moment from 'moment';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

const timeFormat = 'MMMM Do YYYY, h:mm:ss a';

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
        const task = this.state.task;

        switch(operation) {
          case "START": 
            if (task.startTime)
              return console.warn("Already started")
            task.startTime = moment().format(timeFormat);
            break;
          case "END": 
            if (task.endTime)
              return console.warn("Already end");
            task.endTime = moment().format(timeFormat);
            break;
          default:
            return console.warn(`No ${operation}`);
        }

        const newGuid = await api.updateTask(this.state.guid, task);
	      const updatedTask = (await api.getTasks()).filter(o => o.guid === newGuid)[0];

	      this.setState({
	      	guid: updatedTask.guid,
	      	task: updatedTask.data
	      });

        this.props.history.replace(`/tasks/${newGuid}/details`);
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.taskStatus = () => {
      if (!this.state.task.startTime)
        return "You haven't started this task"
      if (this.state.task.startTime && !this.state.task.endTime)
        return "You're currently working on this task"
      if (this.state.task.startTime && this.state.task.endTime)
        return "You've completed this task"
      return "Error"
    }

    this.taskDuration = () => {
			const duration = moment.duration(moment(this.state.task.endTime, timeFormat).diff(moment(this.state.task.startTime, timeFormat)));
			return Math.round(duration.asMinutes() * 100) / 100;
    }

    this.handleSubmitStress = async stress => {
      try {
        this.setState({loading: 'Updating ...'});
        const task = this.state.task;
        task.stress = stress;

        const newGuid = await api.updateTask(this.state.guid, task);
	      const updatedTask = (await api.getTasks()).filter(o => o.guid === newGuid)[0];

	      this.setState({
	      	guid: updatedTask.guid,
	      	task: updatedTask.data
	      });

        this.props.history.replace(`/tasks/${newGuid}/details`);
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }
  }

  async componentDidMount() {
    try {
      this.setState({loading: true});
      const tasks = await api.getTasks();
      const i = tasks.filter(o => o.guid === this.props.match.params.id)[0];

      this.setState({
      	guid: i.guid,
      	task: i.data
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
          <AsyncAwareContainer loading={this.state.loading}>
          	<Container className="text-center">
          	{
          		(this.state.task.startTime && this.state.task.endTime) ?

          		(<div>
					      <Card style={{'backgroundColor': '#2799F9', 'color': 'white'}}>
          				<Card.Body>
									  <h2>Task {this.state.task.name} completed</h2>
									  <br/><br/>
									  <h5>Time spent</h5>
									  <h6>{this.taskDuration()} minutes</h6>
								  </Card.Body>
								</Card>
							  <br/><br/>
          			
								{
									(typeof this.state.task.stress === 'number') ?
									<h6 style={{'color': '#2699FB'}}>Submitted stress level: {this.state.task.stress}</h6>
									:
									<StressCollector submitStress={this.handleSubmitStress} />
								}
          		</div>)

          		:

	          	(<div>
	          		<Card style={{'backgroundColor': '#2799F9', 'color': 'white'}}>
	          			<Card.Body>
									  <h2>{this.state.task.name} aaa</h2>
									  <br/><br/>
									  <h6>{this.taskStatus()}</h6>
									  <br/><br/><br/>
									  <h5>Task Details</h5>
									  <h6>Start Date: {this.state.task.startTime} | End Date: {this.state.task.endTime}</h6>
								  </Card.Body>
								</Card>

								<div>
								  <style type="text/css">
								    {`
									    .btn-flat {
									      background-color: #2799F9;
									      color: white;
									    }

									    .btn-xxl {
									      margin: 5rem 1rem;
									      font-size: 3rem;
									      height: 20rem;
									      width: 20rem;
									      border-radius: 40rem;
									  	}
								    `}
								  </style>


								  { !this.state.task.startTime ?
			            		<Button variant="flat" size="xxl" onClick={() => this.changeTask("START")}>Start</Button>
			              : <div/>
			            }
			            { !this.state.task.endTime && this.state.task.startTime ?
			                <Button variant="flat" size="xxl" onClick={() => this.changeTask("END")}>Stop</Button>
			              : <div/>
			            }
								</div>
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
    value: 5
  };

  onEnd = () => (render, handle, value, un, percent) => {
    this.setState({
    	value: percent/10
    });
  };

  render() {
    return (
    	<div>
    		<h6 style={{'color': '#2699FB'}}>Drag the scroll bar up to indicate how stressful you felt in completing this activity</h6>
    		<div style={{
    			margin: '2rem',
    			display: 'flex',
				  justifyContent: 'center'
				}}>
		      <Nouislider
		      	className="text-center"
		      	style={{'height': '35rem'}}
		        start={this.state.value}
		        orientation="vertical"
		        direction="rtl"
		        range={{
		          min: 0,
		          max: 10
		        }}
		        step={0.1}
		        pips={{
		        	mode: 'values',
			        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			        density: 1
		        }}
		        onEnd={this.onEnd()}
		      />
	      </div>
	      <Table bordered style={{'color': '#2699FB'}}>
				  <thead>
				    <tr>
				      <th>Score</th>
				      <th>Meaning</th>
				    </tr>
				  </thead>
				  <tbody>
				    <tr>
				      <td>1 - 4 = low stress</td>
				      <td>You are likely not psychologically distressed</td>
				    </tr>
				    <tr>
				      <td>4.1 - 7 = moderate stress</td>
				      <td>You are likely mildly psychologically distressed</td>
				    </tr>
				    <tr>
				      <td>7.1 - 10 = high stress</td>
				      <td>You are likely to be severely psychologically distressed</td>
				    </tr>
				  </tbody>
				</Table>

	      <Button style={{'backgroundColor': '#2799F9'}} onClick={() => this.props.submitStress(this.state.value)}>Submit</Button>
      </div>
    );
  }
}

// import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
// import { Handle, Track, Tick } from './SliderComponents';

// const sliderStyle: React.CSSProperties = {
//   position: 'relative',
//   height: '400px',
//   marginLeft: '45%'
// };
// const railStyle: React.CSSProperties = {
//   position: 'absolute',
//   width: '14px',
//   height: '100%',
//   cursor: 'pointer',
//   marginLeft: '-1px',
//   borderRadius: '7px',
//   backgroundColor: 'rgb(155,155,155)'
// };
// const domain= [0, 10];
// const formatTicks = d => d;

// class StressCollector extends Component {
// 	constructor() {
//     super();

//     // react seems to be slow and inconsistent when assigning an object to state,
//     // set task: null and do console.log in the jsx to see
//     this.state = {
//       values: [5]
//     };

//     this.handleSliderChange = values => {
// 	    this.setState({ values });
// 	  };
// 	}

// 	render() {
// 		const {
//       state: { values }
//     } = this;

//     return (
//     	<div>
// 	    	<h6 style={{'color': '#2699FB'}}>Drag the scroll bar up to indicate how stressful you felt in completing this activity</h6>
// 				<div style={{ margin: 20 }}>
// 	        <Slider
// 	          mode={1}
// 	          step={0.1}
// 	          reversed={true}
// 	          vertical={true}
// 	          domain={domain}
// 	          rootStyle={sliderStyle}
// 	          onChange={this.handleSliderChange}
// 	          values={values}
// 	        >
// 	          <Rail>
// 	            {({ getRailProps }) => (
// 	              <div style={railStyle} {...getRailProps()} />
// 	            )}
// 	          </Rail>
// 	          <Handles>
// 	            {({ handles, getHandleProps }) => (
// 	              <div className="slider-handles">
// 	                {handles.map(handle => (
// 	                  <Handle
// 	                    key={handle.id}
// 	                    handle={handle}
// 	                    domain={domain}
// 	                    getHandleProps={getHandleProps}
// 	                  />
// 	                ))}
// 	              </div>
// 	            )}
// 	          </Handles>
// 	          <Tracks left={false}>
// 	            {({ tracks, getTrackProps }) => (
// 	              <div className="slider-tracks">
// 	                {tracks.map(({ id, source, target }) => (
// 	                  <Track
// 	                    key={id}
// 	                    source={source}
// 	                    target={target}
// 	                    getTrackProps={getTrackProps}
// 	                  />
// 	                ))}
// 	              </div>
// 	            )}
// 	          </Tracks>
// 	          <Ticks values={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
// 	            {({ ticks }) => (
// 	              <div className="slider-ticks">
// 	                {ticks.map(tick => (
// 	                  <Tick
// 	                    key={tick.id}
// 	                    format={formatTicks}
// 	                    tick={tick}
// 	                    count={ticks.length}
// 	                  />
// 	                ))}
// 	              </div>
// 	            )}
// 	          </Ticks>
// 	        </Slider>
// 	      </div>

// 	      <Table bordered style={{'color': '#2699FB'}}>
// 				  <thead>
// 				    <tr>
// 				      <th>Score</th>
// 				      <th>Meaning</th>
// 				    </tr>
// 				  </thead>
// 				  <tbody>
// 				    <tr>
// 				      <td>1 - 4 = low stress</td>
// 				      <td>You are likely not psychologically distressed</td>
// 				    </tr>
// 				    <tr>
// 				      <td>4.1 - 7 = moderate stress</td>
// 				      <td>You are likely mildly psychologically distressed</td>
// 				    </tr>
// 				    <tr>
// 				      <td>7.1 - 10 = high stress</td>
// 				      <td>You are likely to be severely psychologically distressed</td>
// 				    </tr>
// 				  </tbody>
// 				</Table>

// 	      <Button style={{'backgroundColor': '#2799F9'}} onClick={() => this.props.submitStress(this.state.values[0])}>Submit</Button>
//       </div>
//     );
// 	}
// }

export default DetailsPage;