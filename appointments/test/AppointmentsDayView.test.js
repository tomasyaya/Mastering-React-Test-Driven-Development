import React from "react";
import ReactDOM from "react-dom";
import ReactDOMTestUtils from "react-dom/test-utils";
import {
  Appointment,
  AppointmentsDayView,
} from "../src/components/AppointmentsDayView";

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
    { startsAt: today.setHours(12, 0), customer: { firstName: "Ashley" } },
    { startsAt: today.setHours(13, 0), customer: { firstName: "Jordan" } },
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
  it("initially shows a message saying there are no appointments scheduled for today", () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch(
      "There are no appointments scheduled for today"
    );
  });
  it("selects the first appointment by default", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch("Ashley");
  });
  it("has a button element in each li", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const buttons = container.querySelectorAll("li > button");
    const [button] = buttons;
    expect(buttons).toHaveLength(2);
    expect(button.type).toEqual("button");
  });
  it("renders another appointment when selected", () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const secondBtn = container.querySelectorAll("button")[1];
    ReactDOMTestUtils.Simulate.click(secondBtn);
    expect(container.textContent).toMatch("Jordan");
  });
});
