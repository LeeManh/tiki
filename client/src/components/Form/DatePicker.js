import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as DatePickerMui } from "@mui/x-date-pickers/DatePicker";

const DatePicker = ({ date, setDate }) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePickerMui
          value={date}
          onChange={(newValue) => {
            setDate(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                ".MuiInputBase-input": {
                  padding: "4px 12px",
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};

export default DatePicker;
