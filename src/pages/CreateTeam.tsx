import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TeamCard from "../components/TeamCard";
import Team from "../entities/Team";
import { useForm } from "react-hook-form";
import useDomains from "../hooks/useDomains";
import Domain from "../entities/Domain";
import useSubDomains from "../hooks/useSubDomains";
import SubDomain from "../entities/SubDomain";
import useDomainTopics from "../hooks/useDomainTopics";
import DomainTopic from "../entities/DomainTopic";

const schema = z.object({
  name: z.string().default(""),
  username: z.string().default(""),
  domain: z.string().default(""),
  subdomain: z.string().default(""),
  topic: z.array(z.string()).default([]),
  teamColor: z.string().default(""),
});

type FormData = z.infer<typeof schema>;

function CreateTeam() {
  const [team, setTeam] = useState<Team>({
    name: "",
    teamUsername: "",
    domain: "",
    subdomain: "",
    subdomainTopics: [],
    teamColor: "",
    owner_id: "",
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
  const [subdomainTopics, setDomainTopics] = useState<DomainTopic[]>([]);
  const [teamColors] = useState({
    "teal-gradient": "linear-gradient(0deg, #00989B, #005E78)",
    "kinda-orange-gradient": "linear-gradient(0deg, #D9436D, #F26A4B)",
    "greyish-gradient": "linear-gradient(0deg, #495D6D, #313752)",
    "greenish-gradient": "linear-gradient(0deg, #589FD6, #43CCBA)",
    "dreamy-gradient": "linear-gradient(180deg, #7b4dbb, #d97b98, #f3aa75)",
  });

  const [selectedColor, setSelectedColor] = useState<string | null>(
    "linear-gradient(0deg, #00989B, #005E78)",
  );

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setTeam((prevTeam) => ({
      ...prevTeam,
      teamColor: colorName,
    }));
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      domain: "",
      subdomain: "",
      topic: [], // Initialize `topic` as an empty array
      teamColor: "",
    },
  });

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTeam((prevTeam) => {
      const isAlreadySelected = (prevTeam.subdomainTopics || []).includes(
        value,
      );

      const updatedTopics = isAlreadySelected
        ? (prevTeam.subdomainTopics || []).filter((topic) => topic !== value)
        : [...(prevTeam.subdomainTopics || []), value];

      return { ...prevTeam, subdomainTopics: updatedTopics };
    });
  };

  const handleInputChange =
    (field: keyof Team) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = event.target.value;

      if (field === "domain") {
        const selectedDomain = domainOptions.find(
          (domain) => domain.name === value,
        );
        setSelectedDomainId(selectedDomain ? selectedDomain._id : "");
        setTeam((prevTeam) => ({
          ...prevTeam,
          domain: selectedDomain ? selectedDomain.name : "",
          subdomain: "",
        }));
      } else {
        setTeam((prevTeam) => ({
          ...prevTeam,
          [field]: value,
        }));
      }
    };

  const onSubmit = async (data: FormData) => {
    // setTeam(data);
    console.log(data);
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
                  onChange={handleInputChange("name")}
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
                  Team Username{" "}
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Team Nick name"
                  className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px]"
                  style={{ backgroundColor: "transparent" }}
                  {...register("username")}
                  onChange={handleInputChange("teamUsername")}
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
                  onChange={handleInputChange("domain")}
                  value={team.domain} // Controlled value
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
                  htmlFor="subdomain"
                >
                  Sub Domain{" "}
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                </label>
                <select
                  className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent"
                  {...register("subdomain")}
                  onChange={handleInputChange("subdomain")}
                  value={team.subdomain} // Controlled value
                  id="subdomain"
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
                {errors.subdomain && (
                  <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                    {errors.subdomain?.message}
                  </p>
                )}
              </div>

              <div className="mb-6 relative">
                <label
                  className="block text-base-content mb-[1%] text-[18px]"
                  htmlFor="topics"
                >
                  Topics
                </label>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-300 mt-[5px] bg-transparent text-left p-2"
                >
                  {team.subdomainTopics && team.subdomainTopics.length > 0
                    ? `Selected Topics: ${team.subdomainTopics.join(", ")}`
                    : "Select Topics"}
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 w-full bg-base-100 border border-base-content mt-2 rounded-md shadow-lg p-3 max-h-60 overflow-y-auto">
                    {subdomainTopics?.map((topic) => (
                      <label
                        key={topic._id}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <input
                          type="checkbox"
                          value={topic.name}
                          onChange={handleTopicChange}
                          checked={(team.subdomainTopics || []).includes(
                            topic.name,
                          )}
                          className="checkbox"
                        />
                        <span>{topic.name}</span>
                      </label>
                    ))}
                  </div>
                )}
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
