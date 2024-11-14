import React from "react";
import DateTimePicker, { DateTimePickerProps } from "react-datetime-picker";

// Wrap DateTimePicker in a div and apply ref to the div
const DateTimePickerWrapper = React.forwardRef<
  HTMLDivElement,
  DateTimePickerProps
>((props, ref) => (
  <div ref={ref}>
    <DateTimePicker {...props} />
  </div>
));

DateTimePickerWrapper.displayName = "DateTimePickerWrapper";

export default DateTimePickerWrapper;
