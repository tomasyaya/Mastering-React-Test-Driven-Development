import React, { useState } from "react";

const appointmentTimeOfDay = (startsAt) => {
  const [h, m] = new Date(startsAt).toTimeString().split(":");
  return `${h}:${m}`;
};

export const Appointment = ({ customer }) => <div>{customer.firstName}</div>;

export const AppointmentsDayView = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointent] = useState(0);
  const currentCustomer = appointments[selectedAppointment];
  return (
    <div id="appointmentsDayView">
      <ol>
        {appointments.map(({ startsAt }, i) => (
          <li key={startsAt}>
            <button type="button" onClick={() => setSelectedAppointent(i)}>
              {appointmentTimeOfDay(startsAt)}
            </button>
          </li>
        ))}
      </ol>
      {!appointments.length ? (
        <div>There are no appointments scheduled for today.</div>
      ) : (
        <Appointment {...currentCustomer} />
      )}
    </div>
  );
};
