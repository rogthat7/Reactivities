import { useNavigate, useSearchParams } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { Typography } from "@mui/material";
import { resetPasswordSchema, ResetPasswordSchema } from "../../lib/schemas/resetPasswordSchema"; // Adjust the path as needed
import { toast } from "react-toastify";
import AccountFormWrapper from "./AccountFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../app/shared/components/TextInput";
import { LockOpen } from "@mui/icons-material";

export default function ResetPasswordForm() {
    const [params] = useSearchParams(); 
    const {resetPassword} = useAccount();
    const navigate = useNavigate();

    const email = params.get('email') || '';
    const code = params.get('resetCode') || '';
    if (!email || !code) {
        return <Typography>Invalid reset link</Typography>;
    }
    const onSubmit = async (data: ResetPasswordSchema) => {
        try {
            await resetPassword.mutateAsync({ email, resetCode: code, newPassword: data.newPassword }, {
                onSuccess: () => {
                    toast.success('Password changed successfully');
                    navigate('/login');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
return (
    <AccountFormWrapper<ResetPasswordSchema> 
          title="Reset Password"
          icon={<LockOpen  fontSize="large"/>}
          resolver={zodResolver(resetPasswordSchema)}
          onSubmit={onSubmit}
          submitButtonText="Update Password"
          reset={true}
          >
            <TextInput name="newPassword" label="New Password" type="password" />
            <TextInput name="confirmPassword" label="Confirm Password" type="password" />
    </AccountFormWrapper>
  )
}