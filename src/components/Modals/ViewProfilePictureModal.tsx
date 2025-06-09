import React, { useState, } from "react";
import Modal from "react-modal";
import { UserCircleIcon } from "@heroicons/react/24/solid";


interface ViewProfilePictureProps {
    src?: string | null;
    alt?: string;
    className?: string;
    iconClassName?: string;
    imgClassName?: string;
}

const ViewProfilePicture: React.FC<ViewProfilePictureProps> = ({
    src,
    alt = "profile-picture",
    className = "",
    iconClassName = "w-full h-full text-body", // Default icon class
    imgClassName = "w-full h-full object-cover",

}) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const handleCloseModal = () => setIsOpen(false);
    return (
      <>
        <div
          className={`cursor-pointer ${className}`}
          onClick={src ? handleOpenModal : undefined}
          title="View Profile Picture"
        >
          {src ? (
            <img src={src} alt={alt} className={imgClassName} />
          ) : (
            <UserCircleIcon className={iconClassName} />
          )}
        </div>
        <Modal
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          className="flex items-center justify-center fixed inset-0"
          overlayClassName="fixed inset-0 z-50 backdrop-blur-md bg-[#0000000] bg-opacity-30"
          contentLabel="View Profile Picture Modal"
          ariaHideApp={false}
        >
          <div className="relative bg-base-200 dark:bg-base-100 p-12 rounded-lg flex flex-col items-center min-w-[60vw] max-h-[50vh] object-contain overflow-hidden">
            <button
              onClick={handleCloseModal}
              className="rounded-full flex self-end mb-2 absolute top-4 right-6 font-bold text-xl text"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#D92D2D"
                className="size-6 cursor-pointer"
                onClick={handleCloseModal}
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {src ? (
              <img
                src={src}
                alt={alt}
                className="min-w-full min-h-full rounded-lg object-contain overflow-hidden"
              />
            ) : (
              <UserCircleIcon
                className={`w-full h-full text-body ${iconClassName}`}
              />
            )}
          </div>
        </Modal>
      </>
    );
};

export default ViewProfilePicture;