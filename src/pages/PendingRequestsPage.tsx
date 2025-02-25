import { Link } from "react-router-dom";

const PendingRequestsPage = () => {
  return (
    <div className=" h-screen bg-base-100 px-10 pt-10">
      <div className="">
        <p>
          <Link to="/">Dashboard</Link> &gt; Requests
        </p>
      </div>
      <p>Pending Requests</p>
      <div>
        <p>Pending your action</p>
        <div className="border-[1px] border-yellow w-[82px]">Expand</div>
      </div>
    </div>
  );
};

export default PendingRequestsPage;
