import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TeamCard from "../components/TeamCard";
import Team from "../entities/Team";
import { useForm } from "react-hook-form";

const schema = z.object({
  name: z.string(),
  username: z.string(),
  domain: z.string(),
  subdomain: z.string(),
  topic: z.string(),
  teamColor: z.string(),
});

type FormData = z.infer<typeof schema>;

function CreateTeam() {
  const [team, setTeam] = useState<Team | unknown>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setTeam(data);
    console.log(data);
  };

  return (
    <>
      <div className="h-screen w-full px-5 md:px-10 pt-10 lg:flex lg:justify-between font-body bg-base-100 text-base-content">
        <div className="xl:w-2/4 lg:w-full md:w-full flex flex-col mb-10 lg:mb-0 md:items-center">
          <div className="flex flex-col  mb-[40px] md:mb-[90px]">
            <p className="font-medium text-base-content text-[13px] md:text-[16px]">
              Ready to join the movement?
            </p>
            <p className="text-yellow font-bold text-[25px] md:text-[35px]">
              Create your Team.
            </p>
          </div>
          <div className="flex flex-col  xl:ml-6">
            <p className="font-regular text-base-content mb-3 md:text-[16px] text-[14px]">
              How others will see your team
            </p>
            <TeamCard
              team={team}
              section="create-team"
              styles={"w-full md:w-[350px] md:h-[180px] h-[120px]"}
            />
          </div>
        </div>
        <div className="min-h-80 md:w-full xl:w-2/4 w-full flex justify-center pb-8 md:pb-0">
          <div className="w-full md:w-[70%] bg-base-200 pt-10 flex justify-center md:h-[80vh] shadow-lg rounded-md pb-8 md:pb-0 overflow-scroll">
            <form className="w-[80%]" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="name"
                >
                  Team Name{" "}
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Team Name"
                  className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px]"
                  style={{ backgroundColor: "transparent" }}
                  {...register("name")}
                  id="name"
                />
                {errors.name && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.name?.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="name"
                >
                  Team Username{" "}
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Team Username"
                  className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px]"
                  style={{ backgroundColor: "transparent" }}
                  {...register("username")}
                  id="username"
                />
                {errors.username && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.username?.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="domain"
                >
                  Domain{" "}
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                </label>
                <select
                  className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-100 mt-[5px] bg-transparent"
                  {...register("domain")}
                  id="domain"
                >
                  <option value="" disabled selected>
                    Domain
                  </option>
                  <option value="domain1">Domain 1</option>
                  <option value="domain2">Domain 2</option>
                  <option value="domain3">Domain 3</option>
                  {/* Add more options as needed */}
                </select>
                {errors.domain && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.domain?.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="subdomain"
                >
                  Sub Domain
                </label>
                <select
                  className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent"
                  {...register("subdomain")}
                  id="subdomain"
                >
                  <option value="" disabled selected className="text-base-100">
                    Sub Domain
                  </option>
                  <option value="domain1">Domain 1</option>
                  <option value="domain2">Domain 2</option>
                  <option value="domain3">Domain 3</option>
                  {/* Add more options as needed */}
                </select>
                {errors.subdomain && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.subdomain?.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="topic"
                >
                  Topics
                </label>
                <select
                  className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent"
                  {...register("topic")}
                  id="topic"
                >
                  <option value="" disabled selected className="text-base-100">
                    Topics
                  </option>
                  <option value="domain1">Domain 1</option>
                  <option value="domain2">Domain 2</option>
                  <option value="domain3">Domain 3</option>
                  {/* Add more options as needed */}
                </select>
                {errors.topic && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.topic?.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-base-content mb-4 text-[18px]"
                  htmlFor="topic"
                >
                  Team Color
                </label>
                <div className="flex flex-row items-center 2xl:w-[60%]">
                  <div className="bg-transparent border-4 border-base-content w-[65px] h-[65px] rounded-full flex items-center justify-center">
                    <div className="bg-dreamy-gradient w-[45px] h-[45px] rounded-full"></div>
                  </div>

                  <div className="bg-teal-gradient w-[45px] h-[45px] rounded-full ml-3"></div>
                  <div className="bg-greyish-gradient w-[45px] h-[45px] rounded-full ml-3"></div>
                  <div className="bg-kinda-orange-gradient w-[45px] h-[45px] rounded-full ml-3"></div>
                  <div className="bg-greenish-gradient w-[45px] h-[45px] rounded-full ml-3"></div>
                </div>
              </div>

              <button
                className="btn w-full bg-yellow text-darkgrey border-none text-[17px] hover:bg-yellow rounded-sm font-medium disabled:opacity-100 xl:mb-8 3xl:mb-0"
                type="submit"
              >
                Create Team
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTeam;
