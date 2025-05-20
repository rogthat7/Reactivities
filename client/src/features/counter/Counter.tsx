import { observer } from "mobx-react-lite";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useStore } from "../../lib/hooks/useStore";

export default observer( function Counter() {
    const { counterStore } = useStore();
    const { count, title } = counterStore;
    console.log('Counter component rendered', count, title);
  return (
          <>
            <Typography variant="h4" color="primary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" color="secondary" gutterBottom>
              Count: {counterStore.count}
            </Typography>

    <ButtonGroup variant="contained" color="primary" aria-label="outlined primary button group" sx={{ mt: 2, p: 2, gap: 2 }}>
        <Button color="primary" variant="contained" onClick={() => counterStore.increment(1)}>Increment</Button>
        <Button color="secondary" variant="contained" onClick={() => counterStore.decrement(1)}>Decrement</Button>
    </ButtonGroup>
    </>
    
  )
})