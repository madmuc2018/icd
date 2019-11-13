import React, { Component } from "react";
import api from "../../Data/api";
import FormRow from '../FormRow';
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Container, Button, Modal, Row, Col, Table, Card } from 'react-bootstrap';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

class IncludePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      estimatedHours: "",
      regulatedStartDate: null,
      regulatedEndDate: null,
      focusedInput: null,
      notes: "",
      estimatedStress: 5,
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.validInput = () => this.state.name.trim().length > 0 
      && this.state.estimatedHours.trim().length > 0
      && this.state.regulatedStartDate
      && this.state.regulatedEndDate;

    this.submit = async event => {
      try {
        this.setState({loading: 'Including task'});
        const { name, estimatedHours, notes, estimatedStress } = this.state;
        await api.includeTask({ 
          name, estimatedHours, notes, estimatedStress,
          regulatedStartDate: this.state.regulatedStartDate.valueOf(),
          regulatedEndDate: this.state.regulatedEndDate.valueOf()
        });
        this.props.history.push("/");
      } catch (error) {
        alert(error);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.onEnd = () => (render, handle, value, un, percent) => {
      this.setState({
        estimatedStress: percent/10
      });
    };
  }

  componentWillUnmount() {
    this.componentUnmounted = true;
  }

  render() {
    if (window.FOR_INSTRUCTOR) {
      return (
        <div style={{
          'color': '#2699FB',
          'margin': '5% 0 0 0'
        }}>
          <h1 className="text-center">Create a New Task</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <Container style={{
              'minWidth': '100vw',
              'margin': '7% 0 0 0'
            }}>
              <Row>
                <Col>
                  <FormRow name="name" placeholder="Activity Name" onChange={this.handleChange} />
                  <FormRow name="estimatedHours" placeholder="Estimated Hours" onChange={this.handleChange} />
                  <FormRow name="notes" placeholder="Notes" onChange={this.handleChange} />
                  <DateRangePicker
                    startDate={this.state.regulatedStartDate} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={this.state.regulatedEndDate} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={({ startDate, endDate }) => this.setState({ regulatedStartDate: startDate, regulatedEndDate: endDate })} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                  />
                </Col>

                <Col xl={1}>
                  <Nouislider
                    className="text-center"
                    style={{'height': '100%'}}
                    start={this.state.estimatedStress}
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
                </Col>

                <Col>
                  <Card className="text-center" body>What level of stress do you think your students may experience in completing this task?</Card>
                  <br/>
                  <h5>Interpretation of the stress scroll bar:</h5>
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
                        <td>Student are likely not psychologically distressed</td>
                      </tr>
                      <tr>
                        <td>4.1 - 7 = moderate stress</td>
                        <td>Student are likely mildly psychologically distressed</td>
                      </tr>
                      <tr>
                        <td>7.1 - 10 = high stress</td>
                        <td>Student are likely to be severely psychologically distressed</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
            <br/><br/>
            <div className="text-center">
              {
                this.validInput() ? <Button onClick={this.submit}> Create </Button> : <Guard/>
              }
            </div>
          </AsyncAwareContainer>
        </div>
      );
    }
    return (
      <div>
        
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
        Create
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body> Do not leave name, Estimated Hours, and dates empty </Modal.Body>
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