import Modal from "react-modal";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ExtendedChallengeInterface } from "../../entities/Challenge";
import ReactECharts from "echarts-for-react";
import { ChallengeSolution } from "../../entities/ChallengeSolution";

type TeamMember = {
  _id: string;
  profile: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
};

type Team = {
  _id: string;
  members: TeamMember[];
};

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  challenge: ExtendedChallengeInterface;
  solutions: ChallengeSolution[];
  team: Team | undefined;
  commentsCount: number;
};

const ChallengeStatsModal = ({
  isOpen,
  onClose,
  challenge,
  solutions,
  team,
  commentsCount,
}: ModalTriggerProps) => {
  const option = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 11,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: solutions?.filter((s) => s.status === 2).length || 0,
            name: "Completed",
          },
          {
            value: solutions?.filter((s) => s.status === 1).length || 0,
            name: "In Progress",
          },
          {
            value:
              (team?.members.filter(
                (m: TeamMember) => m._id !== challenge?.owner_id,
              ).length || 0) - (solutions?.length || 0),
            name: "Not Started",
          },
        ],
      },
    ],
    color: ["#FFFFFF", "#F8B500", "#00989B"],
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="z-50"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30"
      >
        <div className="flex justify-end mt-4 mr-8">
          <XCircleIcon
            width={36}
            height={36}
            onClick={onClose}
            color="#D92D2D"
          />
        </div>
        {/* Add functionality for rating a challenge in the backend */}
        <div className="flex items-center justify-center h-screen ">
          <div className="rounded-lg shadow-lg bg-darkgrey font-body h-[50vh] w-[80%] px-4 pt-8 space-y-2">
            <p className="text-white font-normal">
              {challenge?.difficulty === 1 && "Easy"}
              {challenge?.difficulty === 2 && "Medium"}
              {challenge?.difficulty === 3 && "Hard"}
              {challenge?.difficulty === 4 && "Very Hard"}
              {challenge?.difficulty === 5 && "Legendary"}
            </p>
            <div className="flex items-center mb-6">
              <p className="text-white font-normal mr-4">Comments</p>
              <p className="bg-white rounded-full text-darkgrey w-8 h-8 flex justify-center items-center pl-0.2">
                {commentsCount}
              </p>
            </div>
            <div className="flex justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFFFFF]"></div>
                <span className="text-white text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2 ">
                <div className="w-3 h-3 rounded-full bg-[#F8B500]"></div>
                <span className="text-white text-sm">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00989B]"></div>
                <span className="text-white text-sm">Not Started</span>
              </div>
            </div>
            <div className="w-[60%] mx-auto">
              <ReactECharts option={option} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChallengeStatsModal;
