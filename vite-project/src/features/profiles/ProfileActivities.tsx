import { Box, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { UserActivity } from "../../app/models/Types/userActivity";
import { Link } from "react-router";
import { format } from "date-fns";

type Props = {
  userActivities: UserActivity[];
};
export default function ProfileActivities({ userActivities }: Props) {
  return (
    <Box >
      <Grid container spacing={2} sx={{ height: 400, overflowY: "auto" }}>
        <Grid size={12} spacing={10} display={"flex"} direction={"row"} sx={{ gap: 2, p: 2 }}>
          {userActivities &&
            userActivities.map((activity: UserActivity) => (
              <Link
          key={activity.id}
          to={`/activities/${activity.id}`}
          style={{ textDecoration: "none" }}
              >
          <Card
            elevation={4}
            sx={{
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardMedia
              component="img"
              src={`/assets/categoryImages/${activity.category}.jpg`}
              alt={`${activity.category} image`}
              height="100"
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography textAlign={"center"} variant="h6">
                {activity.title}
              </Typography>
              <Typography
                textAlign={"center"}
                variant="body2"
                display={"flex"}
                flexDirection={"column"}
              >
                <span>{format(activity.date, "do LLL yyyy")}</span>
                <span>{format(activity.date, "h:mm a")}</span>
              </Typography>
            </CardContent>
          </Card>
              </Link>
            ))}
        </Grid>
      </Grid>
    </Box>
  );
}
