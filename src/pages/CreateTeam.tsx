import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TeamCard from "../components/TeamCard";
import Team from "../entities/Team";
import { useForm, useWatch } from "react-hook-form";
import useDomains from "../hooks/useDomains";
import Domain from "../entities/Domain";
import useSubDomains from "../hooks/useSubDomains";
import SubDomain from "../entities/SubDomain";
import useDomainTopics from "../hooks/useDomainTopics";
import DomainTopic from "../entities/DomainTopic";
import useCreateTeam from "../hooks/useCreateTeam";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface FormInputs {
  name: string;
  username: string;
  domain: string;
  subDomain: string;
  topic: string[];
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should have a minimum of 3 characters")
    .max(30, "Name can be a max of 30 characters"),
  username: z
    .string()
    .trim()
    .min(3, "Nick name should have a minimum of 3 characters")
    .max(30, "Nick name can be a max of 30 characters"),
  domain: z.string().nonempty("Please select a domain"),
  subDomain: z.string().nonempty("Please select a Sub Domain"),
  topic: z
    .array(z.string())
    .min(1, "Please select at least one topic")
    .default([]),
});

function CreateTeam() {
  // TO FIX: Remove this later since it's not really useful
  // It's currently used when setting team color and in handleTopicChange
  const [team, setTeam] = useState<Team>({
    name: "",
    teamUsername: "",
    domain: "",
    subDomain: "",
    subDomainTopics: [],
    teamColor: "linear-gradient(0deg, #00989B, #005E78)",
  });

  const { data: domains, isPending: domainsPending } = useDomains();
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const { data: subdomains, isPending: subdomainsPending } =
    useSubDomains(selectedDomainId);
  const [domainOptions, setDomainOptions] = useState<Domain[]>([]);
  const [subdomainOptions, setSubdomainOptions] = useState<SubDomain[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: fetchedDomainTopics, isPending: domainTopicsPending } =
    useDomainTopics();
  const [subDomainTopics, setDomainTopics] = useState<DomainTopic[]>([]);
  const [teamColors] = useState({
    "teal-gradient": "linear-gradient(0deg, #00989B, #005E78)",
    "kinda-orange-gradient": "linear-gradient(0deg, #D9436D, #F26A4B)",
    "greyish-gradient": "linear-gradient(0deg, #495D6D, #313752)",
    "greenish-gradient": "linear-gradient(0deg, #589FD6, #43CCBA)",
    "dreamy-gradient": "linear-gradient(180deg, #7b4dbb, #d97b98, #f3aa75)",
  });
  const mutation = useCreateTeam();

  const [selectedColor, setSelectedColor] = useState<string | null>(
    "linear-gradient(0deg, #00989B, #005E78)",
  );
  const [isTeamSuccess, setIsTeamSuccess] = useState<boolean>(false);
  const [createdTeamId, setCreatedTeamId] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
    watch,
    control,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      domain: "",
      subDomain: "",
      topic: [],
    },
  });

  const domain = useWatch({
    control,
    name: "domain",
    defaultValue: "",
  });

  const subDomain = useWatch({
    control,
    name: "subDomain",
    defaultValue: "",
  });
  const topic = useWatch({
    control,
    name: "topic",
    defaultValue: [],
  });
  const name = watch("name");
  const username = watch("username");

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setTeam((prevTeam) => ({
      ...prevTeam,
      teamColor: colorName,
    }));
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTeam((prevTeam) => {
      const isAlreadySelected = (prevTeam.subDomainTopics || []).includes(
        value,
      );

      const updatedTopics = isAlreadySelected
        ? (prevTeam.subDomainTopics || []).filter((topic) => topic !== value)
        : [...(prevTeam.subDomainTopics || []), value];
      setValue("topic", updatedTopics);
      return { ...prevTeam, subDomainTopics: updatedTopics };
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (domains && domains.length > 0) {
      setDomainOptions(domains);
    }
  }, [domains]);

  useEffect(() => {
    if (subdomains && subdomains.length > 0) {
      setSubdomainOptions(subdomains);
    }
  }, [subdomains]);

  useEffect(() => {
    if (fetchedDomainTopics) {
      setDomainTopics(fetchedDomainTopics);
    }
  }, [fetchedDomainTopics]);

  useEffect(() => {
    const selectedDomain = domainOptions.find(
      (domains: Domain) => domains.name === domain,
    );
    setSelectedDomainId(selectedDomain ? selectedDomain._id : "");
  }, [domain]);

  const onSubmit = async () => {
    const response = await mutation.mutateAsync(
      {
        name: name,
        teamUsername: username,
        domain: domain,
        subDomain: subDomain,
        subDomainTopics: team.subDomainTopics,
        teamColor: team.teamColor,
      },
      {
        onError: (error: Error) => {
          const isAxiosError = (
            error: Error,
          ): error is AxiosError<{ message: string }> =>
            axios.isAxiosError(error);

          let errorMessage =
            "An unexpected error occurred. Please try again later.";

          if (isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          toast.error(`${errorMessage}`);
        },
      },
    );
    setCreatedTeamId(response.data._id);
    setIsTeamSuccess(true);
  };

  if (domainsPending || domainTopicsPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: "#D92D2D",
              color: "white",
            },
            iconTheme: {
              primary: "white",
              secondary: "#D92D2D",
            },
          },
        }}
      />
      {isTeamSuccess && (
        <>
          <div className="h-screen w-full px-5 md:px-10 pt-10 flex flex-col items-center font-body bg-base-100 text-base-content">
            <p className="font-bold text-[30px] outline outline-yellow px-20 py-3 mb-10">
              HOORAY!!
            </p>

            <TeamCard
              team={team}
              section="create-team"
              styles={
                "w-full md:w-[350px] md:h-[180px] h-[120px] cursor-default"
              }
              name={name}
              domain={domain}
              subDomain={subDomain}
            />
            <p className="font-medium mt-10">
              Your team was successfully created!
            </p>
            <button
              className="btn bg-yellow text-darkgrey border-none hover:bg-yellow rounded-sm font-medium mt-8 px-8 text-[16px]"
              onClick={() => navigate(`/teams/${createdTeamId}`)}
            >
              View Team
            </button>
          </div>
        </>
      )}
      {!isTeamSuccess && (
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
                  styles={
                    "w-full md:w-[350px] md:h-[180px] h-[120px] cursor-default"
                  }
                  name={name}
                  domain={domain}
                  subDomain={subDomain}
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
                      Team Name
                      {errors.name && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
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
                      htmlFor="username"
                    >
                      Team Nickname
                      {errors.username && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="Team Nickname"
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
                      Domain
                      {errors.domain && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
                    </label>
                    <select
                      className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-100 mt-[5px] bg-transparent"
                      {...register("domain")}
                      value={domain} // Controlled value
                      id="domain"
                    >
                      <option value="" disabled>
                        Domain
                      </option>
                      {domainOptions.map((domain) => (
                        <option key={domain._id} value={domain.name}>
                          {domain.name}
                        </option>
                      ))}
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
                      htmlFor="subDomain"
                    >
                      Sub Domain
                      {errors.subDomain && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
                    </label>
                    <select
                      className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent"
                      {...register("subDomain")}
                      value={subDomain} // Controlled value
                      id="subDomain"
                      disabled={!selectedDomainId && subdomainsPending}
                    >
                      <option value="" disabled>
                        Sub Domain
                      </option>
                      {subdomainOptions.map((subdomain) => (
                        <option key={subdomain._id} value={subdomain.name}>
                          {subdomain.name}
                        </option>
                      ))}
                    </select>
                    {errors.subDomain && (
                      <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                        {errors.subDomain?.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6 relative">
                    <label
                      className="block text-base-content mb-[1%] text-[18px]"
                      htmlFor="topics"
                    >
                      Topics
                      {isSubmitted && topic.length === 0 && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
                    </label>
                    <button
                      type="button"
                      onClick={toggleDropdown}
                      className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent text-left p-2"
                    >
                      {team.subDomainTopics && team.subDomainTopics.length > 0
                        ? `Selected Topics: ${team.subDomainTopics.join(", ")}`
                        : "Select Topics"}
                    </button>
                    {dropdownOpen && (
                      <div className="absolute z-10 w-full bg-base-100 border border-base-content mt-2 rounded-md shadow-lg p-3 max-h-60 overflow-y-auto">
                        {subDomainTopics?.map((topic) => (
                          <label
                            key={topic._id}
                            className="flex items-center space-x-2 mt-2"
                          >
                            <input
                              type="checkbox"
                              value={topic.name}
                              onChange={handleTopicChange}
                              checked={(team.subDomainTopics || []).includes(
                                topic.name,
                              )}
                              className="checkbox"
                            />
                            <span>{topic.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {isSubmitted && topic.length === 0 && (
                      <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                        Please select at least one topic
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
                    <div className="flex flex-row items-center 2xl:w-[70%]">
                      {Object.entries(teamColors).map(([name, gradient]) => (
                        <div
                          key={name}
                          onClick={() => handleColorSelect(gradient)}
                          className={`ml-1 xl:ml-3 cursor-pointer flex items-center justify-center ${
                            selectedColor === gradient
                              ? "border-4 w-[60px] h-[60px] rounded-full border-base-content"
                              : ""
                          }`}
                        >
                          <div
                            style={{ background: gradient }}
                            className="w-[45px] h-[45px] rounded-full"
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn w-full bg-yellow text-darkgrey border-none text-[17px] hover:bg-yellow rounded-sm font-medium disabled:opacity-100 xl:mb-8 3xl:mb-0"
                    type="submit"
                  >
                    {mutation.isPending ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      <span>Create Team</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CreateTeam;
