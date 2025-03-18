import { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Link } from "react-router-dom";

const PendingRequestsPage = () => {
  const [expandAction, setExpandAction] = useState(true);
  const [expandApproval, setExpandApproval] = useState(true);
  const [expandRequest, setExpandRequest] = useState(true);
  return (
    <div className=" h-screen bg-base-100 px-10 pt-10 font-body">
      <div className="text-[20px] font-semibold mb-[50px]">
        <p>
          <Link to="/">Dashboard</Link> &gt; Requests
        </p>
      </div>
      <p className="text-[30px] font-medium mb-[40px]">Pending Requests</p>
      <div className="flex gap-8 mb-[30px]">
        <p className="text-[18px] font-semibold">Pending your action</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandAction(!expandAction)}
        >
          {expandAction ? "Collapse" : "Expand"}
          {expandAction ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
      </div>
      {expandAction && (
        <div className="flex gap-8 mb-[50px]">
          <div className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white">
            <p className="font-semibold text-[14px] mb-6">Album cover</p>
            <div className="text-[12px] font-medium flex gap-24">
              <p>Paul Dreamer</p>
              <button className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]">
                Action
              </button>
            </div>
          </div>
          <div className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white">
            <p className="font-semibold text-[14px] mb-6">Album cover</p>
            <div className="text-[12px] font-medium flex gap-24">
              <p>Paul Dreamer</p>
              <button className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]">
                Action
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8 mb-[30px] ">
        <p className="text-[18px] font-semibold">Pending approvals</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandApproval(!expandApproval)}
        >
          {expandApproval ? "Collapse" : "Expand"}
          {expandApproval ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
      </div>
      {expandApproval && (
        <div className="flex gap-8 text-white mb-[50px]">
          <div className="w-[270px] bg-yellow h-[90px] rounded-[3px] pl-3 pt-3">
            <p className="font-semibold text-[14px] mb-7">Album cover</p>
            <div className="text-[12px] font-medium flex gap-28">
              <p className="ml-[60%]">Paul Dreamer</p>
            </div>
          </div>
          <div className="w-[270px] bg-yellow h-[90px] rounded-[3px] pl-3 pt-3">
            <p className="font-semibold text-[14px] mb-7">Album cover</p>
            <div className="text-[12px] font-medium flex gap-28">
              <p className="ml-[60%]">Paul Dreamer</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-8 mb-[30px]">
        <p className="text-[18px] font-semibold">Rejected Requests</p>
        <div
          className="border-[1px] border-yellow w-[100px] flex items-center gap-3 text-[12px] justify-center rounded-[1px] cursor-pointer"
          onClick={() => setExpandRequest(!expandRequest)}
        >
          {expandRequest ? "Collapse" : "Expand"}
          {expandRequest ? (
            <MdOutlineKeyboardArrowUp className="size-4" />
          ) : (
            <MdOutlineKeyboardArrowDown className="size-4" />
          )}
        </div>
        <button className="bg-red-600 text-white text-[14px] w-[100px] h-[25px] rounded-[3px]">
          Clear
        </button>
      </div>
      {expandRequest && (
        <div className="flex gap-8">
          <div className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white">
            <p className="font-semibold text-[14px] mb-6">Album cover</p>
            <div className="text-[12px] font-medium flex gap-24">
              <p>Paul Dreamer</p>
              <button className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]">
                Action
              </button>
            </div>
          </div>
          <div className="w-[270px] bg-[#D9436D] h-[90px] rounded-[3px] pl-3 pt-3 text-white">
            <p className="font-semibold text-[14px] mb-6">Album cover</p>
            <div className="text-[12px] font-medium flex gap-24">
              <p>Paul Dreamer</p>
              <button className="bg-yellow text-black w-[62px] h-[25px] rounded-[3px]">
                Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequestsPage;
