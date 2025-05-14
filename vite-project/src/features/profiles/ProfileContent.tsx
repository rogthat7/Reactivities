import { Box, Paper, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";
import ProfileFollowings from "./ProfileFollowings";
import ProfileActivitiesMenu from "./ProfileActivitiesMenu";

export default function ProfileContent() {
  const [value, setValue] = useState(0);
  const handleChange = (_:SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }
  const tabContent = [
    {label: 'About', content: <ProfileAbout/>},
    {label: 'Photos', content: <ProfilePhotos/>},
    {label: 'Events', content: <ProfileActivitiesMenu/>},
    {label: 'Followers', content: <ProfileFollowings activeTab={value}/>},
    {label: 'Followings', content: <ProfileFollowings activeTab={value}/>},
  ];
  return (
    <Box 
    component={Paper}
    elevation={3}
    mt={2}
    height={500}
    sx={{display: 'flex', alignItems: 'flex-start', borderRadius: 3}}
    >
      <Tabs
      orientation="vertical"
      value={value}
      onChange={handleChange}
      sx={{ borderRight: 1, borderColor: 'divider', width: 200, height: 450 }}
      >
        {tabContent.map((content, index) => (
          <Tab key={index} label={content.label} sx={{ mr: 1 }} />
        ))}

      </Tabs>
      <Box sx={{flexGrow: 0, padding: 3, tp:0, position:'relative', width: '100%'}}>
        {tabContent[value].content}
      </Box>
    </Box>
  )
}