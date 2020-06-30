import React from "react";
import ReactDOMTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulation";
import { CustomerForm } from "../src/components/CustomerForm";

describe("CustomerForm", () => {
  let container, render;

  beforeEach(() => {
    ({ container, render } = createContainer());
  });
  const form = (id) => container.querySelector(`form[id=${id}]`);
  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.type).toEqual("text");
    expect(formElement.tagName).toEqual("INPUT");
  };
  const field = (name) => form("customer").elements[name];
  const labelFor = (formElement) =>
    container.querySelector(`label[for=${formElement}]`);
  it("renders a form", () => {
    render(<CustomerForm />);
    const currentForm = form("customer");
    expect(currentForm).not.toBeNull();
  });
  const itRendersAsATextBox = (fieldName) => {
    it("renders  as a text box", () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
  };
  const itIncludesTheExistingValue = (fieldName) => {
    it("includes the existing value", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });
  };
  const itRendersALabel = (fieldName, labelText) => {
    it("renders a label ", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(labelText);
    });
  };
  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => {
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).id).toEqual(fieldName);
    });
  };
  const itSavesExistingValueWhenSubmited = (fieldName, value) => {
    it("saves existing value when submited", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: value }}
          onSubmit={(prop) => expect(prop[fieldName]).toEqual(value)}
        />
      );
      await ReactDOMTestUtils.Simulate.submit(form("customer"));
    });
  };
  const itSavesNewValueWhenSubmited = (fieldName, value) => {
    it("saves new value when submited", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: "existing-value" }}
          onSubmit={(prop) => expect(prop[fieldName]).toEqual(value)}
        />
      );
      await ReactDOMTestUtils.Simulate.change(field(fieldName), {
        target: { value },
      });
      await ReactDOMTestUtils.Simulate.submit(form("customer"));
    });
  };

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSavesExistingValueWhenSubmited("firstName", "value");
    itSavesNewValueWhenSubmited("firstName", "Jaime");
  });
});
