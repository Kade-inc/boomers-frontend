import React from "react";
import { formatDistanceToNow } from "date-fns";
import Notification from "../entities/Notification";
import useUpdateNotificationStatus from "../hooks/Notifications/useUpdateNotificationStatus";

interface NotificationItemProps {
  notification: Notification;
  onRedirect: (notification: Notification) => void;
}

interface FormattedNotificationMessageProps {
  message: string;
}

// Helper component to format notification messages
function FormattedNotificationMessage({
  message,
}: FormattedNotificationMessageProps) {
  const parts = message.split(/(".*?")/).map((part: string, index: number) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      return (
        <span key={index} className="text-[#00989B] font-bold">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
  return <>{parts}</>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRedirect,
}) => {
  // Instantiate the mutation hook with the notification's id so that the mutationKey includes it.
  const { mutate, status } = useUpdateNotificationStatus(notification._id);
  const isLoading = status === "pending";

  const handleToggle = () => {
    const status = notification.isRead ? true : false;
    mutate({ isRead: !status });
  };

  return (
    <div className="py-8 px-2" key={notification._id}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[#00989B]">
          {notification.referenceModel === "TeamChallenge" &&
            !notification.subreference && <span>New Challenge</span>}
          {notification.referenceModel === "TeamChallenge" &&
            notification.subreferenceModel === "ChallengeSolution" && (
              <span>New Solution</span>
            )}
          {notification.referenceModel === "ChallengeComment" && (
            <span>New Comment</span>
          )}
          {notification.referenceModel === "SolutionComment" && (
            <span>Solution Comment</span>
          )}
          {notification.referenceModel === "TeamChallenge" &&
            notification.subreferenceModel === "ChallengeStep" && (
              <span>Solution Step Comment</span>
            )}
          {notification.referenceModel === "TeamChallenge" &&
            notification.subreferenceModel === "SolutionRating" && (
              <span>Solution Rating</span>
            )}
        </h2>
        <div className="w-2 h-2 bg-[#00989B] rounded-full"></div>
      </div>
      <p className="mt-4">
        <FormattedNotificationMessage message={notification.message} />
      </p>
      <div className="mt-4">
        <button
          className="bg-yellow px-4 py-2 font-medium rounded-[3px] text-darkgrey"
          onClick={() => onRedirect(notification)}
        >
          View
        </button>
        {!notification.isRead && (
          <button
            className="bg-[#00989B] px-4 py-2 ml-4 font-medium text-white rounded-[3px] "
            onClick={handleToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-dots loading-xs "></span>
            ) : (
              "Mark as read"
            )}
          </button>
        )}
      </div>
      <p className="text-[12px] content-end font-semibold mt-4">
        {formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
};

export default NotificationItem;
