import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordSchema } from "../../lib/schemas/changePasswordSchema";
import AccountFormWrapper from "./AccountFormWrapper";
import TextInput from "../../app/shared/components/TextInput";
import { useAccount } from "../../lib/hooks/useAccount";
import { toast } from "react-toastify";

export default function ChangePasswordForm() {
    const {changePassword} = useAccount();
    const onSubmit = async (data: ChangePasswordSchema) => {
        try {
            await changePassword.mutateAsync(data, {
                onSuccess: () => {
                    toast.success('Password changed successfully');
                },
                onError(error) {
                    if (Array.isArray(error)) {
                        error.forEach((err) => {
                            if (err.includes("Password"))
                                toast.error(err);
                        });
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <AccountFormWrapper<ChangePasswordSchema> 
          title="Change Password"
          icon={<i className="fa fa-lock"></i>}
          resolver={zodResolver(changePasswordSchema)}
          onSubmit={onSubmit}
          submitButtonText="Update Password"
          reset={true}
          >
            <TextInput name="currentPassword" label="Current Password" type="password" />
            <TextInput name="newPassword" label="New Password" type="password" />
            <TextInput name="confirmPassword" label="Confirm Password" type="password" />
    </AccountFormWrapper>
  )
}