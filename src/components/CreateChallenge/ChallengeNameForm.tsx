import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { parseISO } from "date-fns";
import { useCallback, useEffect } from "react";
import DateTimePickerWrapper from "../Wrappers/DateTimePickerWrapper";
import useUpdateChallenge from "../../hooks/Challenges/useUpdateChallenge";
import { debounce } from "lodash-es";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

interface FormInputs {
  challenge_name: string;
  difficulty: string;
  due_date: Date | null;
}

interface ChallengeNameItems {
  challenge_name: string;
  due_date: string;
  difficulty: string;
}

interface ChallengeNameFormProps {
  challengeNameItems: ChallengeNameItems;
  handleChallengeNameChange: (values: ChallengeNameItems) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  selectedChallengeId: string;
  teamId: string;
}

const schema = z.object({
  challenge_name: z
    .string()
    .trim()
    .min(3, "Name should have a minimum of 3 characters")
    .max(30, "Name can be a max of 30 characters"),
  difficulty: z.string(),
  due_date: z
    .union([z.date(), z.null()]) // Accept null values
    .refine((date) => date !== null, { message: "Please put a date" }) // Custom message for null date
    .refine((date) => date === null || date > new Date(), {
      message: "Please select a future date",
    }), // Custom message for past date
});

function ChallengeNameForm({
  challengeNameItems,
  handleChallengeNameChange,
  goToNextStep,
  goToPreviousStep,
  selectedChallengeId,
  teamId,
}: ChallengeNameFormProps) {
  const {
    register,
    control,
    formState: { errors, isValid },
    getValues,
    trigger,
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      challenge_name: challengeNameItems.challenge_name,
      difficulty: challengeNameItems.difficulty,
      due_date: challengeNameItems.due_date
        ? parseISO(challengeNameItems.due_date)
        : null, // Parse ISO string to Date
    },
    mode: "onChange", // Triggers validation on change
  });

  useEffect(() => {
    if (challengeNameItems.due_date) {
      trigger(); // Validate the form initially if due_date is preloaded
    }
  }, [challengeNameItems.due_date, trigger]);

  const handleChange = (value: string) => {
    const allValues = getValues();
    handleChallengeNameChange({
      ...allValues,
      due_date: allValues.due_date ? allValues.due_date.toISOString() : "", // Convert Date to ISO string
    });
    if (value === "previous") goToPreviousStep();
    else {
      goToNextStep();
    }
  };

  const watchedValues = useWatch({ control });
  const updateChallengeMutation = useUpdateChallenge();

  // Debounce the API call to reduce the frequency of updates
  const debouncedUpdateChallenge = useCallback(
    debounce((updatedValues: FormInputs) => {
      if (
        selectedChallengeId &&
        teamId &&
        updatedValues.challenge_name.trim() &&
        updatedValues.challenge_name.trim().length >= 3 &&
        updatedValues.challenge_name.trim().length <= 30
      ) {
        updateChallengeMutation.mutate({
          challengeId: selectedChallengeId,
          teamId,
          payload: {
            challenge_name: updatedValues.challenge_name.trim(),
            difficulty:
              updatedValues.difficulty !== "undefined"
                ? updatedValues.difficulty !== ""
                  ? Number(updatedValues.difficulty)
                  : undefined
                : undefined,
            due_date: updatedValues.due_date?.toISOString(),
          },
        });
      }
    }, 500), // Debounce delay
    [selectedChallengeId, teamId],
  );

  useEffect(() => {
    const updatedValues: FormInputs = {
      challenge_name: watchedValues.challenge_name || "",
      difficulty: watchedValues.difficulty || "",
      due_date: watchedValues.due_date
        ? parseISO(challengeNameItems.due_date)
        : null,
    };

    debouncedUpdateChallenge(updatedValues);
  }, [watchedValues, debouncedUpdateChallenge]);

  return (
    <>
      <form className="w-full md:w-[80%] font-body">
        <div className="mb-6">
          <label
            className="block text-base-content mb-[1%] text-[16px] md:text-[16px]"
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
            className="block text-base-content mb-[1%] text-[16px] md:text-[16px]"
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
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
            <option value="4">Very Hard</option>
            <option value="5">Legendary</option>
          </select>
          {errors.difficulty && (
            <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
              {errors.difficulty?.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-base-content mb-[1%] text-[16px] md:text-[16px]"
            htmlFor="dueDate"
          >
            Due Date
          </label>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <DateTimePickerWrapper
                {...field}
                onChange={(date) => {
                  field.onChange(date);
                  handleChallengeNameChange({
                    ...getValues(),
                    due_date: date ? date.toISOString() : "",
                  });
                }}
                minDate={new Date()} // Disables past dates in the picker
                format="y-MM-dd h:mm a"
                className="w-full border border-base-content border-[1px] focus:outline-none bg-transparent rounded-md mt-[5px] font-normal"
              />
            )}
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
      <div className="mt-4 flex items-center">
        <InformationCircleIcon height={26} width={26} fill="#1869A4" />
        <p className="md:w-[70%] ml-2 text-[14px] text-base-300">
          Your input is automatically saved as you type.
        </p>
      </div>
    </>
  );
}

export default ChallengeNameForm;
