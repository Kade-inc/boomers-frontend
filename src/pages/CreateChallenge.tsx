import { useState } from "react";
import TeamNameForm from "../components/CreateTeam/TeamNameForm";
import Stepper from "../components/Stepper/Stepper";

function CreateChallenge() {

    const stepsArray=[
        {
          stepLabel: "Team Name",
          completed: true,
          content: <TeamNameForm />
     
        },
        {
          stepLabel: "Challenge Name",
          stepDescription: "Challenge Name",
          completed: false,
          content: <TeamNameForm />
        },
        {
          stepLabel: "Description",
          stepDescription: "Description",
          completed: false,
          content: <TeamNameForm />
        },
        {
            stepLabel: "Resources",
            stepDescription: "Resources",
            completed: false,
            content: <TeamNameForm />
          },
          {
            stepLabel: "Preview",
            stepDescription: "Preview",
            completed: false,
            content: <TeamNameForm />
          },
      ]
  
  
  return (
    <>
        <div className="h-screen px-5 md:px-10 pt-10 font-body bg-base-100 text-base-content">
            <Stepper />
        </div>
    </>
  )
}

export default CreateChallenge