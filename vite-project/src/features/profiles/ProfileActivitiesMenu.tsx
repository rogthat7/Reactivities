import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ProfileActivities from './ProfileActivities';
import { useParams } from 'react-router';
import { useProfile } from '../../lib/hooks/useProfile';
import { Typography } from '@mui/material';
export default function ProfileActivitiesMenu() {
  const {id} = useParams<{id: string}>();
  const {userActivities, isLoadingUserActivities, setFilter  } = useProfile(id);

  const [value, setValue] = React.useState('future');
    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
      setValue(newValue);
      setFilter(newValue as string | null);
    };

    React.useEffect(() => {
      setFilter(value);
    }, [value, setFilter]);
    
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Future Events" value="future" />
              <Tab label="Past Events" value="past" />
              <Tab label="Hosting" value="hosting" />
            </TabList>
          </Box>
          <TabPanel value="future">{isLoadingUserActivities ? <Typography>Loading...</Typography> : <ProfileActivities userActivities={userActivities || []} />}</TabPanel>
          <TabPanel value="past">{isLoadingUserActivities ? <Typography>Loading...</Typography> : <ProfileActivities userActivities={userActivities || []} />}</TabPanel>
          <TabPanel value="hosting">{isLoadingUserActivities ? <Typography>Loading...</Typography> : <ProfileActivities userActivities={userActivities || []} />}</TabPanel>
        </TabContext>
      </Box>
    );
}