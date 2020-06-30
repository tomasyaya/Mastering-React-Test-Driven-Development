import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./components/Appointment";
import { sampleAppointments } from "./sampleData";

const rootDiv = document.getElementById("root");

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  rootDiv
);
