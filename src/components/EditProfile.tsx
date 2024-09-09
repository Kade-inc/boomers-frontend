import maskgroup from "../assets/Mask group.svg";

const EditProfile = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-36 flex flex-col w-full max-w-max mx-auto">
        <div className="flex flex-col mx-auto my-10">
          <h1 className="mb-4 text-base">Profile Picture</h1>
          <div className="flex items-center">
            <img src={maskgroup} />
            <div className="ml-10 ">
              <button className="btn bg-yellow">Change picture</button>
              <button className="btn bg-yellow ml-6">Delete picture</button>
            </div>
          </div>
        </div>
        <form>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="flex justify-between ">
            <div className="mb-[3%]">
              <label
                className="block text-base font-bold mb-[1%] font-body"
                htmlFor="username"
              >
                First Name
              </label>
              <input
                type="text"
                id="username"
                className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600 mr-10"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
            <div className="mb-[3%]">
              <label
                className="block text-base font-bold mb-[1%] font-body"
                htmlFor="username"
              >
                Last Name
              </label>
              <input
                type="text"
                id="username"
                className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Current Job
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>

          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Current Location
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent }}
            />
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Email
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              About Me
            </label>
            <textarea
              id="about"
              className="input w-full border border-gray-300 hover:border-gray-400 focus:outline-none bg-transparent rounded-md p-2"
              placeholder="Tell us about yourself"
              rows={10}
            />
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
          <div className="mb-[3%]">
            <label
              className="block text-base font-bold mb-[1%] font-body"
              htmlFor="username"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="username"
              className="input w-full border border-gray-700 hover:border-gray-700 focus:outline-none bg-transparent rounded-md font-body placeholder-gray-600"
              style={{ backgroundColor: "transparent" }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
