import { useQuery } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const useSearchUserAndTeams = (enabled: boolean, query: string, page: number, pageSize: number) => {
    const apiClient = new APIClient();
    return useQuery({
        queryKey: ["search-users-and-teams", query, page, pageSize],
        queryFn: () => apiClient.searchUsersAndTeams(query, page, pageSize),
        enabled,
    });
};

export default useSearchUserAndTeams;