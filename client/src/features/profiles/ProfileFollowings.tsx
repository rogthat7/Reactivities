import { Box, Divider, Typography } from "@mui/material";
import { useProfile } from "../../lib/hooks/useProfile";
import { useParams } from "react-router";
import ProfileCard from "./ProfileCard";

type Props = {
    activeTab: number
}
export default function ProfileFollowings( {activeTab}: Props) {
    const {id} = useParams<{id: string}>();
    const predicate = activeTab === 3 ? 'followers' : 'followings';
    const {profile, followings, loadingFollowings} = useProfile(id, predicate);
    return (
    <Box>
        <Box display={"flex"}>
            <Typography variant="h5" fontWeight={600} color="primary.main">
                {activeTab === 3 ? `People following ${profile?.displayName}` 
                :  `People ${profile?.displayName} is following` }
            </Typography>
        </Box>
        <Divider sx={{my:2}}/>
        {loadingFollowings ? <Typography>
            Loading...
        </Typography>:(
            <Box display={"flex"} marginTop={3}>
                {(followings ?? []).length > 0 ?  (followings ?? []).map(profile => (
                    <ProfileCard key={profile.id} profile={profile}/>
                )): <Typography>
                    No {predicate} yet! 
                    </Typography>}
            </Box>
        )}
    </Box>
  )
}