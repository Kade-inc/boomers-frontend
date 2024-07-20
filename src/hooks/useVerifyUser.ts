import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/verify");

const useVerifyUser = (accountId: string, verificationCode: string) => {
    return useQuery({
    queryKey: [accountId, verificationCode],
    queryFn: apiClient.verifyUser
})}

export default useVerifyUser;