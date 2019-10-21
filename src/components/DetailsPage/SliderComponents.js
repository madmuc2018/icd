import * as React from 'react';
import {
  SliderItem,
  GetHandleProps,
  GetTrackProps
} from 'react-compound-slider';

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
interface IHandleProps {
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

export const Handle: React.SFC<IHandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps
}) => (
  <div
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    style={{
      top: `${percent}%`,
      position: 'absolute',
      marginLeft: -6,
      marginTop: -12,
      zIndex: 2,
      width: 24,
      height: 24,
      cursor: 'pointer',
      borderRadius: '50%',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#34568f'
    }}
    {...getHandleProps(id)}
  />
);

// *******************************************************
// TRACK COMPONENT
// *******************************************************
interface ITrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
}

export const Track: React.SFC<ITrackProps> = ({
  source,
  target,
  getTrackProps
}) => (
  <div
    style={{
      position: 'absolute',
      zIndex: 1,
      backgroundColor: '#7aa0c4',
      borderRadius: 7,
      cursor: 'pointer',
      width: 14,
      marginLeft: -1,
      top: `${source.percent}%`,
      height: `${target.percent - source.percent}%`
    }}
    {...getTrackProps()}
  />
);

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface ITickProps {
  key: String;
  tick: SliderItem;
  count: Number;
  format: Function;
}

export const Tick: React.SFC<ITickProps> = ({ tick, count, format }) => (
  <div>
    <div
      style={{
        position: 'absolute',
        marginTop: -0.5,
        marginLeft: 15,
        height: 2,
        width: 8,
        backgroundColor: 'rgb(200,200,200)',
        top: `${tick.percent}%`
      }}
    />
    <div
      style={{
        position: 'absolute',
        marginTop: -6,
        marginLeft: 25,
        fontSize: 10,
        top: `${tick.percent}%`
      }}
    >
      {format(tick.value)}
    </div>
  </div>
);
