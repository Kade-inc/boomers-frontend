import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/verify");

const useVerifyUser = (accountId: string | null, verificationCode: string | null) => {
    return useQuery({
    queryKey: [accountId, verificationCode],
    queryFn: () => apiClient.verifyUser(accountId, verificationCode)
})}

export default useVerifyUser;