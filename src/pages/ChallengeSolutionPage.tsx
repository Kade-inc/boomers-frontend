import React from "react";
import { Link, useParams } from "react-router-dom";
import useGetSolution from "../hooks/ChallengeSolution/useGetSolution";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const ChallengeSolutionPage = () => {
  const { challengeId, solutionId } = useParams();
  const {
    data: solution,
    isLoading: solutionIsLoading,
    error: solutionError,
  } = useGetSolution(challengeId!, solutionId!);
  console.log(solution);

  if (solutionIsLoading) return <div>Loading...</div>;

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
      <div className="flex justify-between gap-10">
        <div className="text-darkgrey w-[45%]">
          <p className="mb-4">Description</p>
          <div className=" h-[70vh] overflow-scroll">
            <CKEditor
              editor={ClassicEditor}
              data={solution?.challenge.description}
              disabled={true}
              config={{
                toolbar: [],
              }}
            />
          </div>
        </div>
        <div className="w-[45%]">
          <p>Steps</p>
          <p>dsodosfjdsfoijdsfidfsoindsf</p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSolutionPage;
