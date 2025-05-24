import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useGetSolution from "../hooks/ChallengeSolution/useGetSolution";
import useAddSolutionStep from "../hooks/ChallengeSolution/useAddSolutionStep";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaCheck, FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import useUpdateSolutionStep from "../hooks/ChallengeSolution/useUpdateSolutionStep";
import { TbEdit } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import useDeleteSolutionStep from "../hooks/ChallengeSolution/useDeleteSolutionStep";
import useUpdateSolution from "../hooks/ChallengeSolution/useUpdateSolution";
import { toast } from "react-hot-toast";

const ChallengeSolutionPage = () => {
  const { challengeId, solutionId } = useParams();
  const {
    data: solution,
    isLoading: solutionIsLoading,
    error: solutionError,
    refetch: refetchSolution,
  } = useGetSolution(challengeId!, solutionId!);
  const { mutate: addStep, isPending: isAddingStep } = useAddSolutionStep();
  const { mutate: updateStep } = useUpdateSolutionStep();
  const { mutate: deleteStep, isPending: isDeletingStep } =
    useDeleteSolutionStep();
  const { mutate: updateSolution, isPending: isUpdatingSolution } =
    useUpdateSolution();
  console.log(solution);

  // Step management
  const [stepInput, setStepInput] = useState("");
  const [steps, setSteps] = useState<{ _id: string; description: string }[]>(
    [],
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const [descOpen, setDescOpen] = useState(false);
  const [deletingStepIndex, setDeletingStepIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setDescOpen(true);
    }
  }, []);

  useEffect(() => {
    if (solution && Array.isArray(solution.steps)) {
      setSteps(
        solution.steps.map((step) => ({
          _id: step._id,
          description: step.description,
        })),
      );
    }
  }, [solution]);

  const handleAddStep = () => {
    if (stepInput.trim()) {
      addStep(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          description: stepInput.trim(),
        },
        {
          onSuccess: () => {
            setStepInput("");
            refetchSolution();
          },
          onError: (error) => {
            alert(error.message);
          },
        },
      );
    }
  };

  const handleDeleteStep = (index: number) => {
    setDeletingStepIndex(index);
    deleteStep(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        stepId: steps[index]._id,
      },
      {
        onSuccess: () => {
          setDeletingStepIndex(null);
          refetchSolution();
          if (editIndex === index) {
            setEditIndex(null);
            setEditValue("");
          }
        },
        onError: (error) => {
          setDeletingStepIndex(null);
          alert(error.message);
        },
      },
    );
  };

  const handleEditStep = (index: number) => {
    setEditIndex(index);
    setEditValue(steps[index].description);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null && editValue.trim() && steps[editIndex]) {
      updateStep(
        {
          challengeId: challengeId!,
          solutionId: solutionId!,
          stepId: steps[editIndex]._id,
          description: editValue.trim(),
        },
        {
          onSuccess: () => {
            setEditIndex(null);
            setEditValue("");
            refetchSolution();
          },
          onError: (error) => {
            alert(error.message);
          },
        },
      );
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue("");
  };

  const handleCommitSolution = () => {
    updateSolution(
      {
        challengeId: challengeId!,
        solutionId: solutionId!,
        payload: {
          status: 1,
        },
      },
      {
        onSuccess: () => {
          refetchSolution();
          toast.success("Solution steps added successfully");
        },
        onError: (error) => {
          alert(error.message);
        },
      },
    );
  };

  if (solutionIsLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (solutionError) return <div>Error: {solutionError.message}</div>;

  return (
    <div className="h-screen bg-base-100 px-5 md:px-10 pt-10 font-body font-semibold">
      <div>
        <Link
          to={`/challenge/${challengeId}`}
          className="text-base-content font-body hover:text-primary"
        >
          ← Back to Challenge
        </Link>
      </div>

      <div className="flex items-center justify-center mb-10">
        <h1 className="font-heading text-4xl">
          <span>{solution?.challenge.challenge_name}</span>
        </h1>
      </div>
      {solution?.status === 1 && (
        <div className="flex items-center justify-center mb-10">
          <p className="font-semibold text-base-content">Solution committed</p>
        </div>
      )}
      {solution?.status === 0 && (
        <>
          <div className="flex md:flex-row flex-col justify-between gap-10">
            <div className="text-darkgrey md:w-[45%]">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-base-content">Description</p>
                <button
                  className="text-sm text-base-content md:hidden"
                  onClick={() => setDescOpen((open) => !open)}
                >
                  {descOpen ? (
                    <span className="flex items-center gap-2">
                      Collapse <FaChevronDown />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Expand <FaChevronUp />
                    </span>
                  )}
                </button>
              </div>
              {descOpen && (
                <div className="h-[70vh] overflow-scroll">
                  <CKEditor
                    editor={ClassicEditor}
                    data={solution?.challenge.description}
                    disabled={true}
                    config={{
                      toolbar: [],
                    }}
                  />
                </div>
              )}
            </div>
            <div className="md:w-[45%]">
              <p className="mb-2 font-semibold text-base-content">Steps</p>
              {/* Steps List */}
              {steps.length > 0 && (
                <div className="flex flex-col gap-4 mb-4">
                  {steps.map((step, idx) => (
                    <div
                      key={step._id}
                      className="flex items-center justify-between bg-base-100 p-4 rounded border border-base-content/10"
                    >
                      {editIndex === idx ? (
                        <div className="flex-1 flex items-center gap-2">
                          <textarea
                            className="border rounded p-1 flex-1 focus:outline-none"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="text-green-600 font-bold"
                            onClick={handleSaveEdit}
                            title="Save"
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="text-gray-500"
                            onClick={handleCancelEdit}
                            title="Cancel"
                          >
                            <IoIosClose className="text-3xl text-base-content" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base-content w-[90%] font-medium">
                            {step.description}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              className="ml-2 text-blue-500"
                              onClick={() => handleEditStep(idx)}
                              title="Edit"
                            >
                              <TbEdit className="text-2xl text-blue-500" />
                            </button>
                            <button
                              className="ml-2 text-red-500"
                              onClick={() => handleDeleteStep(idx)}
                              title="Delete"
                              disabled={
                                isDeletingStep && deletingStepIndex === idx
                              }
                            >
                              {isDeletingStep && deletingStepIndex === idx ? (
                                <span className="loading loading-dots loading-xs"></span>
                              ) : (
                                <FaTrash className="text-lg text-red-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {/* Step Input */}
              <textarea
                className="w-full border rounded p-2 mb-2 font-medium bg-transparent focus:outline-none"
                placeholder={
                  steps.length === 0
                    ? "Type your first step here..."
                    : "Type your next step here..."
                }
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
              />
              <button
                className="bg-purple-700 text-white px-8 py-2 rounded font-medium"
                onClick={handleAddStep}
                disabled={!stepInput.trim() || isAddingStep}
              >
                {steps.length === 0 ? "Add" : "Add step"}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-yellow text-darkgrey px-8 py-2 rounded font-medium"
              disabled={isUpdatingSolution}
              onClick={handleCommitSolution}
            >
              {isUpdatingSolution ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                "Commit"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeSolutionPage;
