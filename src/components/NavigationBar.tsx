import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./DarkModeToggle";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../stores/useAuthStore";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import useNotificationsStore from "../stores/useNotificationsStore";
import useSearchHistory from "../hooks/Search/useSearchHistory";
import useClearSearchHistory from "../hooks/Search/useClearSearchHistory";
import { useState, useEffect, useRef } from "react";
import useSearchResults from "../hooks/Search/useSearchResults";
import { useDebounce } from "../hooks/useDebounce";

function NavigationBar() {
  const currentRoute = useLocation();
  const mutation = useLogout();
  const pathname = currentRoute.pathname;
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const notifications = useNotificationsStore((state) => state.notifications);

  // Calculate unread notifications
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const handleLogout = async () => {
    await mutation.mutateAsync();
    logout();
    navigate("/");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: searchHistory,
    isPending: searchHistoryPending,
    error: searchHistoryError,
  } = useSearchHistory(isInputFocused);
  const {
    data: searchResult,
    isPending: searchResultPending,
    error: searchResultError,
  } = useSearchResults(debouncedSearchQuery);
  const clearHistoryMutation = useClearSearchHistory();

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      // Check if there are any results in any category
      const hasResults =
        searchResult &&
        (searchResult.teams.results.length > 0 ||
          searchResult.profiles.results.length > 0 ||
          searchResult.challenges.results.length > 0);

      if (hasResults) {
        setIsInputFocused(false);
        navigate(`/search?q=${searchQuery.trim()}`);
      }
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const themeToggleRef = useRef<HTMLDivElement>(null);

  // Add click outside handler to close the results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && searchResultsRef.current) {
        if (
          !searchInputRef.current.contains(event.target as Node) &&
          !searchResultsRef.current.contains(event.target as Node) &&
          !themeToggleRef.current?.contains(event.target as Node)
        ) {
          setIsInputFocused(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const authenticatedNavItems

  return (
    <div className="navbar bg-base-100 flex md:px-10 justify-between px-5 md:pt-4 fixed z-40">
      <div className="flex p-0 w-[20%] md:w-[20%]">
        <Link
          to="/dashboard"
          className="btn btn-ghost text-xl font-heading p-0 text-base-content"
        >
          LOGO
        </Link>
      </div>

      {isAuthenticated && (
        <>
          <div className="xl:hidden w-[10%]">
            <button onClick={() => setIsInputFocused(true)} className="p-2">
              <MagnifyingGlassCircleIcon className="inset-y-0 left-0 flex items-center pl-2 w-12 h-12 top-2.5 text-base-content" />
            </button>
          </div>
          <div className="relative w-1/2" id="search-container">
            <div className="lg:w-[20%] justify-start items-center relative hidden xl:flex">
              <MagnifyingGlassIcon className="absolute inset-y-0 left-0 flex items-center pl-2 w-8 h-8 top-2.5 fill-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                className="input md:w-auto rounded-full pl-10 text-[12px] md:text-base font-body bg-grey input-bordered"
                onChange={handleFilter}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                value={searchQuery}
              />
            </div>
            {isInputFocused && (
              <>
                <div className="fixed top-[72px] left-0 right-0 bottom-0 bg-black/30 animate-fade-in" />
                <div
                  ref={searchResultsRef}
                  className="fixed xl:absolute top-[72px] xl:top-14 left-0 right-0 xl:right-auto bottom-0 xl:bottom-auto bg-base-100 min-h-[100px] xl:min-h-[100px] max-h-[calc(100vh-72px)] xl:max-h-[700px] w-full xl:w-3/4 rounded-none xl:rounded overflow-hidden z-50 flex flex-col"
                >
                  <div className="overflow-y-auto flex-1">
                    <div className="p-4">
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={() => setIsInputFocused(false)}
                          className="xl:hidden p-2 hover:bg-base-200 rounded-full"
                        >
                          <XMarkIcon className="w-6 h-6 text-base-content" />
                        </button>
                      </div>
                      <div className="xl:hidden relative mb-4">
                        <MagnifyingGlassIcon className="absolute inset-y-0 left-0 flex items-center pl-2 w-8 h-8 top-2.5 fill-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="input w-full rounded-full pl-10 text-[12px] md:text-base font-body bg-grey input-bordered"
                          onChange={handleFilter}
                          onKeyDown={handleKeyDown}
                          value={searchQuery}
                          autoFocus
                        />
                      </div>
                      {!searchQuery ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-body font-medium text-base-content">
                              Recent Searches
                            </h3>
                            {searchHistory && searchHistory.length > 0 && (
                              <button
                                onClick={handleClearHistory}
                                className="text-sm text-base-content hover:text-error font-body"
                                disabled={clearHistoryMutation.isPending}
                              >
                                {clearHistoryMutation.isPending
                                  ? "Clearing..."
                                  : "Clear"}
                              </button>
                            )}
                          </div>
                          {searchHistoryPending ? (
                            <div className="flex items-center justify-center h-32">
                              <span className="loading loading-spinner loading-md"></span>
                            </div>
                          ) : searchHistoryError ? (
                            <div className="text-error text-center font-body">
                              Error loading search history
                            </div>
                          ) : searchHistory && searchHistory.length > 0 ? (
                            <div className="space-y-2">
                              {searchHistory.map((history) => (
                                <button
                                  key={history._id}
                                  onClick={() => setSearchQuery(history.term)}
                                  className="w-full flex items-center p-2 hover:bg-base-200 rounded"
                                >
                                  <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-400" />
                                  <span className="text-sm font-body text-base-content">
                                    {history.term}
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-base-content font-body py-4">
                              No recent searches
                            </div>
                          )}
                        </div>
                      ) : searchResultPending ? (
                        <div className="flex items-center justify-center h-32">
                          <span className="loading loading-spinner loading-md"></span>
                        </div>
                      ) : searchResultError ? (
                        <div className="p-4 text-error font-body text-center">
                          Error loading search results
                        </div>
                      ) : searchResult ? (
                        <div className="px-2">
                          {/* Teams Section */}
                          {searchResult.teams.results.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-body font-medium text-base-content mb-2">
                                Teams
                              </h3>
                              {searchResult.teams.results
                                .slice(0, 3)
                                .map((team) => (
                                  <Link
                                    key={team._id}
                                    to={`/teams/${team._id}`}
                                    className="flex items-center justify-between p-2 hover:bg-base-200 rounded"
                                    onClick={() => setIsInputFocused(false)}
                                  >
                                    <div className="flex items-center">
                                      <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-400" />
                                      <span className="text-sm font-body">
                                        {team.name}
                                      </span>
                                    </div>
                                    <div
                                      className="w-8 h-8 rounded-full"
                                      style={{ background: team?.teamColor }}
                                    />
                                  </Link>
                                ))}
                            </div>
                          )}

                          {/* Profiles Section */}
                          {searchResult.profiles.results.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-body font-medium text-base-content mb-2">
                                Users
                              </h3>
                              {searchResult.profiles.results
                                .slice(0, 4)
                                .map((profile) => (
                                  <Link
                                    key={profile.user_id}
                                    to={`/profile/${profile.user_id}`}
                                    className="flex items-center justify-between p-2 hover:bg-base-200 rounded"
                                    onClick={() => setIsInputFocused(false)}
                                  >
                                    <div className="flex items-center">
                                      <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-400" />
                                      <span className="text-sm font-body">
                                        {profile.firstName && profile.lastName
                                          ? `${profile.firstName} ${profile.lastName}`
                                          : profile.username}
                                      </span>
                                    </div>
                                    {profile.profile_picture ? (
                                      <img
                                        src={profile.profile_picture}
                                        alt={`${profile.username}'s profile`}
                                        className="w-8 h-8 rounded-full"
                                      />
                                    ) : (
                                      <UserCircleIcon className="w-8 h-8" />
                                    )}
                                  </Link>
                                ))}
                            </div>
                          )}

                          {/* Challenges Section */}
                          {searchResult.challenges.results.length > 0 && (
                            <div className="mb-4">
                              <h3 className="text-sm font-body font-medium text-base-content mb-2">
                                Challenges
                              </h3>
                              {searchResult.challenges.results
                                .slice(0, 3)
                                .map((challenge) => (
                                  <Link
                                    key={challenge._id}
                                    to={`/challenge/${challenge._id}`}
                                    className="flex items-center p-2 hover:bg-base-200 rounded"
                                    onClick={() => setIsInputFocused(false)}
                                  >
                                    <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="text-sm font-body">
                                      {challenge.challenge_name}
                                    </span>
                                  </Link>
                                ))}
                            </div>
                          )}

                          {/* No Results */}
                          {!searchResult.teams.results.length &&
                            !searchResult.profiles.results.length &&
                            !searchResult.challenges.results.length && (
                              <div className="text-center text-base-content font-body py-4">
                                No results found
                              </div>
                            )}
                        </div>
                      ) : null}
                    </div>

                    {/* See All Results Link - Always at bottom */}
                    {searchResult &&
                      (searchResult.teams.results.length > 0 ||
                        searchResult.profiles.results.length > 0 ||
                        searchResult.challenges.results.length > 0) && (
                        <div className="p-4 border-t bg-base-100">
                          <Link
                            to={`/search?q=${debouncedSearchQuery}`}
                            className="text-sm text-base-content hover:text-blue-800 block text-center font-body font-medium"
                            onClick={() => setIsInputFocused(false)}
                          >
                            See all results
                          </Link>
                        </div>
                      )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex">
            <div className="hidden lg:grid  lg:grid-flow-col lg:gap-8 lg:auto-rows-max lg:mr-[70px]">
              <Link
                to="/dashboard"
                className={
                  pathname === "/dashboard"
                    ? "btn bg-yellow rounded-full hover:bg-yellow"
                    : "flex items-center"
                }
              >
                <div
                  className={`flex items-center text-[16px] font-body font-normal ${pathname === "/" || pathname === "/dashboard" ? "text-darkgrey" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                  </svg>
                  <span className={"ml-[10px]"}>Dashboard</span>
                </div>
              </Link>
              {/* <Link
            className={
              pathname === "/chat"
                ? "btn btn-ghost bg-yellow rounded-full"
                : "flex items-center"
            }
            to="/chat"
          >
            <div
              className={`flex items-center text-[16px] font-body font-normal ${pathname === "/chat" ? "text-darkgrey" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              <span className={"ml-[10px]"}>Messages</span>
            </div>
          </Link> */}

              <Link
                className={
                  pathname === "/teams"
                    ? "btn bg-yellow rounded-full hover:bg-yellow"
                    : "flex items-center"
                }
                to="/teams"
              >
                <div
                  className={`flex items-center text-[16px] font-body font-normal ${pathname === "/teams" ? "text-darkgrey" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                      clipRule="evenodd"
                    />
                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                  </svg>
                  <span className={"ml-[10px]"}>Teams</span>
                </div>
              </Link>
            </div>

            <div ref={themeToggleRef}>
              <ThemeToggle />
            </div>

            <button
              className="btn btn-ghost btn-circle"
              onClick={() => {
                const drawer = document.getElementById(
                  "notifications-drawer",
                ) as HTMLInputElement | null;
                if (drawer) {
                  drawer.checked = !drawer.checked; // Toggle drawer
                }
              }}
            >
              <div className="indicator relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadNotifications.length > 0 && (
                  <span className="badge badge-xs badge-error indicator-item absolute top-1 right-2"></span>
                )}
              </div>
            </button>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-full h-full text-base-content" />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 z-[1] mt-3 w-52 p-2 shadow"
              >
                <li className="lg:hidden">
                  <Link
                    className={
                      pathname === "/dashboard"
                        ? "bg-yellow font-semibold py-4 my-1 text-darkgrey"
                        : "py-4 my-1 hover:bg-yellow"
                    }
                    to="/dashboard"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                      </svg>
                      <p className="text-sm font-body font-normal ml-5">
                        Dashboard
                      </p>
                    </div>
                  </Link>
                </li>
                {/* <li className="lg:hidden">
              <Link
                className={
                  pathname === "/chat"
                    ? "bg-yellow font-semibold py-4 my-1 text-darkgrey"
                    : "py-4 my-1 hover:bg-yellow"
                }
                to="/chat"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                  <p className="text-sm font-body font-normal ml-4">Messages</p>
                </div>
              </Link>
            </li> */}
                <li className="lg:hidden">
                  <Link
                    className={
                      pathname === "/teams"
                        ? "bg-yellow font-semibold py-4 my-1 text-darkgrey"
                        : "py-4 my-1 hover:bg-yellow"
                    }
                    to="/teams"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
                          clipRule="evenodd"
                        />
                        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                      </svg>
                      <p className="text-sm font-body font-normal  ml-4">
                        Teams
                      </p>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      pathname === "/profile"
                        ? "bg-yellow font-semibold py-4 my-1 text-darkgrey"
                        : "py-4 my-1 hover:bg-yellow"
                    }
                    to="/profile"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>

                      <p className="text-sm font-body font-normal  ml-4">
                        Profile
                      </p>
                    </div>
                  </Link>
                </li>
                <li>
                  <div
                    className="flex items-center py-4 bg-error hover:bg-error text-white "
                    onClick={handleLogout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                      />
                    </svg>
                    <p className="font-body ml-2 ">
                      {mutation.isPending ? "Logging out..." : "Log out"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
      {!isAuthenticated && (
        <button
          className="px-4 py-2 bg-yellow font-body font-medium rounded-[5px] text-[14px]"
          onClick={() => navigate(`/auth`)}
        >
          Get Started
        </button>
      )}
    </div>
  );
}

export default NavigationBar;
