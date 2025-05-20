import { Star, StarBorder } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
type StarButtonProps = {
    isStarred: boolean;
}
export default function StarButtonOverlay({isStarred}:StarButtonProps) {

  return (
    <Box>
        <Button
            sx={{
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "transform 0.2s",
            }}
        >
        <StarBorder
            sx={{
                color: 'white',
                fontSize: 28,
                position: "absolute",
            }}
        />
          
        <Star
        sx={{
            color: isStarred ? "yellow" : 'rgba(0, 0, 0, 0.54)',
            fontSize: 28,
            cursor: "pointer",
        }}
        />
        </Button>
    </Box>
  )
}