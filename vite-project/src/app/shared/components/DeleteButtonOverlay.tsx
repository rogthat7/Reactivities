import { Delete, DeleteOutline } from "@mui/icons-material";
import { Box, Button } from "@mui/material";

export default function DeleteButtonOverlay() {

  return (
    <Box >
        <Button
            sx={{
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s",
            }}
        >
        <DeleteOutline
            sx={{
                color: 'white',
                fontSize: 28,
                position: "absolute",
            }}
        />
          
        <Delete
        sx={{
            color: 'red',
            fontSize: 28,
            cursor: "pointer",
        }}
        />
        </Button>
    </Box>
  )
}