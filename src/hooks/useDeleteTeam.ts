import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (teamId: string) => {
      const apiClient = new APIClient(`/api/teams`);
      return apiClient.deleteTeam(teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["user-teams"] }); // Assuming there's a query for user teams
      toast.success("Team deleted");
      navigate("/dashboard");
    },
  });
};

export default useDeleteTeam;
