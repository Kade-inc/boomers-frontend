import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isGroup: boolean;
  chatName: string;
  isLoading?: boolean;
}

const DeleteChatModal = ({
  isOpen,
  onClose,
  onConfirm,
  isGroup,
  chatName,
  isLoading = false,
}: DeleteChatModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-base-100 rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-error" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-base-content text-center mb-2">
          Delete Chat
        </h3>

        {/* Description */}
        <p className="text-sm text-base-content/70 text-center mb-6">
          {isGroup ? (
            <>
              This will permanently delete the group chat{" "}
              <span className="font-semibold">&quot;{chatName}&quot;</span> and
              all messages for all members. This action cannot be undone.
            </>
          ) : (
            <>
              This will remove your conversation with{" "}
              <span className="font-semibold">{chatName}</span> from your inbox.
              The other person will still be able to see it.
            </>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-ghost flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn bg-error text-white hover:bg-error/80 flex-1"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatModal;
