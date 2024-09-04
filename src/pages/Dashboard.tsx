import AdviceCard from "../components/AdviceCard";
import ProfileCard from "../components/ProfileCard";

const Dashboard = () => {
  return (
    <>
      <div className="border-2 border-red-600 h-screen w-full px-5 pt-10 lg:flex lg:justify-between">
        <div className="border-2 border-lime-400 min-h-80 xl:w-4/5 lg:w-full md:w-full"></div>
        <div className="bg-white shadow-lg rounded min-h-80 lg:w-1/5 xl:w-1/5 xl:flex lg:flex lg:right-3 lg:top-15 hidden py-5 flex-col">
          <ProfileCard className="mb-5" />
          <AdviceCard className="" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
