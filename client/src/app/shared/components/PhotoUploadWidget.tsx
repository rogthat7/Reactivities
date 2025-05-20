import { CloudUpload } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type PhotoUploadWidgetProps = {
  uploadPhoto: (file: Blob) => void;
  loading?: boolean;
};

export default function PhotoUploadWidget({
  uploadPhoto,
  loading,
}: PhotoUploadWidgetProps) {
  const [files, setFiles] = useState<object & { preview: string }[]>([]);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => { // Clean up files when component unmounts
    if (files.length > 0) {
      return () => {
        files.forEach((file) => URL.revokeObjectURL(file.preview));
      };
    }
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          if (blob) {
            uploadPhoto(blob as Blob);
          }
        },
        "image/jpeg",
        0.8
      );
    }
  }, [uploadPhoto]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Grid container spacing={5}>
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Step 1 - Add Photo
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed grey",
            borderRadius: 2,
            padding: 2,
            textAlign: "center",
            cursor: "pointer",
            height: "280px",
            backgroundColor: isDragActive ? "lightblue" : "white",
            "&:hover": {
              backgroundColor: isDragActive ? "lightblue" : "#f0f0f0",
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload fontSize="large" color="action" />
          <Typography variant="h5" color="textSecondary">
            {" "}
            Drop Image Here
          </Typography>
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </Box>
      </Grid>
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Step 2 - Resize Image
        </Typography>
        {files.length > 0 && (
          <Cropper
            ref={cropperRef}
            src={files[0]?.preview}
            style={{ height: 300, width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            guides={false}
            viewMode={1}
            dragMode="move"
            cropBoxResizable={false}
            preview={".img-preview"}
            background={false}
          />
        )}
      </Grid>
      <Grid size={4}>
        {files.length > 0 && (
          <>
            <Typography variant="overline" color="secondary">
              Step 3 - Preview and Upload
            </Typography>
            <div
              className="img-preview"
              style={{ width: 300, height: 300, overflow: "hidden" }}
              
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={onCrop}
              disabled={loading}
              sx={{ width:300, my: 1 }}
            >
                {loading ? "Uploading..." : "Upload Image"}
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
}
