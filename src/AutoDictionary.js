import React, { useState, useEffect } from "react";

/* material ui imports */
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";

/* toastify imports */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      color: "#fff",
    },
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

/* toast function */
const notify = () => toast("Copied to clipboard");

/* dictionary component */
export default function AutoDictionary() {
  const [dictionary, setDictionary] = useState([]);

  /* fetch local data */
  const getData = () => {
    fetch("data/dictionary.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setDictionary(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

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

  /* filter options */
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    trim: "true",
  });

  return (
    <div style={{ display: "flex" }}>
      <Autocomplete
        /* get value on input change for copy to clipboard function */
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          navigator.clipboard.writeText(newInputValue);
          setInputValue(newInputValue);
          notify();
        }}
        /* filter options */
        filterOptions={filterOptions}
        /* identity */
        id='combo-box'
        classes={classes}
        /* general config */
        disableClearable
        forcePopupIcon={true}
        options={options.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        groupBy={(option) => option.firstLetter}
        getOptionSelected={(option, inputValue) =>
          option.Fieldname === inputValue.Fieldname
        }
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
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
