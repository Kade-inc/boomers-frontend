const Dashboard = () => {
  return (
    <>
      <div className="border-2 border-red-600 h-screen w-full px-5 pt-10 lg:flex lg:justify-between">
        <div className="border-2 border-lime-400 min-h-80 xl:w-4/5 lg:w-full md:w-full"></div>
        <div className="border-2 border-lime-400 h-80 lg:w-1/5 xl:w-1/5 xl:block lg:fixed lg:right-3 lg:top-15 hidden"></div>
      </div>
    </>
  );
};

export default Dashboard;
