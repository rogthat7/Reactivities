import { FieldValues } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import AccountFormWrapper from "./AccountFormWrapper";
import TextInput from "../../app/shared/components/TextInput";

export default function ForgotPasswordForm() {
    const {forgotPassword} = useAccount();
    const navigate = useNavigate();

    const onSubmit = async (data: FieldValues) => {
        try {
            await forgotPassword.mutateAsync(data.email, {
                onSuccess: () => {
                    toast.success('Email sent - Please check your inbox');
                    navigate('/login');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <AccountFormWrapper
          title="Please enter your email address"
          icon={<i className="fa fa-email"></i>} 
          onSubmit={onSubmit}
          submitButtonText="Send Email"
          reset={true}
          >
            <TextInput rules={{required: true}} name="email" label="Email Address" type="email" />
    </AccountFormWrapper>
  )
}