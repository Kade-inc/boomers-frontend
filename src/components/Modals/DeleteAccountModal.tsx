import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useDeleteAccount from "../../hooks/useDeleteAccount";
import useAuthStore from "../../stores/useAuthStore";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const deleteAccountMutation = useDeleteAccount(user.user_id || "");

  const isConfirmed = confirmText === "DELETE";

  const handleDelete = () => {
    if (!isConfirmed) return;

    deleteAccountMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
        navigate("/account-deleted");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-base-200 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-body text-base-content">
              Delete Account
            </h3>
            <p className="text-sm text-base-content/70 font-body">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-base-content font-body">
            Are you sure you want to delete your account? This will:
          </p>

          <ul className="list-disc list-inside text-base-content/80 font-body text-sm space-y-1">
            <li>Remove your profile and personal information</li>
            <li>Delete all your solutions and comments</li>
            <li>Remove you from all teams</li>
            <li>Delete your messages and chat history</li>
          </ul>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-sm text-base-content font-body">
              Your data will be permanently deleted after 30 days. Contact
              support to recover your account before then.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-base-content font-body mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="input input-bordered w-full font-body"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1 font-body"
            disabled={deleteAccountMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmed || deleteAccountMutation.isPending}
            className="btn bg-red-600 hover:bg-red-700 text-white flex-1 font-body disabled:opacity-50"
          >
            {deleteAccountMutation.isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Delete Account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
