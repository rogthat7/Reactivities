import { Box, Button, Divider, Paper, Typography } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "../../lib/hooks/useAccount";
import { Link, useSearchParams } from "react-router";
import { EmailRounded } from "@mui/icons-material";

export default function VerifyEmail() {
    const {verifyEmail, resendConfirmationEmail} = useAccount();
    const [status, setStatus] = useState('verifying');
    const [seacrhParams] = useSearchParams();
    const userId = seacrhParams.get('userId');
    const code = seacrhParams.get('code');
    const hasRun = useRef(false);
    useEffect(() => {
        if (userId && code && !hasRun.current) {
            hasRun.current = true;
            verifyEmail.mutateAsync({userId, code})
            .then(() => setStatus('verified'))
            .catch(() => setStatus('failed'));
        }
    }, [userId, code, verifyEmail]);

    const getBody = () => {
        switch (status) {
            case 'verifying':
                return <Typography>Verifying...</Typography>;
            case 'verified':
                return (<Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Typography variant="h3">Verification successful. You can now log in.</Typography>
                    <Button variant="contained" component={Link} to="/login">Go to Log In</Button>
                </Box>);
            case 'failed':
                return (<Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Typography>Verification failed. You can try resending the verify link to your email.</Typography>
                    <Button
                        onClick={() => resendConfirmationEmail.mutate({userId})}
                        disabled={resendConfirmationEmail.isPending}
                        variant="contained"
                    >Resend Verification Email</Button>
                </Box>);
    }
}
  return (
    <Paper 
    sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        backgroundColor: '#f5f5f5',
        backgroundImage:'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'
    }}
    >
        <EmailRounded sx={{ fontSize: 100, color: 'primary' }} />
        <Typography gutterBottom variant="h3" sx={{  textAlign: 'center'}}>Email Verification</Typography>
        <Divider/>
        <Typography gutterBottom variant="h3" sx={{ textAlign: 'center'}}>{getBody()}</Typography>
    </Paper>
  )
}