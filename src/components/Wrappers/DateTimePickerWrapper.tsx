import React from "react";
import DateTimePicker, { DateTimePickerProps } from "react-datetime-picker";

// Use forwardRef, but ignore the ref when passing props to DateTimePicker
const DateTimePickerWrapper = React.forwardRef<
  HTMLDivElement,
  DateTimePickerProps
>((props) => <DateTimePicker {...props} />);

DateTimePickerWrapper.displayName = "DateTimePickerWrapper";

export default DateTimePickerWrapper;
