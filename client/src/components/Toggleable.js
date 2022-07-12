import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";
import { Box, Button, Paper } from "@mui/material";

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <Box>
      <Paper style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </Paper>
      <div style={showWhenVisible} className="toggleableContent">
        {props.children}
        <Button onClick={toggleVisibility}>
          {props.cancelLabel || "cancel"}
        </Button>
      </div>
    </Box>
  );
});

Toggleable.displayName = "Toggleable";

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Toggleable;
