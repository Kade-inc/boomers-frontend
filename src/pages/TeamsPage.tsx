import TeamCard from "../components/TeamCard";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useTeams from "../hooks/useTeams";
import Team from "../entities/Team";

const TeamsPage = () => {
  const [filters, setFilters] = useState({
    domain: "",
    subDomain: "",
    topics: "",
  });
  const [searchName, setSearchName] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [page, setPage] = useState(1);
  const { teamId } = useParams();
  const { data: teams, isPending, error } = useTeams("", page);
  const navigate = useNavigate();

  // Filter teams
  useEffect(() => {
    if (teams && !isPending && !error) {
      const filtered = teams.data.filter((team: Team) => {
        const matchesDomain =
          !filters.domain ||
          team?.domain?.toLowerCase().includes(filters.domain.toLowerCase());

        const matchesSubDomain =
          !filters.subDomain ||
          (team?.subdomain &&
            team.subdomain
              .toLowerCase()
              .includes(filters.subDomain.toLowerCase()));

        const matchesTopics =
          !filters.topics ||
          (team.subdomainTopics &&
            team.subdomainTopics.includes(filters.topics));

        const matchesName = team.name
          .toLowerCase()
          .includes(searchName.toLowerCase());

        return (
          matchesDomain && matchesSubDomain && matchesTopics && matchesName
        );
      });
      setFilteredTeams(filtered);
    }
  }, [teams, filters, isPending, searchName, error]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }
  if (error) {
    return <div>Error: </div>;
  }

  if (!Array.isArray(teams.data)) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-100">
        <p>No teams</p>
      </div>
    );
  }

  const activeFilterCount = Object.values(filters).filter(
    (value) => value,
  ).length;

  // ReactPaginate's onPageChange handler.
  const handlePageClick = (event: { selected: number }) => {
    // react-paginate is zero-indexed so add 1
    const selectedPage = event.selected + 1;
    setPage(selectedPage);
  };

  return (
    <div className="h-screen text-base-content bg-base-100 px-10">
      {!teamId ? (
        <>
          <p className="text-[20px] pt-3 mb-3 font-bold font-heading">Teams</p>

          <div className="flex gap-2 flex-wrap items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center font-body">
              <p>
                Filters:{" "}
                {activeFilterCount > 0 && (
                  <span className="sm:hidden">({activeFilterCount})</span>
                )}
              </p>
              <button
                className="w-[98px] text-[14px] p-1 text-white bg-yellow sm:hidden sm:w-[143px]"
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
              >
                {!showFilters ? "Show Filters" : "Hide Filters"}
              </button>
              <div className={`flex gap-2 flex-wrap`}>
                <select
                  className={`max-w-xs bg-transparent border p-1 border-1 rounded-sm w-[143px] text-[14px] ${showFilters ? "block" : "hidden"} sm:block`}
                  style={{ borderColor: "rgba(204, 205, 207, 1)" }}
                  value={filters.domain}
                  onChange={(e) =>
                    setFilters({ ...filters, domain: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Domain
                  </option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
                </select>
                <select
                  className={`max-w-xs bg-transparent border p-1 border-1 rounded-sm w-[143px] text-[14px] ${showFilters ? "block" : "hidden"} sm:block`}
                  style={{ borderColor: "rgba(204, 205, 207, 1)" }}
                  value={filters.subDomain}
                  onChange={(e) =>
                    setFilters({ ...filters, subDomain: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Sub domain
                  </option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
                <select
                  className={`max-w-xs bg-transparent border p-1 border-1 rounded-sm w-[143px] text-[14px] ${showFilters ? "block" : "hidden"} sm:block`}
                  style={{ borderColor: "rgba(204, 205, 207, 1)" }}
                  value={filters.topics}
                  onChange={(e) =>
                    setFilters({ ...filters, topics: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Topics
                  </option>
                  <option value="React JS">React JS</option>
                  <option value="Django">Django</option>
                  <option value="Flask">Flask</option>
                  <option value="AngularJS">AngularJS</option>
                  <option value="Next.Js">Next.Js</option>
                  <option value="Node.Js">Node.Js</option>
                </select>
              </div>
              <button
                className="text-white bg-red-600 px-6 py-[2px] rounded-sm bg-redishs"
                onClick={() =>
                  setFilters({ domain: "", subDomain: "", topics: "" })
                }
              >
                Clear all
              </button>
            </div>
            <label className="input input-bordered rounded-[50px] bg-transparent flex items-center gap-2 h-[29px] w-full sm:w-[200px]">
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
                onChange={(e) => {
                  setSearchName(e.target.value);
                }}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-12 mt-10 mb-12 lg:w-[90%] pb-12">
            {filteredTeams.map((team: Team) => {
              return (
                <TeamCard
                  key={team._id}
                  team={team}
                  section="allTeams-section"
                  onClick={() => navigate(`/teams/${team._id}`)}
                  styles={"h-[165px] w-[330px]"}
                  subStyles="px-4"
                />
              );
            })}
          </div>

          <div className="pb-12">
            {/* Pagination UI */}
            {teams.totalPages > 1 && (
              <ReactPaginate
                breakLabel="..."
                nextLabel="next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={teams.totalPages}
                previousLabel="previous"
                forcePage={page - 1} // This forces the active page to sync with your state
                containerClassName="flex justify-center items-center mt-6 font-body text-darkgrey"
                pageClassName="mx-1"
                pageLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                activeClassName="bg-yellow text-darkgrey"
                previousLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                nextLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                disabledLinkClassName="opacity-50 cursor-not-allowed"
              />
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
