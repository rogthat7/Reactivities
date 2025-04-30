import {
  Box,
  Button,
  Divider,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useProfile } from "../../lib/hooks/useProfile";
import { useParams } from "react-router";
import { useState } from "react";
import PhotoUploadWidget from "../../app/shared/components/PhotoUploadWidget";
import StarButtonOverlay from "../../app/shared/components/StarButtonOverlay";
import DeleteButtonOverlay from "../../app/shared/components/DeleteButtonOverlay";

export default function ProfilePhotos() {
  const { id } = useParams(); // Replace with actual logic to get the profile ID
  const {
    photos,
    isLoadingPhoto,
    isCurrentUser,
    uploadPhoto,
    profile,
    setMainPhoto,
    deletePhoto,
  } = useProfile(id);
  const [editMode, setEditMode] = useState(false);
  const handleUploadPhoto = (file: Blob) => {
    uploadPhoto.mutate(file, {
      onSuccess: () => {
        setEditMode(false);
      },
    });
  };
  if (isLoadingPhoto) return <Typography>Loading...</Typography>;
  return (
    <Box>
        <Box display={"flex"} justifyContent="space-between" mb={2}>
          <Typography variant="h5">Photos</Typography>
      {isCurrentUser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Add Photo"}
          </Button>
        )}
        </Box>
        <Divider sx={{ mb: 2 }} />
      {editMode ? (
        <PhotoUploadWidget
          uploadPhoto={handleUploadPhoto}
          loading={uploadPhoto.isLoading}
        />
      ) : (
        <>
          {photos?.length === 0 && <Typography>No photos added yet</Typography>}
          <ImageList sx={{ height: 450 }} cols={6} rowHeight={164}>
            {(photos ?? []).map((item) => (
              <ImageListItem key={item.id}>
                <img
                  srcSet={`${item.url.replace(
                    "upload",
                    "upload/w_164,h_164,dpr_2,g_face,c_fill,f_auto"
                  )}`}
                  src={`${item.url.replace(
                    "upload",
                    "upload/w_164,h_164,dpr_2,g_face,c_fill,f_auto"
                  )}`}
                  alt={"user-photo"}
                  loading="lazy"
                />
                {isCurrentUser && (
                  <div>
                    <Box
                      sx={{ position: "absolute", top: 0, right: 0 }}
                      onClick={() => setMainPhoto.mutate(item)}
                    >
                      <StarButtonOverlay
                        isStarred={item.url === profile?.imageUrl}
                      />
                    </Box>
                    {profile?.imageUrl !== item.url && (
                      <Box
                      sx={{ position: "absolute", top: 0, left: 0 ,alignSelf : "flex-start"}}
                      onClick={() => deletePhoto.mutate(item.id)}
                      >
                        <DeleteButtonOverlay/>
                      </Box>
                    )}
                  </div>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
    </Box>
  );
}
