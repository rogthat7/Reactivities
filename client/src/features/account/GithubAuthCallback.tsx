import { useNavigate, useSearchParams } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function GithubAuthCallback() {
  const [params] = useSearchParams();
  const { fetchGithubToken } = useAccount();
  const code = params.get("code");
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!code || fetched.current) return;

      fetched.current = true;
      fetchGithubToken
        .mutateAsync(code)
        .then(() => {
          navigate('/activities');
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    
  }, [code, fetchGithubToken, navigate]);
  
  if (!code) return <Typography> Problem connecting with Github </Typography>;

  return (
  <Paper
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 400,
      p:3,
      gap:3,
      maxWidth: "md",
      mx: "auto",
      borderRadius: 3,
    }}
  >
    <Box display={"flex"} alignItems={"center"} gap={3} justifyContent={"center"}>
        <GitHub fontSize="large" />
        <Typography variant="h4"> Logging in with Github </Typography>
    </Box>
    {loading ? (
      <CircularProgress />
    ) : (
      <Typography>Problem sigining in with Github</Typography>
    )}

  </Paper>
  );
}
