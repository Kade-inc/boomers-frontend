interface DescriptionFormProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

function DescriptionForm({
  goToNextStep,
  goToPreviousStep,
}: DescriptionFormProps) {
  const handleChange = (value: string) => {
    // const allValues = getValues();
    // handleChallengeNameChange(allValues);
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  return (
    <div>
      <div className="mt-4">
        <button
          onClick={() => handleChange("previous")}
          className="btn px-12  mr-2 bg-black rounded disabled:opacity-50 font-normal text-white text-[16px] hover:bg-black border-none"
        >
          Previous
        </button>
        <button
          onClick={() => handleChange("next")}
          disabled={true}
          className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DescriptionForm;
