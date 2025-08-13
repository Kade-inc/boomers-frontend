import Modal from "react-modal";
import useUpdateSolution from "../../hooks/ChallengeSolution/useUpdateSolution";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  solution: z.string().min(1, "Solution is required"),
  solutionUrl: z.string().url("Please enter a valid URL").optional(),
});

type FormData = z.infer<typeof schema>;

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
  solutionId: string;
  setSubmittedSolution: (submitted: boolean) => void;
};

const SubmitSolutionModal = ({
  isOpen,
  onClose,
  challengeId,
  solutionId,
  setSubmittedSolution,
}: ModalTriggerProps) => {
  const { mutate: updateSolution, isPending: updateSolutionIsPending } =
    useUpdateSolution();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmitSolution = (data: FormData) => {
    updateSolution(
      {
        challengeId: challengeId,
        solutionId: solutionId,
        payload: {
          status: 2,
          solution: data.solution || "",
          demo_url: data.solutionUrl || "",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["challenge-solution", challengeId, solutionId],
          });
          onClose();
          setSubmittedSolution(true);
        },
        onError: (error) => {
          toast.error("Solution Submission failed: " + error.message);
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg py-10 px-2 md:px-8 w-[95%] md:w-[500px]"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30 flex items-center justify-center"
      >
        <div className="absolute top-2 right-3 flex justify-end w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#D92D2D"
            className="size-8 cursor-pointer"
            onClick={onClose}
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="font-body flex flex-col items-center">
          <form
            onSubmit={handleSubmit(handleSubmitSolution)}
            className="w-full"
          >
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-2">
                Solution URL
              </label>
              <input
                {...register("solution")}
                className="w-full p-2 border rounded-md focus:outline-none  bg-base-100"
                type="text"
                placeholder="Solution URL"
              />
              {errors.solution && (
                <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-[4px] mt-2">
                  {errors.solution.message}
                </p>
              )}
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium mb-2">
                Github URL (Optional)
              </label>
              <input
                type="text"
                {...register("solutionUrl")}
                className="w-full p-2 border rounded-md focus:outline-none  transparent bg-base-100"
                placeholder="Github URL"
              />
              {errors.solutionUrl && (
                <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-[4px] mt-2">
                  {errors.solutionUrl.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn bg-yellow hover:bg-yellow text-darkgrey border-none rounded-md mt-4 w-full font-medium text-[16px]"
              disabled={updateSolutionIsPending}
            >
              {updateSolutionIsPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Submit Solution"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SubmitSolutionModal;
