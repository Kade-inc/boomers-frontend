import { Link, useNavigate } from "react-router-dom";
import useRecommendationStore from "../stores/useRecommendationStore";
import Team from "../entities/Team";
import TeamCard from "../components/TeamCard";
import { useEffect, useState } from "react";
import RecommendationsModal from "../components/Modals/RecommendationsModal";

function RecommendationsPage() {
  const { recommendations } = useRecommendationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!recommendations || recommendations.length === 0) {
      navigate("/");
    }
  }, [recommendations]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<Team | null>(null);

  const openModal = (team: Team) => {
    setIsModalOpen(true);
    setSelectedRecommendation(team);
  };
  const closeModal = () => setIsModalOpen(false);

  if (!recommendations || recommendations.length === 0) {
    return <></>;
  }
  return (
    <div className="h-screen px-5 md:px-10 font-body font-medium bg-base-100 text-base-content">
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <Link to="/" className="hover:text-underline">
              Dashboard
            </Link>
          </li>
          <li>Recommendations</li>
        </ul>
      </div>
      <h2 className="font-body font-semibold text-base-content mt-10 text-[18px]">
        Recommendations based on your profile
      </h2>
      <div className="grid grid-cols-1 gap-12 mt-10 w-full md:w-[80%] md:grid-cols-3">
        {recommendations.map((team: Team) => {
          return (
            <TeamCard
              key={team._id}
              team={team}
              section=""
              styles="h-[120px] md:h-[200px]"
              onClick={() => openModal(team)}
            />
          );
        })}
      </div>
      {selectedRecommendation !== null && (
        <RecommendationsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modalData={selectedRecommendation}
        />
      )}
    </div>
  );
}

export default RecommendationsPage;
