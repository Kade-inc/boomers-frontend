import { useLocation } from "react-router-dom";
import success from "../assets/success-svgrepo-com 1.svg";
import useVerifyUser from "../hooks/useVerifyUser";
import alert from "../assets/alert-cirlcle-error-svgrepo-com 1.svg";
import MessageComponent from "../components/MessageComponent";
import { useEffect, useState } from "react";
import useSendTeamRequest from "../hooks/useSendTeamRequest";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface ErrorResponse {
  error?: string;
  message?: string;
}

const SignupVerificationSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [emailParam, setEmailParam] = useState<string | null>("");
  const [verificationCodeParam, setVerificationCodeParam] = useState<
    string | null
  >("");
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [joinTeamSuccess, setJoinTeamSuccess] = useState(false);
  const teamId = params.get("teamId");
  const {
    mutate: verifyUser,
    isPending: isVerifyingUser,
    error: verifyUserError,
  } = useVerifyUser();
  const {
    mutate: joinTeam,
    isPending: isJoiningTeam,
    error: joinTeamError,
  } = useSendTeamRequest();

  const handleJoinTeam = (teamId: string, userId: string) => {
    joinTeam(
      {
        payload: {
          team_id: teamId,
          user_id: userId,
        },
      },
      {
        onSuccess: () => {
          setJoinTeamSuccess(true);
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  useEffect(() => {
    setEmailParam(params.get("email"));
    setVerificationCodeParam(params.get("verificationCode"));

    verifyUser(
      {
        accountId: emailParam,
        verificationCode: verificationCodeParam,
      },
      {
        onSuccess: (data) => {
          setVerifySuccess(true);
          if (teamId) {
            handleJoinTeam(teamId, data.data?._id);
          }
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  }, [emailParam, verificationCodeParam]);

  if (!emailParam || !verificationCodeParam) {
    return (
      <MessageComponent img={alert} message="Invalid verification link." />
    );
  }

  if (isVerifyingUser || isJoiningTeam) {
    return (
      <div className="flex  items-center justify-center h-screen">
        <span className="loading loading-ball loading-lg"></span>
      </div>
    );
  }

  if (verifyUserError) {
    const axiosError = verifyUserError as AxiosError<ErrorResponse>;
    const errorData = axiosError.response?.data;
    return (
      <div className="flex flex-col justify-center">
        <MessageComponent
          img={alert}
          message="Error verifying user."
          submessage={String(errorData?.error || "Please try again.")}
          height={
            errorData?.error === "Error joining team" ? "h-1/2" : "h-screen"
          }
        />
        {errorData?.error === "Error joining team" && (
          <button
            className="btn bg-yellow text-base-content w-1/4 mx-auto"
            onClick={() => handleJoinTeam}
            disabled={isJoiningTeam}
          >
            {isJoiningTeam ? (
              <span>Retry</span>
            ) : (
              <span className="loading loading-dots loading-md"></span>
            )}
          </button>
        )}
      </div>
    );
  }

  if (joinTeamError && !verifyUserError) {
    return (
      <div className="flex items-center">
        <MessageComponent
          img={alert}
          message="Error adding user to the team."
        />
        <button
          className="btn bg-yellow text-base-content"
          onClick={() => handleJoinTeam}
          disabled={isJoiningTeam}
        >
          {isJoiningTeam ? (
            <span>Retry</span>
          ) : (
            <span className="loading loading-dots loading-md"></span>
          )}
        </button>
      </div>
    );
  }

  if (verifySuccess && !teamId) {
    return (
      <MessageComponent img={success} message="Your account is now verified!" />
    );
  }

  if (verifySuccess && joinTeamSuccess) {
    return (
      <MessageComponent
        img={success}
        message="Your account is now verified and your request to join the team has been sent! Kindly log in to view the status of your request"
      />
    );
  }

  if (!verifySuccess) {
    return (
      <MessageComponent img={alert} message="Verification code not found." />
    );
  }
};

export default SignupVerificationSuccess;
