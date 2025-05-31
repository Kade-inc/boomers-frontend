import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useLoadingStore from "../stores/useLoadingStore";
import Loader from "../components/Loader/Loader";
import { BellIcon } from "@heroicons/react/24/solid";
import useGetNotifications from "../hooks/useGetNotifications";
import { IoCheckmarkDone, IoMail, IoMailOpen } from "react-icons/io5";
import Notification from "../entities/Notification";
import NotificationItem from "../components/NotificationItem";
import { Toaster } from "react-hot-toast";
import useMarkAllNotificationsRead from "../hooks/Notifications/useMarkAllNotificationsRead";
import useNotificationsStore from "../stores/useNotificationsStore";
import { io, Socket } from "socket.io-client";
import Team from "../entities/Team";

const serverUrl = "http://localhost:5001";
const socket: Socket = io(serverUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function AppLayout() {
  const { logout, checkAuth, userTeams, user, userChallenges } = useAuthStore();
  const notifications = useNotificationsStore((state) => state.notifications);
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications,
  );
  const addNotification = useNotificationsStore(
    (state) => state.addNotification,
  );
  const isLoading = useLoadingStore((state) => state.isLoading);
  const navigate = useNavigate();

  // Socket connection status
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Socket connection handlers
  useEffect(() => {
    function onConnect() {
      console.log("Socket connected successfully");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("Socket disconnected");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Fetch initial notifications.
  // Here we assume that the user is authenticated if `user` exists.
  const { data: fetchedNotifications, isSuccess } = useGetNotifications(!!user);

  // Mutation hook for marking notifications as read.
  const { mutate, status } = useMarkAllNotificationsRead();
  const markAllReadLoading = status === "pending";

  // Local state to toggle between unread and read notifications.
  const [showRead, setShowRead] = useState(false);

  // When initial notifications are fetched, set them in the notifications store.
  useEffect(() => {
    if (isSuccess && fetchedNotifications) {
      setNotifications(fetchedNotifications);
    }
  }, [fetchedNotifications, isSuccess, setNotifications]);

  // Join personal room on mount (when user data is available)
  useEffect(() => {
    if (user && user.user_id && isConnected) {
      socket.emit("joinUser", { userId: user.user_id });
      console.log("Joined personal room for user:", user.user_id);

      // Verify room joining
      socket.on("connect", () => {
        socket.emit("joinUser", { userId: user.user_id });
        console.log(
          "Re-joined personal room after reconnection:",
          user.user_id,
        );
      });
    }
  }, [user, isConnected]);

  // Cleanup socket listeners
  useEffect(() => {
    return () => {
      if (user && user.user_id) {
        socket.off("connect");
      }
    };
  }, [user]);

  // Join all team rooms once userTeams are available
  useEffect(() => {
    if (userTeams && userTeams.length > 0 && isConnected) {
      userTeams.forEach((team: Team) => {
        socket.emit("joinTeam", { teamId: team._id });
        console.log("Joined team room:", team._id);
      });
    }
  }, [userTeams, isConnected]);

  // Join challenge rooms for all user challenges
  useEffect(() => {
    if (userChallenges && userChallenges.length > 0 && isConnected) {
      userChallenges.forEach((challenge) => {
        socket.emit("joinChallenge", { challengeId: challenge._id });
        console.log("Joined challenge room:", challenge._id);
      });
    }
  }, [userChallenges, isConnected]);

  // Listen for new notifications
  useEffect(() => {
    if (!isConnected) return;

    function onPushNotification(notification: Notification) {
      console.log("Received pushNotification:", notification);
      addNotification(notification);
    }

    socket.on("pushNotification", onPushNotification);

    return () => {
      socket.off("pushNotification", onPushNotification);
    };
  }, [isConnected, addNotification]);

  // Prepare notifications lists.
  const unreadNotifications =
    notifications?.filter((notification) => !notification.isRead) || [];
  const readNotifications =
    notifications?.filter((notification) => notification.isRead) || [];
  const displayedNotifications = showRead
    ? readNotifications
    : unreadNotifications;

  const handleMarkAllAsRead = () => {
    mutate({});
  };

  useEffect(() => {
    checkAuth();
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token) navigate("/");
    };

    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 5000);

    return () => clearInterval(interval);
  }, [logout, checkAuth]);

  const handleNotificationRedirect = (notification: Notification) => {
    if (notification.referenceModel === "TeamChallenge") {
      navigate(`/challenge/${notification.reference}`);
    }

    const drawer = document.getElementById(
      "notifications-drawer",
    ) as HTMLInputElement | null;
    if (drawer) {
      drawer.checked = !drawer.checked;
    }
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <NavigationBar />
      <div className="pt-[60px]">
        <Outlet />
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: "#D92D2D",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#D92D2D",
            },
          },
        }}
      />
      <div className="drawer drawer-end z-30 ">
        <input
          id="notifications-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-side font-body text-darkgrey">
          <label
            htmlFor="notifications-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu text-base-content min-h-full w-80 lg:w-[400px] px-2 md:px-8 pb-4 pt-24 bg-base-100">
            <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-4">
              <div className="text-base-content font-bold text-[18px] flex items-center">
                <p>Notifications </p>
                {notifications && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 ml-2 flex justify-center items-center">
                    <span className="text-sm font-bold text-darkgrey">
                      {displayedNotifications.length}
                    </span>
                  </div>
                )}
              </div>
              {showRead ? (
                <div
                  className="cursor-pointer tooltip tooltip-left tooltip-warning"
                  data-tip="Show Unread"
                  onClick={() => setShowRead(false)}
                >
                  <IoMail size={24} />
                </div>
              ) : (
                <div
                  className="cursor-pointer tooltip tooltip-left tooltip-warning"
                  data-tip="Show Read"
                  onClick={() => setShowRead(true)}
                >
                  <IoMailOpen size={24} />
                </div>
              )}

              {!markAllReadLoading && unreadNotifications.length > 0 && (
                <div
                  className="tooltip tooltip-left tooltip-success cursor-pointer"
                  data-tip="Mark all as read"
                  onClick={handleMarkAllAsRead}
                >
                  <IoCheckmarkDone size={24} className="text-[#00989B]" />
                </div>
              )}
              {markAllReadLoading && (
                <span className="loading loading-dots loading-xs"></span>
              )}
            </div>
            {displayedNotifications.length > 0 && (
              <div className="divide-y divide-gray-400">
                {displayedNotifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onRedirect={handleNotificationRedirect}
                  />
                ))}
              </div>
            )}
            {notifications && displayedNotifications.length === 0 && (
              <div className="flex items-center justify-center flex-col h-[70vh]">
                <BellIcon height={60} width={60} />
                <p className="font-semibold">Nothing to see here</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default AppLayout;
