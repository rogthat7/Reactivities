import { Link } from "react-router";
import { Profile } from "../../app/models/Types/profile";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import { Person } from "@mui/icons-material";

type Props = {
  profile: Profile;
};
export default function ProfileCard({ profile }: Props) {
  const following = false;
  return (
    <Link to={`/profiles/${profile.id}`} style={{ textDecoration: "none" }}>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: 3,
          textDecoration: "none",
          maxWidth: 300,
        }}
      >
        <CardMedia
          component={"img"}
          src={profile?.imageUrl || "/assets/user.png"}
          alt={profile?.displayName + " image"}
          sx={{
            width: '100%',
            zIndex: 50
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            textAlign: "left",
            fullwidth: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" flexDirection={'column'} gap={1} sx={{ mb: 1}}>
            <Typography variant="h5">{profile?.displayName}</Typography>
            {profile.bio && (
              <Typography
                variant="body2"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: 250,
                 
                }}
              >
                {profile.bio}
              </Typography>
            )}
            {following && (
              <Chip
                label="Following"
                color="primary"
                size="small"
                sx={{ fontSize: "0.8rem", borderRadius: 2 }}
              />
            )}
          </Box>
        </CardContent>
        <Divider sx={{ mb: 2 }} />
        <Box
          display="flex"
          gap={2}
          sx={{
            alignItems: "center",
            justifyContent: "start",
          }}
        >
          <Person />
          <Typography>20 Followers</Typography>
        </Box>
      </Card>
    </Link>
  );
}
