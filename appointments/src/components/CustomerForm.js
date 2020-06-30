import React, { useState } from "react";

export const CustomerForm = ({ firstName, onSubmit }) => {
  const [customer, setCustomer] = useState({ firstName });

  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
      <label htmlFor="firstName">First name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        value={firstName}
        onChange={({ target }) =>
          setCustomer((customer) => ({ ...customer, firstName: target.value }))
        }
      />
    </form>
  );
};
