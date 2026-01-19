import { XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

interface ChatDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  isGroup?: boolean;
  groupColor?: string;
}

const ChatDetailsPanel = ({
  isOpen,
  onClose,
  userId,
  name,
  avatarUrl,
  role,
  isGroup = false,
  groupColor,
}: ChatDetailsPanelProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (userId && !isGroup) {
      onClose();
      navigate(`/profile/${userId}`);
    }
  };

  if (!isOpen) return null;

  // Desktop version (sidebar)
  const DesktopPanel = () => (
    <div className="hidden md:flex flex-col w-full h-full bg-base-100 rounded-lg shadow-md shadow-base-content/10 overflow-hidden">
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle text-error"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Avatar */}
        <div className="mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-32 h-32 rounded-full object-cover border-4 border-base-200"
            />
          ) : isGroup && groupColor ? (
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold"
              style={{ backgroundColor: groupColor }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <UserCircleIcon className="w-32 h-32 text-base-content/30" />
          )}
        </div>

        {/* Name */}
        <h3 className="text-xl font-semibold text-base-content mb-1">{name}</h3>

        {/* Role */}
        {role && <p className="text-sm text-base-content/60 mb-6">{role}</p>}

        {/* View Profile Button */}
        {!isGroup && userId && (
          <button
            onClick={handleViewProfile}
            className="btn bg-yellow text-darkgrey hover:bg-yellow/80"
          >
            View profile
          </button>
        )}
      </div>
    </div>
  );

  // Mobile version (modal)
  const MobileModal = () => (
    <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-base-100 rounded-2xl w-[85%] max-w-sm p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-ghost btn-sm btn-circle text-error"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Profile Content */}
        <div className="flex flex-col items-center pt-4">
          {/* Avatar */}
          <div className="mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-4 border-base-200"
              />
            ) : isGroup && groupColor ? (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                style={{ backgroundColor: groupColor }}
              >
                {name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <UserCircleIcon className="w-24 h-24 text-base-content/30" />
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-base-content mb-1">
            {name}
          </h3>

          {/* Role */}
          {role && <p className="text-sm text-base-content/60 mb-6">{role}</p>}

          {/* View Profile Button */}
          {!isGroup && userId && (
            <button
              onClick={handleViewProfile}
              className="btn bg-yellow text-darkgrey hover:bg-yellow/80 w-full"
            >
              View profile
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DesktopPanel />
      <MobileModal />
    </>
  );
};

export default ChatDetailsPanel;
