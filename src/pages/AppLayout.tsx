import { Outlet, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";
import { useEffect } from "react";
import Cookies from "js-cookie";
import useLoadingStore from "../stores/useLoadingStore";
import Loader from "../components/Loader/Loader";
import { BellIcon } from "@heroicons/react/24/solid";
import useGetNotifications from "../hooks/useGetNotifications";
import { formatDistanceToNow } from "date-fns";

interface FormattedNotificationMessageProps {
  message: string;
}

// Helper component to format notification messages
function FormattedNotificationMessage({
  message,
}: FormattedNotificationMessageProps) {
  const parts = message.split(/(".*?")/).map((part: string, index: number) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      // Remove the quotes and wrap in a <strong> tag
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

function AppLayout() {
  const { logout, checkAuth, isAuthenticated } = useAuthStore();
  const isLoading = useLoadingStore((state) => state.isLoading);
  const navigate = useNavigate();
  const { data: notifications, isPending: notificationsPending } =
    useGetNotifications(isAuthenticated);
  console.log("DaTA: ", notifications);
  useEffect(() => {
    checkAuth();
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token) navigate("/");
    };

    checkToken();

    const interval = setInterval(() => {
      checkToken();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [logout, checkAuth]);

  return (
    <>
      <Loader isLoading={isLoading} />
      <NavigationBar />
      <div className="pt-[60px]">
        <Outlet />
      </div>
      <div className="drawer drawer-end z-30 ">
        <input
          id="notifications-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="notifications-drawer"
            className="drawer-button btn btn-primary"
          >
            Open drawer
          </label>
        </div>
        <div className="drawer-side font-body text-darkgrey">
          <label
            htmlFor="notifications-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu text-base-content min-h-full w-80 lg:w-[400px] px-2 md:px-8 pb-4 pt-24 bg-base-100">
            <div className="flex justify-between border-b-[1px] border-gray-400 pb-4">
              <div className="text-base-content font-bold text-[18px] flex items-center">
                <p>Notifications </p>
                {notifications && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 ml-2 flex justify-center items-center">
                    <span className="text-sm font-bold text-darkgrey">
                      {notifications.length}
                    </span>
                  </div>
                )}
              </div>
              {/* <XCircleIcon
                height={26}
                width={26}
                className="cursor-pointer"
                onClick={() => {
                  const drawer = document.getElementById(
                    "notifications-drawer",
                  ) as HTMLInputElement | null;
                  if (drawer) {
                    drawer.checked = false;
                  }
                }}
              /> */}
              <button className="bg-transparent border-none text-[#00989B] font-semibold">
                Mark all as read
              </button>
            </div>
            {!notificationsPending &&
              notifications &&
              notifications.length > 0 && (
                <div className="divide-y divide-gray-400">
                  {notifications.map((notification) => (
                    <div className="py-8 px-2" key={notification._id}>
                      <div className="flex items-center justify-between">
                        <h2 className="font-semibold">
                          {notification.referenceModel === "TeamChallenge" && (
                            <span>New Challenge</span>
                          )}
                        </h2>
                        <div className="w-2 h-2 bg-[#00989B] rounded-full"></div>
                      </div>

                      {/* <p className="mt-4">New Challenge <span className="font-bold text-[#00989B]">Nuno</span> created for team: <span className="font-bold text-[#00989B]">B3yond</span></p> */}
                      <p className="mt-4">
                        <FormattedNotificationMessage
                          message={notification.message}
                        />
                      </p>

                      <div className="mt-4">
                        <button className="bg-yellow px-4 py-2 font-medium rounded-[3px] text-darkgrey">
                          View
                        </button>
                        <button className="bg-[#00989B] px-4 py-2 ml-4 font-medium text-white rounded-[3px]">
                          Mark as read
                        </button>
                      </div>
                      <p className="text-[12px] content-end font-semibold  mt-4">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            {notifications && notifications.length === 0 && (
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
