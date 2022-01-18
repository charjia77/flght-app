import React from 'react';
import ReactDOM from 'react-dom';

import { StyledEngineProvider } from '@mui/material/styles';
// import Demo from './demo';
import FlightList from './app'

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <FlightList />
  </StyledEngineProvider>,
  document.getElementById("root")
);

// ReactDOM.render(<App />, document.getElementById("root"));
