import React, { useState } from "react";

/* material ui imports */
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

/* import local data */
import dictionary from "./data/dictionary.json";

/* styling */
const useStyles = makeStyles({
  inputRoot: {
    color: "#eee",
    "& .MuiOutlinedInput-notchedOutline": {
      borderRight: 0,
      borderWidth: "1px",
      borderColor: "#e0e0e0 !important",
      color: "#fff",
      borderRadius: "3px 0 0 3px",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff"
    }
  },
});
const textStyles = makeStyles({
  root: {
    "& label": {
      color: "#eee",
    },
    "& .MuiInputLabel-shrink": {
      color: "#eee",
    },
  },
});

export default function AutoDictionary() {
  /* bring in custom styles*/
  const classes = useStyles();
  const textClasses = textStyles();

  /* map through local words.json */
  const options = dictionary.map((option) => {
    const firstLetter = option.Fieldname[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  /* state controllers */
  const [inputValue, setInputValue] = useState("");

  return (
    <div style={{ display: "flex" }}>
      <Autocomplete
        /* get value on input change for copy to clipboard function */
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        disableClearable
        forcePopupIcon={true}
        id='combo-box'
        classes={classes}
        options={options.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        groupBy={(option) => option.firstLetter}
        getOptionSelected={(option, inputValue) => option.Fieldname === inputValue.Fieldname}
        getOptionLabel={(option) => option.Fieldname}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            classes={textClasses}
            label='Form Field Dictionary'
            variant='outlined'
          />
        )}
      />
      <Button
        variant='contained'
        style={{ borderRadius: "0 3px 3px 0" }}
        onClick={() => {
          navigator.clipboard.writeText(inputValue);
        }}
      >
        <i className='far fa-copy'></i>
        &nbsp; Copy
      </Button>
    </div>
  );
}
