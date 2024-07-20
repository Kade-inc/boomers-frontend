import { useLocation } from "react-router-dom";
import success from "../assets/success-svgrepo-com 1.svg";
import useVerifyUser from "../hooks/useVerifyUser";
import alert from "../assets/alert-cirlcle-error-svgrepo-com 1.svg";
import MessageComponent from "../components/MessageComponent";

const VerifySuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const emailParam = params.get("email");
  const verificationCodeParam = params.get("verificationCode");

  const { data, error, isLoading } = useVerifyUser(
    emailParam,
    verificationCodeParam
  );

  if (!emailParam || !verificationCodeParam) {
    return (
      <MessageComponent img={alert} message="Invalid verification link." />
    );
  }

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center h-screen">
        <span className="loading loading-ball loading-xs"></span>
        <span className="loading loading-ball loading-sm"></span>
        <span className="loading loading-ball loading-md"></span>
        <span className="loading loading-ball loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <MessageComponent img={alert} message="Please try again later" />;
  }

  if (data && data.successful) {
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

export default VerifySuccess;
