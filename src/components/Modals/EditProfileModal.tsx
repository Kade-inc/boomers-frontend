import Modal from "react-modal";
import User from "../../entities/User";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateUser from "../../hooks/useUpdateUser";
import useAuthStore from "../../stores/useAuthStore";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import useDeleteProfilePicture from "../../hooks/useDeleteProfilePicture";
import useDomains from "../../hooks/useDomains";
import useSubDomains from "../../hooks/useSubDomains";
import Domain from "../../entities/Domain";
import MultiSelect from "../../components/MultiSelect";
import DomainTopic from "../../entities/DomainTopic";
import useDomainTopics from "../../hooks/useDomainTopics";
import SubDomain from "../../entities/SubDomain";
import { Country, City } from "country-state-city";
import ViewProfilePicture from "./ViewProfilePictureModal";
import { canvasPreview } from "../../utils/canvasPreview";

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
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, {
    message:
      "Phone number must be between 10 and 15 digits, and can start with +",
  }),
  interests: z
    .object({
      domain: z.array(z.string()),
      subdomain: z.array(z.string()),
      domainTopics: z.array(
        z.object({
          _id: z.string(),
          name: z.string(),
        }),
      ),
    })
    .optional(),
  website: z
    .string()
    .min(1, { message: "Website is required" })
    .max(255, { message: "Website must be 255 characters or less" })
    .url({ message: "Please enter a valid URL (e.g., https://example.com)" }),
});

type FormData = z.infer<typeof schema>;

const EditProfileModal = ({ isOpen, onClose, user }: ModalTriggerProps) => {
  const mutation = useUpdateUser(user.user_id!);
  const { setUser } = useAuthStore();
  const deletePictureMutation = useDeleteProfilePicture();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    user.country || "",
  );
  const [selectedCity, setSelectedCity] = useState<string>(user.city || "");
  const [showCropModal, setShowCropModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    data: domains,
    isPending: domainsPending,
    error: domainsError,
  } = useDomains();
  const {
    data: subDomains,
    isPending: isSubDomainsPending,
    error: subDomainsError,
  } = useSubDomains(selectedDomainId);
  const {
    data: fetchedDomainTopics,
    isPending: domainTopicsPending,
    error: fetchedDomainTopicsError,
  } = useDomainTopics();

  const handleDelete = () => {
    setShowPopup(true); //Show confirmation popup
  };

  const handleCloseConfirmModal = () => {
    setShowPopup(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG or WEBP files are allowed.");
      event.target.value = ""; // reset the input
      return;
    }

    setCrop(undefined); // Reset crop state
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      setShowCropModal(true); // Show crop modal
    });
    reader.readAsDataURL(file);
  };

  // initializes crop when image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100, // Start with a 100% width crop
        },
        1, // Aspect ratio 1:1 for square crop
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(crop);
  };

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImgSrc(""); // Reset image source
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleCropSave = () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    // Create canvas preview of cropped image
    canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);

    // Convert canvas to webp
    previewCanvasRef.current.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }
        // Create a new webp file
        const croppedFile = new File([blob], "profile-picture.webp", {
          type: "image/webp",
          lastModified: Date.now(),
        });

        // Update state with cropped image
        setImageFile(croppedFile);
        setPreviewImage(URL.createObjectURL(blob));
        setShowCropModal(false);
      },
      "image/webp",
      0.9, // 90% quality
    );
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input click
    fileInputRef.current?.click();
  };

  const handleDeletePicture = async () => {
    await deletePictureMutation.mutateAsync({
      userId: user.user_id || "",
    });
    user.profile_picture = null;
    setUser(user);

    setShowPopup(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      country: user.country || "",
      city: user.city || "",
      phoneNumber: user.phoneNumber,
      interests: {
        domain: user.interests?.domain ?? [],
        subdomain: user.interests?.subdomain ?? [],
        domainTopics: user.interests?.domainTopics ?? [],
      },
      website: user?.website || "",
    },
  });

  const selectedDomain = watch("interests.domain");

  useEffect(() => {
    const foundDomain = domains?.find(
      (domain: Domain) => domain.name === String(selectedDomain),
    );

    setSelectedDomainId(foundDomain?._id);
  }, [selectedDomain, domains]);

  // Add effect to update subdomain when subdomains are loaded
  useEffect(() => {
    if (subDomains && user.interests?.subdomain?.[0]) {
      setValue("interests.subdomain", [user.interests.subdomain[0]], {
        shouldValidate: true,
      });
    }
  }, [subDomains, setValue, user.interests?.subdomain]);

  // Get all countries
  const countries = Country.getAllCountries();

  // Get cities for selected country
  const cities = selectedCountry
    ? City.getCitiesOfCountry(
        countries.find((c) => c.name === selectedCountry)?.isoCode || "",
      ) || []
    : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setSelectedCity(""); // Reset city when country changes
    setValue("city", ""); // Reset form value
    setValue("country", countryName);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setValue("city", cityName);
  };

  const onSubmit = async (updatedProfile: FormData) => {
    const newForm = new FormData();
    Object.entries(updatedProfile).forEach(([key, value]) => {
      if (key === "interests") return;
      newForm.append(key, value as string);
    });

    if (imageFile) {
      newForm.append("image", imageFile);
    }
    // serialise interests as JSON
    if (updatedProfile.interests) {
      const payload = {
        domain: updatedProfile.interests.domain,
        subdomain: updatedProfile.interests.subdomain,
        domainTopics: updatedProfile.interests.domainTopics.map((t) => t.name),
      };
      newForm.append("interests", JSON.stringify(payload));
    }

    await mutation.mutateAsync(newForm);

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

  const [selectedTopics, setSelectedTopics] = useState<DomainTopic[]>([]);

  useEffect(() => {
    if (!fetchedDomainTopics) return;

    // Initialize selected topics from user's interests
    const initialTopics = fetchedDomainTopics.filter((dt) =>
      user.interests?.domainTopics?.some((userTopic) =>
        typeof userTopic === "string"
          ? userTopic === dt.name
          : userTopic.name === dt.name,
      ),
    );

    setSelectedTopics(initialTopics);
    setValue("interests.domainTopics", initialTopics, { shouldValidate: true });
  }, [fetchedDomainTopics, user.interests?.domainTopics, setValue]);

  useEffect(() => {
    // Update form value when selected topics change
    setValue("interests.domainTopics", selectedTopics, {
      shouldValidate: true,
    });
  }, [selectedTopics, setValue]);

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
                <div className="rounded-full overflow-hidden w-2/6">
                  {previewImage || user.profile_picture ? (
                    <ViewProfilePicture //click to open
                      src={previewImage || user.profile_picture || undefined}
                      alt="Profile picture"
                      imgClassName="rounded-full w-[80px] h-[80px] object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="rounded-full w-[90px] h-[90px] object-cover text-base-content" />
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 w-4/6">
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="rounded-[3px] w-full bg-yellow font-body font-semibold text-[11px] md:text-sm mb-2 border-none text-darkgrey hover:bg-yellow p-3 truncate"
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
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                  />
                  {user.profile_picture && !previewImage && (
                    <button
                      type="button"
                      className="w-full rounded-[3px] bg-error border-none font-body font-semibold text-[11px] md:text-sm text-nowrap mb-2  text-white px-3 py-2.5"
                      onClick={handleDelete}
                      disabled={deletePictureMutation.isPending}
                    >
                      Delete picture
                    </button>
                  )}
                  {previewImage && (
                    <button
                      type="button"
                      className="w-full p-3 rounded-[3px] font-body font-semibold text-[11px] md:text-sm  mb-2  text-white bg-[#EB4335] hover:bg-[#EB4335]"
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

              {showCropModal && (
                <Modal
                  isOpen={showCropModal}
                  onRequestClose={handleCropCancel}
                  className="flex items-center justify-center fixed inset-0"
                  overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
                >
                  <div className="bg-base-100 p-6 rounded-lg max-w-[90%] max-h-[90vh] overflow-auto">
                    <div className="flex justify-end mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#D92D2D"
                        className="size-8 cursor-pointer"
                        onClick={handleCropCancel}
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col items-center">
                      {imgSrc && (
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={handleCropComplete}
                          circularCrop={true}
                          className="max-w-full max-h-[60vh]"
                        >
                          <img
                            src={imgSrc}
                            ref={imgRef}
                            onLoad={handleImageLoad}
                            alt="Crop preview"
                            style={{ maxWidth: "100%", maxHeight: "60vh" }}
                          />
                        </ReactCrop>
                      )}
                      <div className="mt-4">
                        <canvas
                          ref={previewCanvasRef}
                          style={{
                            display: "none",
                            border: "1px solid black",
                            objectFit: "contain",
                            width: "100%",
                            height: "100px",
                          }}
                        />
                      </div>
                      <div className="flex gap-4 mt-4">
                        <button
                          type="button"
                          onClick={handleCropCancel}
                          className="px-4 py-2 bg-error text-white rounded font-body font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleCropSave}
                          className="px-4 py-2 bg-yellow text-darkgrey rounded font-body font-medium"
                        >
                          Save Crop
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}
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
                                previewImage ||
                                user.profile_picture ||
                                undefined
                              }
                              alt="Profile picture"
                              className="rounded-full w-[90px] h-[90px] object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="rounded-full w-[90px] h-[90px] object-cover text-base-content" />
                          )}
                        </div>
                      </div>

                      <p className="py-4 font-body font-semibold text-base text-[#393E46] text-center px-4">
                        Are you sure you want delete your profile picture?
                      </p>
                      <div className="flex flex-col md:flex-row">
                        <div
                          onClick={handleCloseConfirmModal}
                          className="flex items-center justify-center py-3 w-full md:w-1/2 font-body font-semibold text-[13px] md:text-sm text-nowrap text-white bg-[#14AC91] cursor-pointer"
                        >
                          CANCEL
                        </div>
                        <div
                          className="flex items-center justify-center py-3 bg-[#C83A3A] font-body font-semibold text-[13px] md:text-sm  text-nowrap text-white w-full md:w-1/2 cursor-pointer"
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
                  Website
                </label>
                <input
                  type="text"
                  {...register("website")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm "
                />
                {errors.website && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base">
                  Current Country
                </label>
                <select
                  {...register("country")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm"
                  onChange={handleCountryChange}
                  value={selectedCountry}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base">
                  Current City
                </label>
                <select
                  {...register("city")}
                  className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm"
                  disabled={!selectedCountry}
                  onChange={handleCityChange}
                  value={selectedCity}
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.city.message}
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
                <label className="block font-body font-semibold">
                  Interests
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  {domainsError ? (
                    <p className="font-body font-semibold text-error">
                      Error fetching domains
                    </p>
                  ) : (
                    <div className="flex-1">
                      <label className="block font-body font-semibold text-[13px] md:text-base">
                        Domain
                      </label>
                      <select
                        {...register("interests.domain", {
                          setValueAs: (v) => (Array.isArray(v) ? v : [v]),
                        })}
                        disabled={domainsPending}
                        className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm"
                      >
                        <option value="" disabled>
                          {domainsPending
                            ? "Loading domains…"
                            : "Select a domain"}
                        </option>

                        {domains?.map((d: Domain) => (
                          <option key={d._id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      {errors.interests?.domain && (
                        <p className="text-error">
                          {errors.interests?.domain.message}
                        </p>
                      )}
                    </div>
                  )}
                  {subDomainsError ? (
                    <p className="font-body font-semibold text-error">
                      Error fetching sub-domains
                    </p>
                  ) : (
                    <div className="flex-1">
                      <label className="block font-body font-semibold text-[13px] md:text-base">
                        Sub‑domain
                      </label>

                      <select
                        defaultValue={user.interests?.subdomain?.[0] || ""}
                        {...register("interests.subdomain", {
                          setValueAs: (v) => (Array.isArray(v) ? v : [v]),
                        })}
                        disabled={
                          !watch("interests.domain").length ||
                          isSubDomainsPending
                        }
                        className="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm"
                      >
                        <option value="" disabled>
                          {!watch("interests.domain")[0]
                            ? "Pick domain first"
                            : isSubDomainsPending
                              ? "Loading…"
                              : "Select sub‑domain"}
                        </option>
                        {subDomains?.map((sd: SubDomain) => (
                          <option key={sd._id} value={sd.name}>
                            {sd.name}
                          </option>
                        ))}
                      </select>

                      {errors.interests?.subdomain && (
                        <p className="text-error">
                          {errors.interests?.subdomain.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {fetchedDomainTopicsError ? (
                  <p className="font-body font-semibold text-error">
                    Error fetching sub-domains
                  </p>
                ) : (
                  <>
                    {selectedDomain.length > 0 && (
                      <div>
                        <label className="block font-body font-semibold text-[13px] md:text-base">
                          Topics
                        </label>
                        {domainTopicsPending ? (
                          <p className="font-body text-[13px]">
                            Loading Domain Topics...
                          </p>
                        ) : (
                          <MultiSelect
                            options={fetchedDomainTopics || []}
                            selected={selectedTopics}
                            onChange={setSelectedTopics}
                            parentContainerWidth="w-full"
                            inputStyles="bg-transparent border-base-content block w-full px-3 py-2 border-[1px] rounded-[5px] font-body font-semibold text-sm cursor-pointer flex justify-between items-center"
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4 mb-10 w-full ">
              <button
                onClick={handleClose}
                className="px-4 md:px-6 btn max-w-full rounded-md font-body font-semibold text-[11px] md:text-sm text-nowrap text-white bg-error hover:bg-error border-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 md:px-6 btn rounded-md bg-yellow  font-body font-semibold text-[11px] md:text-sm  text-nowrap text-darkgrey hover:bg-yellow border-none"
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
