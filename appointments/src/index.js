import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./components/AppointmentsDayView";
import { sampleAppointments } from "./sampleData";

const rootDiv = document.getElementById("root");

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  rootDiv
);
