import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import Cookies from "js-cookie";
import useLoadingStore from "../stores/useLoadingStore";
import Loader from "../components/Loader/Loader";
import { BellIcon } from "@heroicons/react/24/solid";
import { IoCheckmarkDone, IoMail, IoMailOpen } from "react-icons/io5";
import Notification from "../entities/Notification";
import NotificationItem from "../components/NotificationItem";
import { Toaster } from "react-hot-toast";
import useMarkAllNotificationsRead from "../hooks/Notifications/useMarkAllNotificationsRead";
import useRealtimeNotifications from "../hooks/Notifications/useRealTimeNotifications";
import useNotificationsStore from "../stores/useNotificationsStore";
import Team from "../entities/Team";

let socket: Socket;
const serverUrl = "http://localhost:5001";
socket = io(serverUrl);

function AppLayout() {
  const { logout, checkAuth, userTeams } = useAuthStore();
  const notifications = useNotificationsStore((state) => state.notifications);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const navigate = useNavigate();

  // Mutation hook for marking notifications as read
  const { mutate, status } = useMarkAllNotificationsRead();
  const markAllReadLoading = status === "pending";

  // Local state to toggle between unread and read notifications
  const [showRead, setShowRead] = useState(false);

  // Separate effect to join team rooms once userTeams are available.
  useEffect(() => {
    if (userTeams && userTeams.length > 0) {
      userTeams.forEach((team: Team) => {
        socket.emit("joinTeam", { teamId: team._id });
      });
    }
  }, [userTeams]);

  // Listen for new notifications
  useEffect(() => {
    socket.on("pushNotification", (notification) => {
      console.log("Received: ", notification);
      useNotificationsStore.getState().addNotification(notification);
    });

    return () => {
      socket.off("pushNotification");
    };
  }, []);

  // Prepare notifications lists
  const unreadNotifications =
    notifications?.filter((notification) => !notification.isRead) || [];
  const readNotifications =
    notifications?.filter((notification) => notification.isRead) || [];
  const displayedNotifications = showRead ? readNotifications : unreadNotifications;

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
    const drawer = document.getElementById("notifications-drawer") as HTMLInputElement | null;
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
        <input id="notifications-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="notifications-drawer" className="drawer-button btn btn-primary">
            Open drawer
          </label>
        </div>
        <div className="drawer-side font-body text-darkgrey">
          <label htmlFor="notifications-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu text-base-content min-h-full w-80 lg:w-[400px] px-2 md:px-8 pb-4 pt-24 bg-base-100">
            <div className="flex justify-between items-center border-b-[1px] border-gray-400 pb-4">
              <div className="text-base-content font-bold text-[18px] flex items-center">
                <p>Notifications </p>
                {notifications && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 ml-2 flex justify-center items-center">
                    <span className="text-sm font-bold text-darkgrey">{displayedNotifications.length}</span>
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
                {displayedNotifications.map((notification: any) => (
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
