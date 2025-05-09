import {
  Paper,
  Typography,
  List,
  ListItem,
  Chip,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Grid,
} from "@mui/material";
import { Activity } from "../../../app/models/Types/activity";

type Props = {
  activity?: Activity; // Replace with the actual type of your activity object
};

export default function ActivityDetailsSidebar({ activity }: Props) {

  return (
    <>
      <Paper
        sx={{
          textAlign: "center",
          border: "none",
          backgroundColor: "primary.main",
          color: "white",
          p: 2,
        }}
      >
        <Typography variant="h6">
          {activity?.attendees.length}{" "}
          {activity?.attendees.length === 1 ? "Person" : "People"} Going
        </Typography>
      </Paper>
      <Paper sx={{ padding: 2 }}>
        {activity?.attendees.map((attendee) => (
          <Grid key={attendee.id} container alignItems="center">
            <Grid size={8}>
              <List sx={{ display: "flex", flexDirection: "column" }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{ width: 75
                        , height: 75
                        , mr: 3
                        
                      }}
                      alt={attendee.displayName}
                      src={attendee.imageUrl}
                    />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="h6">{attendee.displayName}</Typography>
                    {attendee?.isFollowing && (
                      <Typography variant="body2" color="orange">
                        Following
                      </Typography>
                    )}
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
            <Grid
              size={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {activity?.hostId === attendee.id && (
                <Chip
                  label="Host"
                  color="warning"
                  variant="filled"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Grid>
          </Grid>
        ))}
      </Paper>
    </>
  );
}
