import { useLocation, Link } from "react-router-dom";
import useAllSearchTeams from "../hooks/Search/useAllSearchTeams";
import useAllSearchChallenges from "../hooks/Search/useAllSearchChallenges";
import Team from "../entities/Team";
import Challenge from "../entities/Challenge";

interface PaginatedResponse {
  results: (Team | Challenge)[];
  total: number;
  page: number;
  totalPages: number;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AllResultsAllPage() {
  const query = useQuery().get("q") || "";
  const location = useLocation();
  const section = location.pathname.split("/").pop() || ""; // Gets 'challenges', 'teams', or 'people'
  const currentPage = Number(useQuery().get("page")) || 1;

  // Fetch data based on section
  const { data: teamsData, isPending: isTeamsPending } = useAllSearchTeams(
    query,
    currentPage.toString(),
  );
  const { data: challengesData, isPending: isChallengesPending } =
    useAllSearchChallenges(query, currentPage.toString());
  console.log("Teams Data", teamsData);
  console.log("Challenges Data", challengesData);

  const renderPagination = (data: PaginatedResponse) => {
    if (!data || !data.totalPages) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(data.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Previous button
    pages.push(
      <Link
        key="prev"
        to={`/search/results/${section}?q=${query}&page=${currentPage - 1}`}
        className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
      >
        «
      </Link>,
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <Link
          key="1"
          to={`/search/results/${section}?q=${query}&page=1`}
          className="join-item btn"
        >
          1
        </Link>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="join-item btn btn-disabled">
            ...
          </span>,
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          to={`/search/results/${section}?q=${query}&page=${i}`}
          className={`join-item btn font-body ${currentPage === i ? "bg-yellow text-darkgrey" : ""}`}
        >
          {i}
        </Link>,
      );
    }

    // Last page
    if (endPage < data.totalPages) {
      if (endPage < data.totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="join-item btn btn-disabled">
            ...
          </span>,
        );
      }
      pages.push(
        <Link
          key={data.totalPages}
          to={`/search/results/${section}?q=${query}&page=${data.totalPages}`}
          className="join-item btn"
        >
          {data.totalPages}
        </Link>,
      );
    }

    // Next button
    pages.push(
      <Link
        key="next"
        to={`/search/results/${section}?q=${query}&page=${currentPage + 1}`}
        className={`join-item btn ${
          currentPage === data.totalPages ? "btn-disabled" : ""
        }`}
      >
        »
      </Link>,
    );

    return (
      <div className="flex justify-center mt-8">
        <div className="join">{pages}</div>
      </div>
    );
  };

  const renderContent = () => {
    switch (section) {
      case "teams":
        return (
          <div className="space-y-4">
            {isTeamsPending ? (
              <div className="font-body flex justify-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : teamsData?.results && teamsData.results.length > 0 ? (
              <>
                {teamsData.results.map((team: Team) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between py-4 font-body rounded-md px-4 mb-4"
                    style={{
                      background:
                        team.teamColor ||
                        "linear-gradient(0deg, #589FD6, #43CCBA)",
                      color: team.teamColor ? "#ffffff" : "#000000",
                    }}
                  >
                    <div>
                      <div className="font-medium font-body text-white">
                        {team.name}
                      </div>
                      <div className="text-sm text-white/80 mt-1 flex items-center flex-wrap gap-1">
                        {team.domain && <span>{team.domain}</span>}
                        {team.subDomain && <span>• {team.subDomain}</span>}
                        {team.subDomainTopics &&
                          team.subDomainTopics.length > 0 && (
                            <>
                              <div className="bg-white rounded-full w-1 h-1"></div>
                              <div
                                className={`${
                                  team.subDomainTopics.length > 3
                                    ? "tooltip tooltip-top tooltip-warning"
                                    : ""
                                }`}
                                data-tip={team.subDomainTopics
                                  .slice(3)
                                  .join(", ")}
                              >
                                {team.subDomainTopics.length > 3
                                  ? `${team.subDomainTopics
                                      .slice(0, 3)
                                      .join(", ")} +${
                                      team.subDomainTopics.length - 3
                                    }`
                                  : team.subDomainTopics.join(", ")}
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                    <Link to={`/teams/${team._id}`}>
                      <button className="font-medium px-6 font-body bg-yellow border-none py-2 text-sm text-darkgrey rounded-full">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
                {renderPagination(teamsData)}
              </>
            ) : (
              <div className="text-center text-base-content font-body py-4">
                No results found
              </div>
            )}
          </div>
        );
      case "challenges":
        return (
          <div className="space-y-4">
            {isChallengesPending ? (
              <div className="font-body flex justify-center">
                <span className="loading loading-dots loading-md"></span>
              </div>
            ) : challengesData?.results && challengesData.results.length > 0 ? (
              <>
                {challengesData.results.map((challenge: Challenge) => (
                  <div
                    key={challenge._id}
                    className="flex items-center justify-between border-b py-4 font-body"
                  >
                    <div>
                      <div className="font-medium font-body">
                        {challenge.challenge_name}
                      </div>
                      {challenge.due_date && (
                        <div className="text-sm text-base-content/60 mt-1">
                          Due:{" "}
                          {new Date(challenge.due_date).toLocaleDateString()}
                        </div>
                      )}
                      {challenge.difficulty && (
                        <div className="text-sm text-base-content/60 mt-1">
                          Difficulty: {challenge.difficulty}/5
                        </div>
                      )}
                    </div>
                    <Link to={`/challenge/${challenge._id}`}>
                      <button className="font-medium px-6 font-body bg-yellow border-none py-2 text-sm text-darkgrey rounded-full">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
                {renderPagination(challengesData)}
              </>
            ) : (
              <div className="text-center text-base-content font-body py-4">
                No results found
              </div>
            )}
          </div>
        );
      case "people":
        return <div>People content will go here</div>;
      default:
        return <div>Invalid section</div>;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold font-body">
            All {section.charAt(0).toUpperCase() + section.slice(1)} Results for
            &quot;{query}&quot;
          </h1>
          <Link
            to={`/search?q=${query}`}
            className="text-base-content font-body hover:text-primary"
          >
            ← Back to search results
          </Link>
        </div>

        <div className="bg-base-100 border rounded p-4 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
