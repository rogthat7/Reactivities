import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Profile } from '../../models/Types/profile';
import { useState } from 'react';
import {Avatar } from '@mui/material';
import { Link } from 'react-router';
import ProfileCard from '../../../features/profiles/ProfileCard';
type Props = {
    profile : Profile
}

export default function AvatarPopover({profile}: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Avatar 
              src={profile.imageUrl} 
              alt={profile.displayName +' image'} 
              component={Link}
              to={`/profiles/${profile.id}`}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose} 
              sx={{
                border: profile.isFollowing ? '2px solid orange' : 'none',
                borderColor: 'secondary.main',
              }}
        />
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        sx={{ cursor: 'pointer', marginRight: 1,pointerEvents: 'none'  }}
      >
        <ProfileCard profile={profile}/>
      </Popover>
    </>
  );
}
