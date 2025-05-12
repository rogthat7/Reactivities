import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useInView } from 'react-intersection-observer';
import { useEffect } from "react";

export default function ActivityList() {
  const { activitiesGroup, isLoading, hasNextPage, fetchNextPage } = useActivities();
  const {ref, inView} = useInView({
    threshold: 0.5
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (!activitiesGroup) {
    return <Typography>No activities found.</Typography>;
  }
  if (isLoading) return <Typography>Loading...</Typography>;
  return (
    <Box>
      {activitiesGroup.pages.map((activities, index) => (
        <Box 
          key={index}
          ref={index === activitiesGroup.pages.length - 1 ? ref : null}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          >
          {activities?.items.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={{
                ...activity,
                hostImageUrl: activity.hostImageUrl ?? "",
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
