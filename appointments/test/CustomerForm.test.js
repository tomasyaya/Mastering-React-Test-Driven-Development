import React from "react";
import ReactTestUtils, { act } from "react-dom/test-utils";
import { createContainer } from "./domManipulation";
import { CustomerForm } from "../src/components/CustomerForm";

describe("CustomerForm", () => {
  let container, render;
  const originalFetch = window.fetch;
  let fetchSpy;

  // const spy = () => {
  //   let receivedArguments;
  //   let returnValues;
  //   return {
  //     fn: (...args) => {
  //       receivedArguments = args;
  //       return returnValues;
  //     },
  //     receivedArguments: () => receivedArguments,
  //     receivedArgument: (n) => receivedArguments[n],
  //     stubReturnValue: (value) => (returnValues = value),
  //   };
  // };

  const fetchResponseOk = (body) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
    });
  const fetchResponseError = () => Promise.resolve({ ok: false });
  const fetchRequestBody = () => JSON.parse(fetchSpy.mock.calls[0][1].body);

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.type).toEqual("text");
    expect(formElement.tagName).toEqual("INPUT");
  };

  const form = (id) => container.querySelector(`form[id=${id}]`);
  const field = (name) => form("customer").elements[name];
  const labelFor = (formElement) =>
    container.querySelector(`label[for=${formElement}]`);

  beforeEach(() => {
    ({ container, render } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

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

      expect(fetchRequestBody()).toMatchObject({
        [fieldName]: value,
      });
    });
  };
  const itSavesNewValueWhenSubmited = (fieldName, value) => {
    it("saves new value when submited", async () => {
      render(<CustomerForm {...{ [fieldName]: "existing-value" }} />);
      ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName },
      });
      ReactTestUtils.Simulate.submit(form("customer"));
      expect(fetchRequestBody()).toMatchObject({
        [fieldName]: value,
      });
    });
  };

  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm onSubmit={() => {}} />);
    ReactTestUtils.Simulate.submit(form("customer"));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/customers",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
      })
    );
  });

  const itNotifiesOnSaveWhenFormSubmited = () => {
    it("notifies on saves when form is submited", async () => {
      const customer = { id: 123 };
      fetchSpy.mockReturnValue(fetchResponseOk(customer));
      const saveSpy = jest.fn();
      render(<CustomerForm onSave={saveSpy} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).toHaveBeenCalledWith(customer);
    });
  };

  const itDoesNotNotifiyOnSave = () => {
    it("does not notify onSave if the POST request returns an error", async () => {
      fetchSpy.mockReturnValue(fetchResponseError());
      const saveSpy = jest.fn();
      render(<CustomerForm onSave={saveSpy} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  };

  const itPreventsTheDefaultAction = () => {
    it("prevents the default action when submitting the form", async () => {
      const preventDefaultSpy = jest.fn();
      render(<CustomerForm />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"), {
          preventDefault: preventDefaultSpy,
        });
      });
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  };

  const itRendersErrosMessage = () => {
    it("renders error message when fetch call fails", async () => {
      fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
      render(<CustomerForm />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form("customer"));
      });
      const errorElement = container.querySelector(".error");
      expect(errorElement).not.toBeNull();
      expect(errorElement.textContent).toMatch("error occurred");
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

  itNotifiesOnSaveWhenFormSubmited();
  itDoesNotNotifiyOnSave();
  itPreventsTheDefaultAction();
  itRendersErrosMessage();
});
