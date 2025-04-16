import { Box, debounce, ListItemButton, TextField, Typography } from "@mui/material";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { List } from "semantic-ui-react";
import axios from "axios";
import { LocationIQSuggestion } from "../../lib/types/LocationIQSuggestion";

type Props<T extends FieldValues> = {
    label : string;
} & UseControllerProps<T>

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    useEffect(() => {
        if(field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '');
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value])

    const locationURL = 'https://api.locationiq.com/v1/autocomplete?key=e24adf97ff7897&limit=5&dedupe=1&'
    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if(!query || query.length < 3){
                setSuggestions([]);
                return;
            }
            setLoading(true)
            try {
                const response = await axios.get<LocationIQSuggestion[]>(`${locationURL}q=${query}`)
                setSuggestions(response.data);
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
            
        },500),[locationURL]
    )
    const handleChange =  async (value:string ) => {
        field.onChange(value);
        await fetchSuggestions(value)
    }
    const handleSelect = (suggestion: LocationIQSuggestion) => {
        const city = suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || suggestion.address?.county || suggestion.address?.state;
        const venue = suggestion.display_name; 
        const latitude = suggestion.lat;
        const longitude = suggestion.lon;
        setInputValue(venue);
        field.onChange({city, venue, latitude, longitude});
        setSuggestions([]);
        setLoading(false);
    }
  return (
    <Box>
        <TextField
            {...props}
            value={inputValue}
            label="Location"
            variant="outlined"
            fullWidth
            onChange={async (e) => {
                handleChange(e.target.value)
            }}
            helperText={fieldState.error?.message}
            error={Boolean(fieldState.error)}
        >
            
        </TextField>
        {loading && <Typography>Loading...</Typography>}
        {suggestions.length > 0 && (
            <List sx={{border: 1}}>
                {
                    suggestions.map(suggestion =>(
                        <ListItemButton
                        divider
                        key={suggestion.place_id}
                        onClick={()=>handleSelect(suggestion)}
                    >
                        {suggestion.display_name}
                    </ListItemButton>
                    ))
                }
            </List>)}
    </Box>
  );
}