import React from "react";
import api from "../../Data/api";
import AsyncAwareContainer from '../AsyncAwareContainer';
import { Button, Container, Card, FormControl } from "react-bootstrap";
import { CSVLink } from "react-csv";

class CollectorPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      credentials: "",
      csvs: [],
      loginsCsv: null
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleCollectTasks = async event => {
      try {
        this.setState({loading: 'Collecting'});
        const csvs = await api.collect(this.state.credentials);
        this.setState({ csvs });
      } catch (error) {
        alert(error.message);
      } finally {
        if (!this.componentUnmounted)
          this.setState({loading: undefined});
      }
    }

    this.handleCollectLogins = async event => {
      try {
        this.setState({loading: 'Collecting'});
        const loginsCsv = await api.collectLogins(this.state.credentials);
        this.setState({ loginsCsv });
      } catch (error) {
        alert(error.message);
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
        <Container className="text-center">
          <h1>Collector</h1>
          <AsyncAwareContainer loading={this.state.loading}>
            <FormControl
              type="password"
              placeholder="Credentials"
              name="credentials"
              onChange={this.handleChange}
            />
            <br/>
            <Button className="cdFore" variant="light" onClick={this.handleCollectTasks}>Collect Tasks</Button>
            <Button className="cdFore" variant="light" onClick={this.handleCollectLogins}>Collect Logins</Button>
            {
              this.state.loginsCsv && 
              <Card border="success" style={{ margin: '2rem 8rem' }}>
                <Card.Body>
                  <Card.Title>Logins</Card.Title>
                  <CSVLink filename={`logins.csv`} data={this.state.loginsCsv}>Download</CSVLink>
                </Card.Body>
              </Card>
            }
            {
              this.state.csvs.map(c =>
                <Card key={c.name} border="success" style={{ margin: '2rem 8rem' }}>
                  <Card.Body>
                    <Card.Title>{c.name}</Card.Title>
                    <CSVLink filename={`${c.name}.csv`} data={c.csv}>Download</CSVLink>
                  </Card.Body>
                </Card>
              )
            }
          </AsyncAwareContainer>
        </Container>
      </div>
    );
  }
}

export default CollectorPage;