const PendingRequests = () => {
  return (
    <div className="border-[1px] w-[90%] mr-auto ml-auto border-yellow mt-36 h-[44px] flex items-center">
      <div className="flex gap-[20%] justify-center items-center w-full">
        <div className="text-darkgrey text-[12px] font-bold">
          Pending Requests
        </div>
        <div className="w-[30px] h-[30px] bg-yellow rounded-full flex items-center justify-center text-darkgrey font-bold text-[12px]">
          5
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;
