import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulation";
import { CustomerForm } from "../src/components/CustomerForm";

describe("CustomerForm", () => {
  let container, render;
  const originalFetch = window.fetch;
  let fetchSpy;
  const spy = () => {
    let receivedArguments;
    return {
      fn: (...args) => (receivedArguments = args),
      receivedArguments: () => receivedArguments,
      receivedArgument: (n) => receivedArguments[n],
    };
  };

  beforeEach(() => {
    ({ container, render } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  expect.extend({
    toHaveBeenCalled(received) {
      if (received.receivedArguments() === undefined) {
        return {
          pass: false,
          message: () => "Spy was not called.",
        };
      }
      return { pass: true, message: () => "Spy was called." };
    },
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
      render(<CustomerForm {...{ [fieldName]: value }} />);
      ReactTestUtils.Simulate.submit(form("customer"));
      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
    });
  };
  const itSavesNewValueWhenSubmited = (fieldName, value) => {
    it("saves new value when submited", async () => {
      render(<CustomerForm {...{ [fieldName]: "existing-value" }} />);
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("customer"));
      const fetchOpts = fetchSpy.receivedArgument(1);
      expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(value);
    });
  };
  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm onSubmit={() => {}} />);
    ReactTestUtils.Simulate.submit(form("customer"));
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual("/customers");
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(fetchOpts.method).toEqual("POST");
    expect(fetchOpts.credentials).toEqual("same-origin");
    expect(fetchOpts.headers).toEqual({
      "Content-Type": "application/json",
    });
  });

  describe("first name field", () => {
    itRendersAsATextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSavesExistingValueWhenSubmited("firstName", "value");
    itSavesNewValueWhenSubmited("firstName", "Jaime");
  });

  describe("last name field", () => {
    itRendersAsATextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSavesExistingValueWhenSubmited("lastName", "value");
    itSavesNewValueWhenSubmited("lastName", "Yaya");
  });

  describe("phone number field", () => {
    itRendersAsATextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSavesExistingValueWhenSubmited("phoneNumber", "1111");
    itSavesNewValueWhenSubmited("phoneNumber", "2222x");
  });

  it("has a submit button", () => {
    render(<CustomerForm />);
    const button = container.querySelector('button[type="submit"]');
    expect(button).not.toBeNull();
  });
});
