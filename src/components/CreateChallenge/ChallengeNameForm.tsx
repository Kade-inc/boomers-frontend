import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormInputs {
  challenge_name: string;
  difficulty: number | null;
  due_date: string;
}

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: number | null;
}

interface ChallengeNameFormProps {
  challengeNameItems: ChallengeNameItems;
  handleChallengeNameChange: (values: ChallengeNameItems) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const schema = z.object({
  challenge_name: z
    .string()
    .trim()
    .min(3, "Name should have a minimum of 3 characters")
    .max(30, "Name can be a max of 30 characters"),
  difficulty: z.string(),
  due_date: z.string().nonempty("Please select a date"),
});

function ChallengeNameForm({
  challengeNameItems,
  handleChallengeNameChange,
  goToNextStep,
  goToPreviousStep,
}: ChallengeNameFormProps) {
  const {
    register,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      challenge_name: challengeNameItems.challenge_name,
      difficulty: challengeNameItems.difficulty,
      due_date: challengeNameItems.due_date,
    },
    mode: "onChange", // Triggers validation on change
  });

  const handleChange = (value: string) => {
    const allValues = getValues();
    handleChallengeNameChange(allValues);
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  return (
    <>
      <form className="w-[80%] font-body">
        <div className="mb-6">
          <label
            className="block text-base-content mb-[1%] text-[18px]"
            htmlFor="challenge_name"
          >
            Challenge Name
          </label>
          <input
            type="text"
            placeholder="Challenge Name"
            className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px] font-normal"
            style={{ backgroundColor: "transparent" }}
            {...register("challenge_name")}
            id="challenge_name"
          />
          {errors.challenge_name && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.challenge_name?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-base-content mb-[1%] text-[18px]"
            htmlFor="difficulty"
          >
            Difficulty
            {errors.difficulty && (
              <span className="text-error text-[13px] ml-[5px]">required*</span>
            )}
          </label>
          <select
            className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-100 mt-[5px] bg-transparent font-normal"
            {...register("difficulty")}
            id="difficulty"
          >
            <option value="" disabled>
              Difficulty
            </option>
            <option value="0">Easy</option>
            <option value="1">Medium</option>
            <option value="2">Hard</option>
          </select>
          {errors.difficulty && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.difficulty?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-base-content mb-[1%] text-[18px]"
            htmlFor="dueDate"
          >
            Due Date
          </label>
          <input
            type="text"
            placeholder="Due Date"
            className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px] font-normal"
            style={{ backgroundColor: "transparent" }}
            {...register("due_date")}
            id="due_date"
          />
          {errors.due_date && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.due_date?.message}
            </p>
          )}
        </div>
      </form>
      <div className="mt-4">
        <button
          onClick={() => handleChange("previous")}
          className="btn px-12  mr-2 bg-black rounded disabled:opacity-50 font-normal text-white text-[16px] hover:bg-black border-none"
        >
          Previous
        </button>
        <button
          onClick={() => handleChange("next")}
          disabled={!isValid}
          className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow"
        >
          Next
        </button>
      </div>
    </>
  );
}

export default ChallengeNameForm;
