interface ResourcesFormProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

function ResourcesForm({ goToNextStep, goToPreviousStep }: ResourcesFormProps) {
  const handleChange = (value: string) => {
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };
  return (
    <>
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
    </>
  );
}

export default ResourcesForm;
