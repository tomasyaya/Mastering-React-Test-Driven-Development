import React, { useState, useCallback } from "react";

const timeIncrements = (numTimes, startTime, increment) =>
  Array(numTimes)
    .fill([startTime])
    .reduce((acc, _, i) => acc.concat([startTime + i * increment]));

const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrements(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrements(7, midnight, increment);
};

const toShortDate = (timestamp) => {
  const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(" ");
  return `${day} ${dayOfMonth}`;
};

const toTimeValue = (timestamp) =>
  new Date(timestamp).toTimeString().substring(0, 5);

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};

const RadioButtonIfAvailable = ({
  availableTimeSlots,
  date,
  timeSlot,
  checkedTimeSlot,
  handleStartsAtChange,
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  const isChecked = startsAt === checkedTimeSlot;
  if (
    availableTimeSlots.some(
      (availableTimeSlot) => availableTimeSlot.startsAt === startsAt
    )
  ) {
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        checked={isChecked}
        onChange={handleStartsAtChange}
      />
    );
  }
  return null;
};

const TimeSlotTable = ({
  salonClosesAt,
  salonOpensAt,
  today,
  availableTimeSlots,
  handleStartsAtChange,
}) => {
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
            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  handleStartsAtChange={handleStartsAtChange}
                  date={date}
                  timeSlot={timeSlot}
                />
              </td>
            ))}
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
  availableTimeSlots,
}) => {
  const [selectedService, setSelectedService] = useState(service);
  const handleChange = ({ target }) => setSelectedService(target.value);
  const handleStartsAtChange = useCallback(
    ({ target: { value: appValue } }) =>
      setSelectedService((appointment) => ({
        ...appointment,
        startsAt: parseInt(appValue),
      })),
    []
  );

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
        availableTimeSlots={availableTimeSlots}
        handleStartsAtChange={handleStartsAtChange}
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
  availableTimeSlots: [],
};
