import React from "react";
import ReactDOMTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulation";
import { AppointmentForm } from "../src/components/AppointmentForm";

describe("AppointmentForm", () => {
  let container, render;
  beforeEach(() => {
    ({ container, render } = createContainer());
  });
  const form = (id) => container.querySelector(`form[id="${id}"]`);
  const field = (fieldName) => form("appointment").elements[fieldName];
  const labelFor = (element) =>
    container.querySelector(`label[for="${element}"]`);
  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find((option) => option.textContent === textContent);
  };
  const timeSlotTable = () => container.querySelector("table#time-slots");

  it("renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });
  describe("service field", () => {
    it("renders a text box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });
    it("initially has a blank value choosen", () => {
      render(<AppointmentForm />);
      const [firstNode] = field("service").childNodes;
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });
    it("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];
      render(<AppointmentForm selectableServices={selectableServices} />);
      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map((node) => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it("pre-selects the existing value", () => {
      const services = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm selectableServices={services} service="Blow-dry" />
      );
      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBeTruthy();
    });
    it("renders a label that matches the element id", () => {
      const services = ["Cut", "Blow-dry"];
      render(<AppointmentForm selectableServices={services} />);
      const serviceLabel = labelFor("service");
      expect(serviceLabel).not.toBeNull();
      expect(serviceLabel.textContent).toEqual("Services");
    });
    it("saves existing value when submited", async () => {
      expect.hasAssertions();
      const selectableServices = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
          service="Cut"
          onSubmit={(service) => expect(service).toEqual("Cut")}
        />
      );
      await ReactDOMTestUtils.Simulate.submit(form("appointment"));
    });
    it("saves new value when submited", async () => {
      expect.hasAssertions();
      const selectableServices = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
          service="Cut"
          onSubmit={(service) => expect(service).toEqual("Blow-dry")}
        />
      );
      await ReactDOMTestUtils.Simulate.change(field("service"), {
        target: { value: "Blow-dry" },
      });
      await ReactDOMTestUtils.Simulate.submit(form("appointment"));
    });
  });

  describe("time slot table", () => {
    it("renders a table for time slots", () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });
    it("renders a slot for every half an hour between open and close time", () => {
      render(<AppointmentForm salonOpenAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll("tbody >* th");
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual("09:00");
      expect(timesOfDay[1].textContent).toEqual("09:30");
      expect(timesOfDay[3].textContent).toEqual("10:30");
    });
    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector("thead > tr");
      expect(headerRow.firstChild.textContent).toEqual("");
    });
    it("renders a week of available dates", () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        "thead >* th:not(:first-child)"
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual("Sat 01");
      expect(dates[1].textContent).toEqual("Sun 02");
      expect(dates[6].textContent).toEqual("Fri 07");
    });
  });
});
