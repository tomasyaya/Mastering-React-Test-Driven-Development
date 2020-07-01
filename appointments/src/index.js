import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./components/AppointmentsDayView";
import { CustomerForm } from "./components/CustomerForm";
import { sampleAppointments } from "./sampleData";

const rootDiv = document.getElementById("root");

ReactDOM.render(<CustomerForm />, rootDiv);
