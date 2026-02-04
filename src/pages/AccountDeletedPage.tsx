import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const AccountDeletedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-base-200 rounded-lg shadow-custom p-8">
          <div className="flex justify-center mb-6">
            <CheckCircleIcon className="w-20 h-20 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold font-body text-base-content mb-4">
            Account Deleted
          </h1>

          <p className="text-base-content/70 font-body mb-6">
            Your account has been successfully deleted. All your data is being
            removed in the background. You will receive a confirmation email
            shortly.
          </p>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-base-content font-body">
              <strong>Note:</strong> Your data will be permanently deleted after
              30 days. If you wish to recover your account, please contact our
              support team before then.
            </p>
          </div>

          <p className="text-base-content/60 font-body text-sm mb-8">
            Thank you for being part of our community.
          </p>

          <Link
            to="/"
            className="btn bg-yellow hover:bg-yellow/90 text-darkgrey font-body font-semibold px-8"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletedPage;
