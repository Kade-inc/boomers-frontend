import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useSearchResults from "../hooks/Search/useSearchResults";
import { UserCircleIcon } from "@heroicons/react/24/solid";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function useScrollspy(ids: string[], offset: number = 0) {
  const [activeId, setActiveId] = useState<string>("");

  const handleScroll = useCallback(() => {
    const elements = ids.map((id) => document.getElementById(id));
    const visibleElements = elements.filter(
      (element): element is HTMLElement => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= offset && rect.bottom >= offset;
      },
    );

    if (visibleElements.length > 0) {
      setActiveId(visibleElements[0].id);
    }
  }, [ids, offset]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return activeId;
}

export default function SearchResultsPage() {
  const query = useQuery().get("q") || "";
  const { data: searchResult, isPending } = useSearchResults(query);
  const activeSection = useScrollspy(["challenges", "people", "teams"], 100);

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasAnyResults =
    isPending ||
    (searchResult?.challenges.results &&
      searchResult.challenges.results.length > 0) ||
    (searchResult?.profiles.results &&
      searchResult.profiles.results.length > 0) ||
    (searchResult?.teams.results && searchResult.teams.results.length > 0);

  const hasChallenges =
    isPending ||
    (searchResult?.challenges.results &&
      searchResult.challenges.results.length > 0);
  const hasPeople =
    isPending ||
    (searchResult?.profiles.results &&
      searchResult.profiles.results.length > 0);
  const hasTeams =
    isPending ||
    (searchResult?.teams.results && searchResult.teams.results.length > 0);

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Sidebar - Hidden on mobile */}
      {hasAnyResults && (
        <aside className="hidden md:block w-48 p-6 sticky top-0 h-screen">
          <div className="bg-base-100 rounded shadow p-4 font-body border border-white">
            <h2 className="font-bold mb-4">Sections</h2>
            <ul>
              {hasChallenges && (
                <li key="challenges">
                  <a
                    href="#challenges"
                    onClick={(e) => handleSectionClick(e, "challenges")}
                    className={`block w-full text-left py-2 px-2 rounded ${
                      activeSection === "challenges"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    Challenges
                  </a>
                </li>
              )}
              {hasPeople && (
                <li key="people">
                  <a
                    href="#people"
                    onClick={(e) => handleSectionClick(e, "people")}
                    className={`block w-full text-left py-2 px-2 rounded ${
                      activeSection === "people"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    People
                  </a>
                </li>
              )}
              {hasTeams && (
                <li key="teams">
                  <a
                    href="#teams"
                    onClick={(e) => handleSectionClick(e, "teams")}
                    className={`block w-full text-left py-2 px-2 rounded ${
                      activeSection === "teams"
                        ? "bg-green-100 text-green-700 font-semibold"
                        : "hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    Teams
                  </a>
                </li>
              )}
            </ul>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-10 p-10 max-w-3xl mx-auto">
        {/* Challenges Section */}
        {(isPending ||
          (searchResult?.challenges.results &&
            searchResult.challenges.results.length > 0)) && (
          <section id="challenges" className="bg-base-100 border rounded p-8">
            <h2 className="text-xl font-semibold mb-6 font-body">Challenges</h2>
            {isPending ? (
              <div className="font-body">Loading...</div>
            ) : (
              <>
                {searchResult.challenges.results.map((challenge) => (
                  <div
                    key={challenge._id}
                    className="flex items-center justify-between border-b py-4 font-body"
                  >
                    <div>
                      <div className="font-medium font-body">
                        {challenge.challenge_name}
                      </div>
                    </div>
                    <Link to={`/challenge/${challenge._id}`}>
                      <button className="font-medium px-6 font-body bg-yellow border-none py-2 text-sm text-darkgrey rounded-full">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
                {searchResult.challenges.hasMore && (
                  <div className="text-center mt-6">
                    <Link
                      to={`/search/challenges?q=${query}`}
                      className="text-base-content font-body font-medium"
                    >
                      See all challenge results
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* People Section */}
        {(isPending ||
          (searchResult?.profiles.results &&
            searchResult.profiles.results.length > 0)) && (
          <section id="people" className="bg-base-100 border rounded p-8">
            <h2 className="text-xl font-semibold mb-6 font-body">People</h2>
            {isPending ? (
              <div className="font-body">Loading...</div>
            ) : (
              <>
                {searchResult.profiles.results.map((profile) => (
                  <div
                    key={profile.user_id}
                    className="flex items-center justify-between border-b py-4 font-body"
                  >
                    <div className="flex items-center gap-4">
                      {profile.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-base-content" />
                      )}
                      <div>
                        <div className="font-medium font-body">
                          {profile.firstName || profile.lastName
                            ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
                            : profile.username}
                        </div>
                      </div>
                    </div>
                    <Link to={`/profile/${profile.user_id}`}>
                      <button className="font-medium px-6 font-body bg-yellow border-none py-2 text-sm text-darkgrey rounded-full">
                        View
                      </button>
                    </Link>
                  </div>
                ))}
                {searchResult.profiles.hasMore && (
                  <div className="text-center mt-6">
                    <Link
                      to={`/search/people?q=${query}`}
                      className="text-base-content font-body font-medium"
                    >
                      See all people results
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Teams Section */}
        {(isPending ||
          (searchResult?.teams.results &&
            searchResult.teams.results.length > 0)) && (
          <section id="teams" className="bg-base-100 border rounded p-8">
            <h2 className="text-xl font-semibold mb-6 font-body">Teams</h2>
            {isPending ? (
              <div className="font-body">Loading...</div>
            ) : (
              <>
                {searchResult.teams.results.map((team) => (
                  <div
                    key={team._id}
                    className="flex items-center justify-between  py-4 font-body rounded-md px-4 mb-4"
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
                      <div className="text-sm text-white/80 mt-1 flex items-center">
                        {team.domain && (
                          <span className="mr-2">{team.domain}</span>
                        )}
                        {team.subdomain && (
                          <span className="mr-2">• {team.subdomain}</span>
                        )}
                        {team.subdomainTopics &&
                          team.subdomainTopics.length > 0 && (
                            <>
                              <div className="bg-white rounded-full w-1 h-1 mx-1"></div>
                              <div
                                className={`${
                                  team.subdomainTopics.length > 3
                                    ? "tooltip tooltip-top tooltip-warning"
                                    : ""
                                }`}
                                data-tip={team.subdomainTopics
                                  .slice(3)
                                  .join(", ")}
                              >
                                {team.subdomainTopics.length > 3
                                  ? `${team.subdomainTopics.slice(0, 3).join(", ")} +${team.subdomainTopics.length - 3}`
                                  : team.subdomainTopics.join(", ")}
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
                {searchResult.teams.hasMore && (
                  <div className="text-center mt-6">
                    <Link
                      to={`/search/teams?q=${query}`}
                      className="text-base-content font-body font-medium"
                    >
                      See all team results
                    </Link>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
