import { TextField, TextFieldProps } from "@mui/material";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";
type Props<T extends FieldValues> = {} & UseControllerProps<T> & TextFieldProps
export default function TextInput <T extends FieldValues>(props : Props<T>) {
    const {field, fieldState} = useController({...props});
  return (
    <TextField
        {...props}
        {...field}
        value={field.value || ''}
        fullWidth
        onChange={(event) => {
            field.onChange(event.target.value);
            if (props.onChange) {
                props.onChange(event);
            }
        }}
        variant="outlined"
        error = {!!fieldState.error}
        helperText = {fieldState.error?.message}
    />
  )
}