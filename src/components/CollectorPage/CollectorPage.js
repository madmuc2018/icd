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
      csvs: []
    };

    this.handleChange = event => {
      const { name, value } = event.target;
      this.setState({
        [name]: value
      });
    }

    this.handleCollect = async event => {
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
              placeholder="Credentials"
              name="credentials"
              onChange={this.handleChange}
            />
            <br/>
            <Button className="cdFore" variant="light" onClick={this.handleCollect}>Collect</Button>
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