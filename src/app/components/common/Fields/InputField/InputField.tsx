import React from 'react';
import { TextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';

type InputTypes = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  error?: string | null;
  helperText?: string | null;
  autoFocus?: boolean;
} & MuiTextFieldProps;

const InputField: React.FC<InputTypes> = ({ label, type = 'text', name, value, onChange, error = null, ...rest }) => {
  console.log(name, error);
  return (
      <TextField
          variant='outlined'
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          error={error ? true : false}
          helperText= { error ?
              <>
                <b>{error}</b>
              </>
              :
              <></>
          }
          /* {...(error && { error: true, helperText: error })}*/
          {...rest}
      />
  );
};

export default React.memo(InputField);
