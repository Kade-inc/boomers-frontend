import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useCallback, useState } from "react";
import { debounce } from "lodash-es";
import useUpdateChallenge from "../../hooks/Challenges/useUpdateChallenge";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface DescriptionFormProps {
  selectedChallengeId: string;
  teamId: string;
  description: string;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleDescriptionChange: (description: string) => void;
}

function DescriptionForm({
  goToNextStep,
  goToPreviousStep,
  selectedChallengeId,
  teamId,
  description,
  handleDescriptionChange,
}: DescriptionFormProps) {
  const [hasContent, setHasContent] = useState(false); // Track if there is content
  const updateChallengeMutation = useUpdateChallenge();

  const handleChange = (value: string) => {
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  const debouncedSave = useCallback(
    debounce((data) => {
      if (data.trim() !== "") {
        handleDescriptionChange(data);
        updateChallengeMutation.mutate({
          challengeId: selectedChallengeId,
          teamId,
          payload: {
            description: data,
          },
        });
      }
    }, 500),
    [],
  );

  return (
    <div className="">
      <h2 className="w-[75%] mb-4">
        Give a description about the challenge that will help the user
        understand the deliverables.
      </h2>
      <div>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            debouncedSave(data);
            setHasContent(data.trim() !== "");
          }}
          onReady={(editor) => {
            const initialData = editor.getData();
            setHasContent(initialData.trim() !== "");
          }}
        />
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
          disabled={!hasContent}
          className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow"
        >
          Next
        </button>
      </div>
      <div className="mt-4 flex items-center">
        <InformationCircleIcon height={26} width={26} fill="#1869A4" />
        <p className="w-[70%] ml-2 text-[14px] text-[#1869A4]">
          Your input is automatically saved as you type.
        </p>
      </div>
    </div>
  );
}

export default DescriptionForm;
