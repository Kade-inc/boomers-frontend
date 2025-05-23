import TeamCard from "../components/TeamCard";
import { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";
import useDomains from "../hooks/useDomains";
import useSubDomains from "../hooks/useSubDomains";
import useDomainTopics from "../hooks/useDomainTopics";
import Domain from "../entities/Domain";
import SubDomain from "../entities/SubDomain";
import MultiSelect from "../components/MultiSelect";
import DomainTopic from "../entities/DomainTopic";
import { useDebounce } from "../hooks/useDebounce";

const TeamsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [domainOptions, setDomainOptions] = useState<Domain[]>([]);
  const [subDomainOptions, setSubDomainOptions] = useState<SubDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubDomain, setSelectedSubDomain] = useState<string>("");
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>("");
  const [selectedTopics, setSelectedTopics] = useState<DomainTopic[]>([]);
  const [currentTeams, setCurrentTeams] = useState<Team[]>([]);
  const [searchName, setSearchName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const debouncedSearchName = useDebounce(searchName, 500);

  const { teamId } = useParams();
  const {
    data: teams,
    isPending,
    error,
  } = useTeams({
    page: currentPage,
    domain: selectedDomain,
    subdomain: selectedSubDomain,
    subdomainTopics: selectedTopics,
    name: debouncedSearchName,
  });
  const {
    data: domains,
    isPending: isDomainsPending,
    error: domainsError,
  } = useDomains();
  const {
    data: subDomains,
    isPending: isSubDomainsPending,
    error: subDomainsError,
  } = useSubDomains(selectedDomainId);
  const {
    data: subTopics,
    isPending: isSubTopicsPending,
    error: subTopicsError,
  } = useDomainTopics();
  const navigate = useNavigate();

  useEffect(() => {
    if (teams) {
      setCurrentTeams(teams.data);
    }
  }, [teams, isPending, error]);

  useEffect(() => {
    if (domains && domains.length > 0) {
      setDomainOptions(domains);
      setSelectedDomain(domains[0]);
      setSelectedDomainId(domains[0]?._id);
    }
  }, [domains]);

  useEffect(() => {
    if (subDomains && subDomains.length > 0) {
      setSubDomainOptions(subDomains);
    }
  }, [subDomains]);

  // Update URL when page changes
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  if (error || domainsError || subTopicsError || subDomainsError) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div>Error</div>
      </div>
    );
  }

  if (teams && !Array.isArray(teams.data)) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100 font-body">
        <p>No teams</p>
      </div>
    );
  }

  return (
    <div className="h-screen text-base-content bg-base-100 px-2 md:px-10">
      {!teamId ? (
        <>
          <p className="text-[20px] pt-3 mb-3 font-bold font-heading">Teams</p>
          {(isDomainsPending || isSubDomainsPending || isSubTopicsPending) && (
            <div>
              <p className="font-body text-[14px] flex items-center">
                <span className="loading loading-spinner loading-xs mr-1"></span>{" "}
                Loading filters...
              </p>
            </div>
          )}
          {!isDomainsPending && !isSubDomainsPending && !isSubTopicsPending && (
            <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-start sm:items-center font-body w-full sm:w-auto mb-2 md:mb-0">
                <div className="flex items-center gap-2">
                  <p>Filters:</p>
                  {(selectedDomain ||
                    selectedSubDomain ||
                    selectedTopics.length > 0) && (
                    <span className="text-base-content font-semibold text-sm">
                      (
                      {
                        [
                          selectedDomain,
                          selectedSubDomain,
                          selectedTopics.length,
                        ].filter(Boolean).length
                      }
                      )
                    </span>
                  )}
                </div>
                <button
                  className="text-[14px] py-1 px-4 text-darkgrey bg-yellow sm:hidden md:w-[98px] rounded-sm w-full"
                  onClick={() => {
                    setShowFilters(!showFilters);
                  }}
                >
                  {!showFilters ? "Show Filters" : "Hide Filters"}
                </button>
                <div
                  className={`flex flex-col sm:flex-row gap-2 flex-wrap w-full sm:w-auto`}
                >
                  <select
                    className={`bg-transparent border p-1 border-1 rounded w-full sm:w-[143px] text-[14px] ${showFilters ? "block" : "hidden"} sm:block`}
                    style={{ borderColor: "rgba(204, 205, 207, 1)" }}
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
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
                  <select
                    className={`bg-transparent border p-1 border-1 rounded w-full sm:w-[143px] text-[14px] ${showFilters ? "block" : "hidden"} sm:block`}
                    style={{ borderColor: "rgba(204, 205, 207, 1)" }}
                    value={selectedSubDomain}
                    onChange={(e) => setSelectedSubDomain(e.target.value)}
                  >
                    <option value="" disabled>
                      Sub domain
                    </option>
                    {subDomainOptions.map((subDomain) => (
                      <option key={subDomain._id} value={subDomain.name}>
                        {subDomain.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`${showFilters ? "block" : "hidden"} sm:block w-full sm:w-[143px]`}
                  >
                    <MultiSelect
                      options={subTopics || []}
                      selected={selectedTopics}
                      onChange={setSelectedTopics}
                      parentContainerWidth="w-full sm:w-[143px]"
                    />
                  </div>
                </div>
                <button
                  className="text-white bg-[#FF2F2F] rounded-sm bg-redish text-[14px] py-1 px-4 w-full sm:w-auto"
                  onClick={() => {
                    setSelectedSubDomain("");
                    setSelectedTopics([]);
                    setSearchName("");
                    handlePageChange(1);
                  }}
                >
                  Clear all
                </button>
              </div>
              <label className="input input-bordered rounded-[50px] flex items-center gap-2 h-[29px] w-full sm:w-[200px] bg-transparent border-base-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  className="font-body"
                  placeholder="Search"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </label>
            </div>
          )}
          {isPending && (
            <div className="flex justify-center h-1/2 items-center bg-base-100">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
          {!isPending && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-12 mt-10 mb-12 lg:w-[90%] pb-12">
              {currentTeams.map((team: Team) => {
                return (
                  <TeamCard
                    key={team._id}
                    team={team}
                    section="allTeams-section"
                    onClick={() => navigate(`/teams/${team._id}`)}
                    styles={"h-[165px] w-full md:w-[330px]"}
                    subStyles="px-4"
                  />
                );
              })}
            </div>
          )}
          {!isPending && currentTeams.length === 0 && (
            <p className="font-body flex justify-center">No teams</p>
          )}

          <div className="pb-12">
            {teams && teams.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>

                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className="join-item btn"
                      >
                        1
                      </button>
                      {currentPage > 4 && (
                        <span className="join-item btn btn-disabled">...</span>
                      )}
                    </>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: 5 }, (_, i) => {
                    const pageNumber = currentPage - 2 + i;
                    if (pageNumber > 0 && pageNumber <= teams.totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`join-item btn font-body ${
                            currentPage === pageNumber
                              ? "bg-yellow text-darkgrey"
                              : ""
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Last page */}
                  {currentPage < teams.totalPages - 2 && (
                    <>
                      {currentPage < teams.totalPages - 3 && (
                        <span className="join-item btn btn-disabled">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(teams.totalPages)}
                        className="join-item btn"
                      >
                        {teams.totalPages}
                      </button>
                    </>
                  )}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`join-item btn ${
                      currentPage === teams.totalPages ? "btn-disabled" : ""
                    }`}
                    disabled={currentPage === teams.totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="fixed bottom-0 right-0 m-4">
            <button
              className="px-8 py-1 font-body text-darkgrey bg-yellow rounded-sm"
              onClick={() => navigate("/create-team")}
            >
              Add team
            </button>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default TeamsPage;
