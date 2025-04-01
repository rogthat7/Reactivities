import { FormControl, FormHelperText, InputLabel, Select,MenuItem } from "@mui/material";
import { SelectProps } from "@mui/material/Select";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";


type Props<T extends FieldValues> = {
    items : {text:string, value: string}[];
    label : string;
} & UseControllerProps<T> & Partial<SelectProps>

export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});
  return (
    <FormControl fullWidth error={!!fieldState.error}>
        <InputLabel>{props.label}</InputLabel>
        <Select 
            value={props.value || ''}
            label={props.label}
            onChange={field.onChange}
        >
            {props.items.map(item => (
                <MenuItem key={item.value} value={item.value}>
                    {item.text}
                </MenuItem>
            ))}
        </Select>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}