import { Button, Paper, Typography } from "@mui/material";
import { useAccount } from "../../lib/hooks/useAccount";
import { Check } from "@mui/icons-material";

type Props = {
    email : string
}
export default function RegisterSuccess( {email} : Props) {
    const {resendConfirmationEmail} = useAccount();
    if(!email) {
        return null
    }
  return (
    <Paper
        elevation={3}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, p:6 }}
    >
<Check sx={{ fontSize: 100, color: 'primary' }} />
<Typography gutterBottom variant="h3" sx={{ mt: 2 , textAlign: 'center'}}>
    A confirmation email has been sent to {email}. Please check your inbox.
</Typography>
<Button variant="contained" sx={{ mt: 2 }} onClick={() => resendConfirmationEmail.mutate({email})}>
    Resend Confirmation Email
</Button>
    </Paper>
  )
}