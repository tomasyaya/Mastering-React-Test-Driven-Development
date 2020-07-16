import React from "react";
import { act } from "react-dom/test-utils";
import { createContainer, withEvent } from "./domManipulation";
import { CustomerForm } from "../src/components/CustomerForm";
import {
  fetchResponseError,
  fetchResponseOk,
  requestBodyOf,
} from "./spyHelpers";
import "whatwg-fetch";

describe("CustomerForm", () => {
  let render, form, field, labelFor, element, change, submit;

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.type).toEqual("text");
    expect(formElement.tagName).toEqual("INPUT");
  };

  beforeEach(() => {
    ({
      render,
      field,
      form,
      labelFor,
      element,
      change,
      submit,
    } = createContainer());
    jest.spyOn(window, "fetch").mockReturnValue(fetchResponseOk({}));
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it("renders a form", () => {
    render(<CustomerForm />);
    const currentForm = form("customer");
    expect(currentForm).not.toBeNull();
  });
  const itRendersAsATextBox = (fieldName) => {
    it("renders  as a text box", () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field("customer", fieldName));
    });
  };
  const itIncludesTheExistingValue = (fieldName) => {
    it("includes the existing value", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field("customer", fieldName).value).toEqual("value");
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
      expect(field("customer", fieldName).id).toEqual(fieldName);
    });
  };
  const itSavesExistingValueWhenSubmited = (fieldName, value) => {
    it("saves existing value when submited", async () => {
      render(<CustomerForm {...{ [fieldName]: value }} />);
      submit(form("customer"));

      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value,
      });
    });
  };
  const itSavesNewValueWhenSubmited = (fieldName, value) => {
    it("saves new value when submited", async () => {
      render(<CustomerForm {...{ [fieldName]: "existing-value" }} />);

      change(field("customer", fieldName), withEvent(fieldName, value));
      submit(form("customer"));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value,
      });
    });
  };

  it("calls fetch with the right properties when submitting data", async () => {
    render(<CustomerForm onSubmit={() => {}} />);
    submit(form("customer"));
    expect(window.fetch).toHaveBeenCalledWith(
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
      window.fetch.mockReturnValue(fetchResponseOk(customer));
      const saveSpy = jest.fn();
      render(<CustomerForm onSave={saveSpy} />);
      await act(async () => {
        submit(form("customer"));
      });
      expect(saveSpy).toHaveBeenCalledWith(customer);
    });
  };

  const itDoesNotNotifiyOnSave = () => {
    it("does not notify onSave if the POST request returns an error", async () => {
      window.fetch.mockReturnValue(fetchResponseError());
      const saveSpy = jest.fn();
      render(<CustomerForm onSave={saveSpy} />);
      await act(async () => {
        submit(form("customer"));
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });
  };

  const itPreventsTheDefaultAction = () => {
    it("prevents the default action when submitting the form", async () => {
      const preventDefaultSpy = jest.fn();
      render(<CustomerForm />);
      await act(async () => {
        submit(form("customer"), {
          preventDefault: preventDefaultSpy,
        });
      });
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  };

  const itRendersErrosMessage = () => {
    it("renders error message when fetch call fails", async () => {
      window.fetch.mockReturnValue(Promise.resolve({ ok: false }));
      render(<CustomerForm />);
      await act(async () => {
        submit(form("customer"));
      });

      expect(element(".error")).not.toBeNull();
      expect(element(".error").textContent).toMatch("error occurred");
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
    const button = element('button[type="submit"]');
    expect(button).not.toBeNull();
  });

  itNotifiesOnSaveWhenFormSubmited();
  itDoesNotNotifiyOnSave();
  itPreventsTheDefaultAction();
  itRendersErrosMessage();
});
