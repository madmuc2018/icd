import React, { Component } from "react";
import { Col } from 'react-bootstrap';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

class StressSlider extends Component {
  render() {
    return <Col xl={1}>
      <style type="text/css">
        {`
          .noUi-handle {
            top: 0px;
            border-radius: 0px;
            border: none;
            border-image-width: 0;
            background: no-repeat url("https://img.icons8.com/officexs/16/000000/arrow.png");
            background-position: center;
            background-size: 100% 125%;
          }

          .noUi-handle::after, .noUi-handle::before{
            display: none;
          }

          .noUi-target {
            background: linear-gradient(#d40404, #ffcfcf);
          }

          .noUi-tooltip {
            color: #2699FB;
          }
        `}
      </style>
      <Nouislider
        className="text-center"
        style={{'height': '100%'}}
        start={this.props.start}
        orientation="vertical"
        direction="rtl"
        range={{
          min: 0,
          max: 10
        }}
        step={0.1}
        tooltips={{
          from: Number,
          to: v => {
            if (0 <= v && v < 4) {
              return "Mild";
            } else if (4 <= v && v < 7) {
              return "Moderate";
            } else {
              return "High";
            }
          }
        }}
        pips={{
          mode: 'values',
          values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          density: 1
        }}
        onEnd={this.props.onEnd()}
      />
    </Col>;
  }
}

export default StressSlider;