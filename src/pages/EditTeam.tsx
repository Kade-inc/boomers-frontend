import { useEffect, useState, useMemo, useCallback } from "react";
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
import useUpdateTeam from "../hooks/useUpdateTeam";
import useTeam from "../hooks/useTeam";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import MultiSelect from "../components/MultiSelect";
import useAuthStore from "../stores/useAuthStore";

interface FormInputs {
  name: string;
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
  domain: z.string().nonempty("Please select a domain"),
  subDomain: z.string().nonempty("Please select a Sub Domain"),
  topic: z.array(z.string()).optional().default([]),
});

function EditTeam() {
  const { teamId } = useParams();
  const { data: teamData, isPending: isTeamLoading } = useTeam(teamId || "");
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const { data: domains, isPending: domainsPending } = useDomains();
  const { data: fetchedDomainTopics, isPending: domainTopicsPending } = useDomainTopics();

  // Add authorization check
  useEffect(() => {
    if (teamData && userId) {
      if (teamData.owner_id !== userId) {
        toast.error("You don't have permission to edit this team");
        navigate("/dashboard");
      }
    }
  }, [teamData, userId, navigate]);

  const [teamColors] = useState({
    "teal-gradient": "linear-gradient(0deg, #00989B, #005E78)",
    "kinda-orange-gradient": "linear-gradient(0deg, #D9436D, #F26A4B)",
    "greyish-gradient": "linear-gradient(0deg, #495D6D, #313752)",
    "greenish-gradient": "linear-gradient(0deg, #589FD6, #43CCBA)",
    "dreamy-gradient": "linear-gradient(180deg, #7b4dbb, #d97b98, #f3aa75)",
  });
  
  const mutation = useUpdateTeam();
  const [selectedColor, setSelectedColor] = useState<string>(
    "linear-gradient(0deg, #00989B, #005E78)",
  );
  const [selectedTopics, setSelectedTopics] = useState<DomainTopic[]>([]);
  const [isTeamSuccess, setIsTeamSuccess] = useState<boolean>(false);
  const [isFormInitialized, setIsFormInitialized] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
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

  const name = watch("name");

  // Compute derived values directly instead of using state + useEffect
  const domainOptions = useMemo(() => {
    return domains || [];
  }, [domains]);

  const selectedDomainId = useMemo(() => {
    const selectedDomain = domainOptions.find(
      (d: Domain) => d.name === domain,
    );
    return selectedDomain?._id || null;
  }, [domain, domainOptions]);

  const { data: subdomains, isPending: subdomainsPending } = useSubDomains(selectedDomainId);

  const subdomainOptions = useMemo(() => {
    return subdomains || [];
  }, [subdomains]);

  const selectedSubdomainId = useMemo(() => {
    const selectedSubdomain = subdomainOptions.find(
      (subdomain: SubDomain) => subdomain.name === subDomain,
    );
    return selectedSubdomain?._id || null;
  }, [subDomain, subdomainOptions]);

  const availableDomainTopics = useMemo(() => {
    if (fetchedDomainTopics && subDomain) {
      return fetchedDomainTopics.filter(
        (topic) => topic.parentSubdomain?._id === selectedSubdomainId,
      );
    }
    return [];
  }, [fetchedDomainTopics, subDomain, selectedSubdomainId]);

  // Compute team object for display
  const team = useMemo<Team>(() => ({
    name: name || "",
    teamUsername: teamData?.teamUsername || "",
    domain: domain || "",
    subdomain: subDomain || "",
    subdomainTopics: selectedTopics.map((topic) => topic.name),
    teamColor: selectedColor,
  }), [name, teamData?.teamUsername, domain, subDomain, selectedTopics, selectedColor]);

  // Initialize form with team data
  useEffect(() => {
    if (teamData) {
      setSelectedColor(teamData.teamColor);
      setValue("name", teamData.name);
      setValue("domain", teamData.domain);
      setValue("subDomain", teamData.subdomain);
      setValue("topic", teamData.subdomainTopics);
      setIsFormInitialized(true);
    }
  }, [teamData, setValue]);

  // Reset subdomain and topics when domain changes (only after form is initialized)
  useEffect(() => {
    if (isFormInitialized && teamData && domain !== teamData.domain) {
      setValue("subDomain", "");
      setSelectedTopics([]);
    }
  }, [domain, teamData, setValue, isFormInitialized]);

  // Reset topics when subdomain changes (only after form is initialized)
  useEffect(() => {
    if (isFormInitialized && teamData && subDomain !== teamData.subdomain) {
      setSelectedTopics([]);
    }
  }, [subDomain, teamData, isFormInitialized]);

  // Set selected topics when team data and available topics are ready
  useEffect(() => {
    if (
      teamData &&
      teamData.subdomainTopics &&
      availableDomainTopics.length > 0
    ) {
      const topics = teamData.subdomainTopics
        .map((topicName: string) => {
          const topic = availableDomainTopics.find((t) => t.name === topicName);
          return topic;
        })
        .filter(Boolean) as DomainTopic[];

      setSelectedTopics(topics);
    }
  }, [teamData, availableDomainTopics]);

  // Memoize handlers
  const handleColorSelect = useCallback((colorName: string) => {
    setSelectedColor(colorName);
  }, []);

  const handleTopicChange = useCallback(
    (selected: DomainTopic[]) => {
      setSelectedTopics(selected);
      setValue(
        "topic",
        selected.map((topic) => topic.name),
      );
    },
    [setValue],
  );

  const onSubmit = useCallback(async () => {
    if (!teamId) return;

    await mutation.mutateAsync(
      {
        teamId,
        payload: {
          name: name,
          teamUsername: teamData?.teamUsername || "", // Keep existing username
          domain: domain,
          subdomain: subDomain,
          subdomainTopics: selectedTopics.map((topic) => topic.name),
          teamColor: selectedColor,
        },
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
    setIsTeamSuccess(true);
  }, [
    mutation,
    teamId,
    name,
    teamData?.teamUsername,
    domain,
    subDomain,
    selectedTopics,
    selectedColor,
  ]);

  if (domainsPending || domainTopicsPending || isTeamLoading) {
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
              SUCCESS!
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
              Your team was successfully updated!
            </p>
            <button
              className="btn bg-yellow text-darkgrey border-none hover:bg-yellow rounded-sm font-medium mt-8 px-8 text-[16px]"
              onClick={() => navigate(`/teams/${teamId}`)}
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
                  Want to make changes?
                </p>
                <p className="text-yellow font-bold text-[25px] md:text-[35px]">
                  Update your Team.
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
              <div className="w-full md:w-[70%] bg-base-200 pt-10 flex justify-center md:min-h-[600px] h-[650px] shadow-lg rounded-md pb-8 md:pb-0 overflow-y-auto">
                <form className="w-[80%]" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <label
                      className="block text-base-content mb-[1%] text-[16px]"
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
                      className="input w-full border border-base-content focus:outline-none bg-transparent rounded-[5px] placeholder-gray-300 mt-[5px] h-[40px] text-[16px]"
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
                      className="block text-base-content mb-[1%] text-[16px]"
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
                      className="select w-full border border-base-content focus:outline-none rounded-[5px] placeholder-gray-100 mt-[5px] bg-transparent text-[16px]"
                      style={{
                        height: "40px",
                        minHeight: "40px",
                        padding: "0 1rem",
                        lineHeight: "40px",
                      }}
                      {...register("domain")}
                      value={domain}
                      id="domain"
                    >
                      <option value="" disabled>
                        Domain
                      </option>
                      {domainOptions.map((domain: Domain) => (
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
                      className="block text-base-content mb-[1%] text-[16px]"
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
                      className="select w-full border border-base-content focus:outline-none rounded-[5px] placeholder-gray-300 mt-[5px] bg-transparent text-[16px] disabled:opacity-50 disabled:border-gray-400"
                      style={{
                        height: "40px",
                        minHeight: "40px",
                        padding: "0 1rem",
                        lineHeight: "40px",
                      }}
                      {...register("subDomain")}
                      value={subDomain}
                      id="subDomain"
                      disabled={!domain || subdomainsPending}
                    >
                      <option value="" disabled>
                        {domain && subdomainsPending
                          ? "Loading..."
                          : "Sub Domain"}
                      </option>
                      {subdomainOptions.map((subdomain: SubDomain) => (
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
                      className="block text-base-content mb-[1%] text-[16px]"
                      htmlFor="topics"
                    >
                      Topics
                    </label>
                    <MultiSelect
                      options={availableDomainTopics || []}
                      selected={selectedTopics}
                      onChange={handleTopicChange}
                      parentContainerWidth="w-full"
                      inputStyles="w-full border border-base-content focus:outline-none rounded-[5px] placeholder-gray-300 mt-[5px] bg-transparent text-[16px] flex items-center justify-between px-4 py-2"
                      disabled={!subDomain}
                    />
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
                              ? "border-4 w-[55px] h-[55px] rounded-full border-base-content"
                              : ""
                          }`}
                        >
                          <div
                            style={{ background: gradient }}
                            className="w-[40px] h-[40px] rounded-full"
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn w-full bg-yellow text-darkgrey border-none text-[16px] hover:bg-yellow rounded-sm font-medium disabled:opacity-100 mb-4"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <span className="loading loading-dots loading-md"></span>
                    ) : (
                      <span>Update Team</span>
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

export default EditTeam;
