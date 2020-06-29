import React from "react";
import ReactDOM from "react-dom";
import {
  Appointment,
  AppointmentsDayView,
} from "../src/components/Appointment";

describe("Appointment", () => {
  let container;
  beforeEach(() => {
    container = document.createElement("div");
  });

  const render = (component) => ReactDOM.render(component, container);

  it("renders the customer first name", () => {
    const customer = { firstName: "Ashley" };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch("Ashley");
  });

  it("renders another customer first name", () => {
    const customer = { firstName: "Jordan" };
    render(<Appointment customer={customer} />);
    expect(container.textContent).toMatch("Jordan");
  });
});

describe("AppointmentDayView", () => {
  let container;
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(12, 0) },
    { startsAt: today.setHours(13, 0) },
  ];
  beforeEach(() => {
    container = document.createElement("div");
  });
  const render = (component) => ReactDOM.render(component, container);
  it("renders a div with the right id", () => {
    render(<AppointmentsDayView appointments={[]} />);
    const div = container.querySelector("div#appointmentsDayView");
    expect(div).not.toBeNull();
  });
  it("renders multiple appointments in a ol", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const appointmentsList = container.querySelector("ol");
    expect(appointmentsList).not.toBeNull();
    expect(appointmentsList.children).toHaveLength(2);
  });
  it("renders each appointment inside an li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const appointmentsListItems = container.querySelectorAll("li");
    const [firstApp, secondApp] = appointmentsListItems;
    expect(firstApp.textContent).toEqual("12:00");
    expect(secondApp.textContent).toEqual("13:00");
    expect(appointmentsListItems).toHaveLength(2);
  });
});
