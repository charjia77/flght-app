import * as React from "react";
import axios from "axios";

import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import TextField from "@mui/material/TextField";

export default class FlightList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flights: [],
      sourceCity: '',
      destinationCity: '',
      maxStops: '',
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:8080/flights`).then((res) => {
      const flights = res.data;
      this.setState({ flights: flights });
    });
  }

  findFlight = () => {
    const { sourceCity, destinationCity, maxStops } = this.state;
    axios
      .get(
        `http://localhost:8080/flights/${sourceCity}/${destinationCity}/${maxStops}`
      )
      .then((res) => {
        const flights = res.data;
        if (flights.length === 0) {
          alert("No flights Found");
        } else {
          const flights = res.data;
          this.setState({ flights: flights });
        }
      });
  };

  setSourceCity = (event) => {
    this.setState({
      sourceCity: event.target.value,
    });
  };

  setDestinationCity = (event) => {
    this.setState({
      destinationCity: event.target.value,
    });
  };

  setMaxStop = (event) => {
    this.setState({
      maxStops: event.target.value,
    });
  };

  render() {
    const flights = this.state.flights;
    return (
      <Card sx={{ maxWidth: "sm" }}>
        <CardContent>
          <Typography variant="body2">Flight Available:</Typography>
          <List>
            {flights.map((flight) => (
              <ListItem key={flight.source + flight.destination + flight.price}>
                <FlightTakeoffIcon />
                <ListItemText primary={flight.source} />
                <FlightLandIcon />
                <ListItemText primary={flight.destination} />
                <ListItemText primary={`$${flight.price}`} />
              </ListItem>
            ))}
          </List>

          <TextField
            id="source"
            label="From"
            variant="outlined"
            size="small"
            value={this.state.sourceCity}
            onChange={this.setSourceCity}
          />
          <TextField
            id="destination"
            label="To"
            variant="outlined"
            size="small"
            value={this.state.destinationCity}
            onChange={this.setDestinationCity}
          />
          <TextField
            id="outlined-basic"
            label="Max Stops"
            variant="outlined"
            size="small"
            value={this.state.maxStops}
            onChange={this.setMaxStop}
          />
        </CardContent>
        <CardActions>
          <Button variant="contained" size="small" onClick={this.findFlight}>
            Find Cheapest Plan
          </Button>
        </CardActions>
      </Card>
    );
  }
}
