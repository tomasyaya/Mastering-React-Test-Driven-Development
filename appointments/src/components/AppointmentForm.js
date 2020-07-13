import React, { useState } from "react";

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return Array(totalSlots)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return Array(7)
    .fill([midnight])
    .reduce((acc, _, i) => acc.concat([midnight + i * increment]));
};

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const toTimeValue = (timestamp) =>
  new Date(timestamp).toTimeString().substring(0, 5);

const TimeSlotTable = ({ salonClosesAt, salonOpensAt, today }) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonClosesAt,
  salonOpensAt,
  today,
}) => {
  const [selectedService, setSelectedService] = useState(service);
  const handleChange = ({ target }) => setSelectedService(target.value);

  return (
    <form
      id="appointment"
      onSubmit={() => {
        onSubmit(selectedService);
      }}
    >
      <label htmlFor="service">Services</label>
      <select
        value={selectedService}
        id="service"
        name="service"
        onChange={handleChange}
      >
        <option />
        {selectableServices.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <TimeSlotTable
        salonClosesAt={salonClosesAt}
        salonOpensAt={salonOpensAt}
        today={today}
      />
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
  service: "",
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
};
