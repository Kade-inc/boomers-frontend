import { useLocation } from "react-router-dom";
import success from "../assets/success-svgrepo-com 1.svg";
import useVerifyUser from "../hooks/useVerifyUser";
import alert from "../assets/alert-cirlcle-error-svgrepo-com 1.svg";
import MessageComponent from "../components/MessageComponent";
import { useEffect, useState } from "react";

const SignupVerificationSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [emailParam, setEmailParam] = useState<string | null>('')
  const [verificationCodeParam, setVerificationCodeParam] = useState<string | null>('')

  const mutation = useVerifyUser();
  useEffect(() => {
    setEmailParam(params.get("email"))
    setVerificationCodeParam(params.get("verificationCode"))
    mutation.mutate({
      accountId: emailParam,
      verificationCode: verificationCodeParam
    });
  }, [emailParam, verificationCodeParam])
 
  if (!emailParam || !verificationCodeParam) {
    return (
      <MessageComponent img={alert} message="Invalid verification link." />
    );
  }

  if (mutation.isPending) {
    return (
      <div className="flex  items-center justify-center h-screen">
        <span className="loading loading-ball loading-lg"></span>
      </div>
    );
  }

  if (mutation.error) {
    return <MessageComponent img={alert} message="Error verifying user." />;
  }

  if (mutation.isSuccess) {
    return (
      <MessageComponent
        img={success}
        message="Your Boomer account is now verified!"
      />
    );
  }
  return (
    <MessageComponent img={alert} message="Verification code not found." />
  );
};

export default SignupVerificationSuccess;
