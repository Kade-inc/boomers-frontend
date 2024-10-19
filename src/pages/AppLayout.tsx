import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import useAuthStore from "../stores/useAuthStore";

function AppLayout() {
  const userId = useAuthStore((state) => state.userId);
  // const { data: profile } = useUser()
  // console.log("PROF: ", profile)
  // useEffect(() => {
  //   // Check if the token exists in the cookies
  //   // const token = Cookies.get('jwt');
  //   const apiClient = new APIClient();
  //   const token = apiClient.getToken()
  //   if (token) {
  //     try {
  //       const decodedToken = apiClient.decodeToken();
  //       const userId = decodedToken.aud;  // Extract user ID
  //       setUserId(userId);
  //       console.log("NS")

  //       // console.log("DATA: ", profile)
  //       // apiClient.getUserProfile()
  //     } catch (error) {
  //       console.error('Failed to decode token', error);
  //     }
  //   }
  // }, [setUserId]);

  console.log("DASH USER: ", userId);

  return (
    <>
      <NavigationBar />
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
