import Modal from "react-modal";
import maskgroup from "../assets/Mask group.svg";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EditProfileModal = ({ isOpen, onClose }: ModalTriggerProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50 bg-[#00000033]
"
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] md:max-w-4xl mx-auto h-[90vh] top-[5vh] overflow-y-auto relative mb-14 px-4 md:px-2">
        <div className="flex justify-center items-center flex-col">
          <div className="flex justify-end mb-4 w-full  mt-4">
            <button
              onClick={onClose}
              className="font-body font-bold md:font-semibold text-[11px] md:text-xl text-darkgrey"
            >
              X
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Profile Picture
              </label>
            </div>
            <div className="flex flex-row items-center">
              <img src={maskgroup} className="mr-4" />
              <div className="flex flex-col md:flex-row items-center md:space-x-4">
                <button className="flex justify-evenly items-center h-[26px] md:h-[33px] w-[135px] md:w-[181px]  rounded-[3px] border-[1px] bg-yellow font-body font-semibold text-[11px] md:text-sm text-darkgrey text-nowrap mb-2">
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
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Username
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <label className="font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-[95%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Current Job
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Current Location
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Email
              </label>
              <input
                type="text"
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Phone Number
              </label>
              <input
                type="tel"
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                About Me
              </label>
              <textarea
                rows={3}
                className="block w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-semibold text-sm text-darkgrey"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="block font-body font-semibold text-[13px] md:text-base text-darkgrey md:text-lightgrey">
                Interests
              </label>
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex flex-col">
                  <label className="font-body font-medium text-[10px] md:text-sm text-darkgrey mb-2">
                    Domain
                  </label>
                  <select className="w-[60%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm text-darkgrey">
                    <option value="tech">Software Engineering</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="font-body font-medium text-[10px] md:text-sm text-darkgrey mb-2 mt-2">
                    Sub domain
                  </label>
                  <select className="flex justify-start w-[60%] md:w-full px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm text-darkgrey">
                    <option value="frontend">Frontend</option>
                  </select>
                </div>
              </div>
              <label className="block font-body font-medium text-[10px] md:text-sm text-darkgrey">
                Topics
              </label>
              <select className="flex justify-start w-[60%] md:w-[45%] px-3 py-2 border-[1px] border-[#CCCDCF] rounded-[5px] font-body font-medium text-[10px] md:text-sm text-darkgrey">
                <option value="frontend">ReactJS</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4 mb-10 w-full md:w-[54%]">
            <button
              onClick={onClose}
              className="px-4 h-[26px] md:h-[39px] font-body font-semibold text-sm text-darkgrey border-[1px] border-darkgrey rounded-[3px]"
            >
              Cancel
            </button>
            <button className="px-4 h-[26px] md:h-[39px] bg-yellow font-body font-semibold text-sm text-darkgrey rounded-[3px] text-nowrap">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
