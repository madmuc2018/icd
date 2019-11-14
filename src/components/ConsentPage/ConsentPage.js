import React from "react";
import Consent from "../../stores/consent";
import { Button } from "react-bootstrap";
import consentPdf from "../consent.pdf";
import PDFViewer from "mgr-pdf-viewer-react";
import utils from '../utils';
import AsyncAwareContainer from '../AsyncAwareContainer';

class ConsentPage extends React.Component {
  state = {
    scale: 1
  }
  increaseScale = () => this.setState(({ scale }) => ({ scale: scale + 0.2 }))
  decreaseScale = () => this.setState(({ scale }) => ({ scale: scale - 0.2 }))

  handleConsent = async event => {
    try {
      this.setState({loading: 'Thank you, redirecting to login'});
      await utils.timeout(1000);
      Consent.doConsent();
      this.props.history.replace("/login");
    } catch (error) {
      alert(error);
    } finally {
      if (!this.componentUnmounted)
        this.setState({loading: undefined});
    }
  }

  render() {
    return (
      <AsyncAwareContainer loading={this.state.loading}>
        <style type="text/css">
          {`
            .customViewer {
              margin: 0;
              padding: 0;
              width: 30rem;
              text-align: left;
            }
            .customViewer > div:nth-child(1) {
              margin: 0;
              padding: 0;
              width: 30rem;
            }
            .customPrevBtn {
              cursor: pointer;
              display: inline-block;
              margin: 0;
              width: 3rem;
              color: white;
              background-color: black;
              border-width: 0.1rem;
              border-style: solid;
              border-radius: 0.5rem;
            }
            .customNextBtn {
              cursor: pointer;
              display: inline-block;
              margin: 0;
              width: 3rem;
              color: white;
              background-color: black;
              border-width: 0.1rem;
              border-style: solid;
              border-radius: 0.5rem;
            }
            .customPages {
              display: inline-block;
              width: 15rem;
            }
            .customWrapper {
              height: 3rem;
              font-size: 1.2rem;
              background-color: #fff;
            }
          `}
        </style>
        <Button variant="light" onClick={this.decreaseScale}>-</Button>
        <span>Scale: {this.state.scale}</span>
        <Button variant="light" onClick={this.increaseScale}>+</Button>
        <PDFViewer
          document={{url: consentPdf}}
          css="customViewer"
          scale={this.state.scale}
          navigation={{
            css: {
              previousPageBtn: 'customPrevBtn',
              nextPageBtn: 'customNextBtn',
              pages: 'customPages',
              wrapper: 'customWrapper'
            }
          }}
        />
        <div style={{
          margin: '2rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Button size="lg" className="text-center" variant="primary" onClick={this.handleConsent}>
            Give consent
          </Button>
        </div>
      </AsyncAwareContainer>
    );
  }
}

export default ConsentPage;