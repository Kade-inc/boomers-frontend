import Modal from "react-modal";
import User from "../entities/User";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useUpdateUser from "../hooks/useUpdateUser";
import useAuthStore from "../stores/useAuthStore";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;

  user: User;
};

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string(),
  userName: z.string(),
  email: z.string(),
  job: z.string(),
});

type FormData = z.infer<typeof schema>;

const EditProfileModal = ({ isOpen, onClose, user }: ModalTriggerProps) => {
  const mutation = useUpdateUser(user.user_id!);

  const { setUser } = useAuthStore();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      userName: user.username,
      email: user.email,
      job: user.job,
    },
  });

  const onSubmit = async (updatedProfile: FormData) => {
    const updateData = await mutation.mutateAsync(updatedProfile);
    setUser(updateData);
    console.log(updateData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="flex items-center justify-center"
      overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-base-100 text-base-content rounded-lg shadow-lg px-20 mx-auto h-[90vh] top-[5vh] overflow-y-auto relative mb-14 ">
          <div className="flex justify-center items-center flex-col">
            <div className="my-8">
              <button
                onClick={onClose}
                className="font-body font-bold md:font-semibold text-[11px] md:text-xl  absolute top-4 right-4  hover:text-gray-700"
              >
                X
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="font-body font-semibold text-[13px] md:text-base  ">
                  Profile Picture
                </label>
              </div>
              <div className="flex flex-row items-center">
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className="object-cover h-[90px] w-[90px] rounded-full mr-4"
                />
                <div className="flex flex-col md:flex-row items-center md:space-x-4">
                  <button className="flex justify-evenly items-center h-[26px] md:h-[33px] w-[135px] md:w-[181px]  rounded-[3px] border-[1px] bg-yellow font-body font-semibold text-[11px] md:text-sm  text-nowrap mb-2">
                    Change picture{" "}
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
                  </button>

                  <button className="h-[26px] md:h-[33px] w-[135px] md:w-[155px]  rounded-[3px] border-[1px] bg-[#BEBEBE] font-body font-semibold text-[11px] md:text-sm text-[#E02828] ">
                    Delete picture
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Username
                </label>
                <input
                  type="text"
                  {...register("userName")}
                  className="block bg-transparent w-full px-3 py-2 border-[1px] border-base-content rounded-[5px] font-body font-semibold text-sm "
                />
              </div>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <label className="font-body font-semibold text-[13px] md:text-base  ">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="w-[95%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-body font-semibold text-[13px] md:text-base  ">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Current Job
                </label>
                <input
                  type="text"
                  {...register("job")}
                  className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                />
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Current Location
                </label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                />
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Email
                </label>
                <input
                  type="text"
                  {...register("email")}
                  className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                />
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                />
              </div>
              <div className="space-y-2">
                <label className="block font-body font-semibold text-[13px] md:text-base  ">
                  About Me
                </label>
                <textarea
                  rows={3}
                  {...register("bio")}
                  className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm "
                ></textarea>
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
                    <select className="w-[60%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                      <option value="tech">Software Engineering</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-body font-medium text-[10px] md:text-sm  mb-2 mt-2">
                      Sub domain
                    </label>
                    <select className="flex justify-start w-[60%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                      <option value="frontend">Frontend</option>
                    </select>
                  </div>
                </div>
                <label className="block font-body font-medium text-[10px] md:text-sm ">
                  Topics
                </label>
                <select className="flex justify-start w-[60%] md:w-[45%] px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm ">
                  <option value="frontend">ReactJS</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4 mb-10 w-full ">
              <button
                onClick={onClose}
                className="px-4 h-[26px] md:h-[39px] font-body font-semibold text-sm  border-[1px] border-darkgrey rounded-[3px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 h-[26px] md:h-[39px] bg-yellow font-body font-semibold text-sm  rounded-[3px] text-nowrap"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
