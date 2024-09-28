import { LuClock2 } from "react-icons/lu";

const ChallengesCard = () => {
  return (
    <div className="card bg-gradient-to-b from-[#313232] to-[#444c4c] text-white w-[450px] h-[200px] rounded-[3px] font-body">
      <div className="card-body flex flex-col justify-between h-full">
        <div className="flex justify-between w-full items-center">
          <h2 className="font-medium">Caregiver app</h2>
          <p className="text-right text-[12px]">Owner</p>
        </div>

        <div className="flex justify-between w-full mt-auto">
          <div className="flex-grow text-[12px]">
            <div>
              <h2>Paul and the Funky bunch</h2>
            </div>
            <div>Easy</div>
          </div>
          <div className="flex items-end">
            <h2 className="flex items-center text-center text-[12px] gap-x-2">
              <LuClock2 /> 10 days left
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengesCard;
