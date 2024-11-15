import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Team from "../../entities/Team";

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: string;
}
interface PreviewProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  team: Team | undefined;
  challengeNameItems: ChallengeNameItems;
  description: string;
  isPending: boolean;
}

function Preview({
  goToNextStep,
  goToPreviousStep,
  team,
  challengeNameItems,
  description,
  isPending,
}: PreviewProps) {
  const handleChange = (value: string) => {
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  return (
    <>
      <div>
        <div className="relative">
          <div className="absolute bottom-0 top-8 left-3 transform -translate-x-1/2 w-6 h-[6px] bg-[#1869A4] rounded "></div>
          <p className="font-bold text-[24px] text-[#1869A4]">Preview</p>
        </div>
        <p className="mt-8 mb-2 text-[16px]">Team name</p>
        <p className="bg-base-200 px-4 py-4 font-normal text-[16px] rounded-sm shadow-lg">
          {team?.name}
        </p>
        <p className="mt-8 mb-2 text-[16px]">Challenge name</p>
        <p className="bg-base-200 px-4 py-4 font-normal text-[16px] rounded-sm shadow-lg">
          {challengeNameItems.challenge_name}
        </p>
        <p className="mt-8 mb-2 text-[16px]">Due Date</p>
        <p className="bg-base-200 px-4 py-4 font-normal text-[16px] rounded-sm shadow-lg">
          {formatDate(challengeNameItems.due_date)}
        </p>
        <p className="mt-8 mb-2 text-[16px]">Difficulty</p>
        <p className="bg-base-200 px-4 py-4 font-normal text-[16px] rounded-sm shadow-lg">
          <span>{challengeNameItems.difficulty === "1" && "Easy"}</span>
          <span>{challengeNameItems.difficulty === "2" && "Medium"}</span>
          <span>{challengeNameItems.difficulty === "3" && "Hard"}</span>
          <span>{challengeNameItems.difficulty === "4" && "Very Hard"}</span>
          <span>{challengeNameItems.difficulty === "5" && "Legendary"}</span>
        </p>
        <p className="mt-8 mb-2 text-[16px]">Description</p>
        <div className="text-darkgrey">
          <CKEditor
            editor={ClassicEditor}
            data={description}
            disabled={true}
            config={{
              toolbar: [],
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => handleChange("previous")}
          className="btn px-12  mr-2 bg-black rounded disabled:opacity-50 font-normal text-white text-[16px] hover:bg-black border-none"
        >
          Previous
        </button>
        <button
          onClick={() => handleChange("next")}
          disabled={isPending}
          className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow"
        >
          {!isPending && <span>Create</span>}
          {isPending && (
            <span className="loading loading-dots loading-md"></span>
          )}
        </button>
      </div>
    </>
  );
}

export default Preview;
