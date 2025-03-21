import Modal from "react-modal";
import User from "../entities/User";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateUser from "../hooks/useUpdateUser";
import useAuthStore from "../stores/useAuthStore";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import useDeleteProfilePicture from "../hooks/useDeleteProfilePicture";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

const schema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(15, { message: "First name must be 15 characters or less" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(15, { message: "Last name must be 15 characters or less" }),
  bio: z
    .string()
    .max(200, { message: "Bio must be 200 characters or less" })
    .optional(),
  userName: z.string(),
  email: z.string(),
  job: z
    .string()
    .min(1, { message: "Job title is required" })
    .max(50, { message: "Job title must be 50 characters or less" }),
  location: z
    .string()
    .min(1, { message: "Location is required" })
    .max(10, { message: "Location must be 10 characters or less" }),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, {
    message:
      "Phone number must be between 10 and 15 digits, and can start with +",
  }),
});

type FormData = z.infer<typeof schema>;

const EditProfileModal = ({ isOpen, onClose, user }: ModalTriggerProps) => {
  const mutation = useUpdateUser(user.user_id!);
  const { setUser } = useAuthStore();
  const deletePictureMutation = useDeleteProfilePicture();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleDelete = () => {
    setShowPopup(true); //Show confirmation popup
  };

  const handleCloseConfirmModal = () => {
    setShowPopup(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      // Create a preview URL when the file is read
      reader.onloadend = () => {
        setPreviewImage(file); // Set the file itself as state
      };

      reader.readAsDataURL(file); // Convert the file to a data URL
    } else {
      setPreviewImage(null); // Reset if no file selected
    }
  };
  console.log("Preview Image: ", previewImage);
  console.log("User Profile: ", user.profile_picture);

  const handleButtonClick = () => {
    // Trigger the hidden file input click using the ref
    fileInputRef.current?.click();
  };

  const handleDeletePicture = async () => {
    await deletePictureMutation.mutateAsync({
      userId: user.user_id || "",
    });
    user.profile_picture = null;
    setUser(user);
    console.log(user);

    setShowPopup(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      userName: user.username,
      email: user.email,
      job: user.job || "",
      location: user.location || "",
      phoneNumber: user.phoneNumber,
    },
  });

  const onSubmit = async (updatedProfile: FormData) => {
    const newForm = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      newForm.append(key, value as string);
    });

    if (imageFile) {
      newForm.append("image", imageFile);
    }

    const updateData = await mutation.mutateAsync(newForm);
    setUser(updateData);
    onClose();
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleClose = () => {
    onClose();
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleCancelImage = () => {
    setIsCancelling(true); //Start loading
    setTimeout(() => {
      setImageFile(null);
      setPreviewImage(null);
      setIsCancelling(false); //Stop loading after action is done
    }, 500); //Simulate a short delay
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex items-center justify-center fixed inset-0"
      overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-base-100 text-base-content rounded-lg shadow-lg px-10 mx-auto w-[95%] h-[90vh] top-[5vh] overflow-y-auto relative mb-14 ">
          <div className="flex justify-center items-center flex-col">
            <div className="flex justify-end w-full mt-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#D92D2D"
                className="size-8 cursor-pointer"
                onClick={handleClose}
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-body font-semibold text-[13px] md:text-base  ">
                  Profile Picture
                </label>
              </div>
              <div className="flex flex-row items-center">
                <div className="rounded-full overflow-hidden mr-3">
                  {previewImage || user.profile_picture ? (
                    <img
                      src={
                        (previewImage && URL.createObjectURL(previewImage)) ||
                        user.profile_picture
                      }
                      alt="Profile picture"
                      className="rounded-full w-[80px] h-[80px] object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="rounded-full w-[90px] h-[90px] object-cover text-darkgrey" />
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-4">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="rounded-[3px] w-full md:w-[150px] bg-yellow font-body font-semibold text-[11px] md:text-sm mb-2 border-none text-darkgrey hover:bg-yellow p-3"
                  >
                    {imageFile ? (
                      imageFile.name
                    ) : (
                      <div className="flex items-center justify-center">
                        <p>Change</p>

                        <p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                            />
                          </svg>
                        </p>
                      </div>
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the input
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {user.profile_picture && !previewImage && (
                    <button
                      type="button"
                      className="w-full md:w-[150px] rounded-[3px] border-[1px] border-red-500 font-body font-semibold text-[11px] md:text-sm text-nowrap mb-2  text-[#E02828] hover:bg-white p-3"
                      onClick={handleDelete}
                      disabled={deletePictureMutation.isPending}
                    >
                      Delete picture
                    </button>
                  )}
                  {previewImage && (
                    <button
                      type="button"
                      className="w-full md:w-[150px] p-2 rounded-[3px] border-[1px] border-red-500 font-body font-semibold text-[11px] md:text-sm  mb-2  text-white bg-[#EB4335] hover:bg-[#EB4335]"
                      onClick={handleCancelImage}
                    >
                      {isCancelling ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        "Cancel"
                      )}
                    </button>
                  )}
                </div>
              </div>
              {showPopup && (
                <Modal
                  isOpen={showPopup}
                  onRequestClose={onClose}
                  className="flex items-center justify-center"
                  overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033]"
                >
                  <div className="flex items-center justify-center pt-32">
                    <div className="flex flex-col bg-white w-full max-w-[90%] md:w-[600px] rounded-md ">
                      <div className="flex justify-end w-full mr-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#D92D2D"
                          className="size-8 cursor-pointer m-4"
                          onClick={handleCloseConfirmModal}
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className=" text-[#5C636E] font-body font-semibold text-base">
                          Confirmation
                        </p>
                        <div className="rounded-full overflow-hidden mt-6">
                          {previewImage || user.profile_picture ? (
                            <img
                              src={
                                (previewImage &&
                                  URL.createObjectURL(previewImage)) ||
                                user.profile_picture
                              }
                              alt="Profile picture"
                              className="rounded-full w-[90px] h-[90px] object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="rounded-full w-[90px] h-[90px] object-cover text-darkgrey" />
                          )}
                        </div>
                      </div>

                      <p className="py-4 font-body font-semibold text-base text-[#393E46] text-center px-4">
                        Are you sure you want delete your profile picture?
                      </p>
                      <div className="flex flex-col md:flex-row">
                        <div
                          onClick={handleCloseConfirmModal}
                          className="flex items-center justify-center py-3 w-full md:w-1/2 font-body font-semibold text-[13px] md:text-sm text-nowrap text-white bg-[#34A853] cursor-pointer"
                        >
                          CANCEL
                        </div>
                        <div
                          className="flex items-center justify-center py-3 bg-[#EB4335] font-body font-semibold text-[13px] md:text-sm  text-nowrap text-white w-full md:w-1/2 cursor-pointer"
                          onClick={handleDeletePicture}
                        >
                          {deletePictureMutation.isPending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "DELETE"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}

              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Username
                </label>
                <input
                  type="text"
                  {...register("userName")}
                  disabled
                  className="bg-[B9B9B9] text-[9CA1A8] block w-full px-3 py-2 border-[1px] border-base-content rounded-[5px] font-body font-semibold text-sm cursor-not-allowed "
                />
              </div>
              <div className="flex justify-between gap-x-6">
                <div className="flex flex-col">
                  <label className="font-body font-semibold text-[13px] md:text-base  ">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="bg-transparent border-base-content w-[95%] md:w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                  />
                  {errors.firstName && (
                    <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="font-body font-semibold text-[13px] md:text-base  ">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="bg-transparent border-base-content w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                  />
                  {errors.lastName && (
                    <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Current Job
                </label>
                <input
                  type="text"
                  {...register("job")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                />
                {errors.job && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.job.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Current Location
                </label>
                <input
                  type="text"
                  {...register("location")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                />
                {errors.location && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.location.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute flex items-center inset-y-0 left-0 pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    {...register("email")}
                    disabled
                    className="bg-[B9B9B9] text-[9CA1A8] border-base-content block w-full pl-10 px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                />
                {errors.phoneNumber && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  About Me
                </label>
                <textarea
                  rows={3}
                  {...register("bio")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                ></textarea>
                {errors.bio && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.bio.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Interests
                </label>
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex flex-col">
                    <label className="font-body font-medium text-[10px] md:text-sm  mb-2">
                      Domain
                    </label>
                    <select className="bg-transparent border-base-content w-[60%] md:w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                      <option value="tech">Software Engineering</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-body font-medium text-[10px] md:text-sm  mb-2 mt-2">
                      Sub domain
                    </label>
                    <select className="bg-transparent border-base-content flex justify-start w-[60%] md:w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                      <option value="frontend">Frontend</option>
                    </select>
                  </div>
                </div>
                <label className="block font-body font-medium text-[10px] md:text-sm ">
                  Topics
                </label>
                <select className="bg-transparent border-base-content flex justify-start w-[60%] md:w-[45%] px-3 py-2 border-[1px] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                  <option value="frontend">ReactJS</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4 mb-10 w-full ">
              <button
                onClick={handleClose}
                className="px-4 md:px-6 btn max-w-full rounded-md font-body font-semibold text-[11px] md:text-sm text-nowrap text-white bg-darkgrey border-[1px] border-darkgrey hover:bg-darkgrey"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 md:px-6 btn rounded-md bg-yellow  font-body font-semibold text-[11px] md:text-sm  text-nowrap text-darkgrey hover:bg-yellow"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
