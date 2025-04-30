import { Box, Paper, Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import ProfilePhotos from "./ProfilePhotos";
import ProfileAbout from "./ProfileAbout";

export default function ProfileContent() {
  const [value, setValue] = useState(0);
  const handleChange = (_:SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }
  const tabContent = [
    {label: 'About', content: <ProfileAbout/>},
    {label: 'Photos', content: <ProfilePhotos/>},
    {label: 'Followers', content: <div>Followers</div>},
    {label: 'Following', content: <div>Following</div>},
    {label: 'Activities', content: <div>Activities</div>},
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
      <Box sx={{flexGrow: 1, padding: 3, tp:0}}>
        {tabContent[value].content}
      </Box>
    </Box>
  )
}