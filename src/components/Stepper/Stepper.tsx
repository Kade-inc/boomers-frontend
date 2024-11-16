import { TiTick } from "react-icons/ti";

interface Step {
  name: string;
  complete: boolean;
}
interface StepperProps {
  steps: Step[];
  currentStep: number;
  lineHeight?: number;
}
const Stepper = ({ steps, currentStep, lineHeight = 10 }: StepperProps) => {
  return (
    <>
      <div className="hidden md:flex justify-between w-full md:flex-col items-start">
        {steps.map((step: Step, index: number) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start"
          >
            <div className="hidden md:flex flex-col items-center ">
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full 
              ${index < currentStep && step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index === currentStep - 1 && !step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index > currentStep - 1 && "bg-gray-300 text-gray-600"}`}
              >
                {index < currentStep && step.complete ? (
                  <TiTick size={24} />
                ) : (
                  index + 1
                )}
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className="md:w-[3px] md:h-10  h-[3px] md:my-1 mx-2 bg-gray-300"
                  style={{ height: `${lineHeight}px` }}
                >
                  {index < currentStep - 1 && (
                    <div className="h-full bg-[#4AC565]" />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center md:hidden bg-red shadow-lg">
              <div
                className={`flex items-center justify-center w-8 h-2
              ${index < currentStep && step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index === currentStep - 1 && !step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index > currentStep - 1 && "bg-gray-300 text-gray-600"}`}
              ></div>
            </div>

            {/* Step label */}
            <div className="lg:ml-4 hidden md:block">
              <p
                className={`font-normal ${index < currentStep ? "text-base-content" : "text-gray-400"}`}
              >
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:hidden bg-base-200 px-2 pt-4 pb-2 shadow-md rounded-sm">
        <div className="flex justify-between">
          {steps.map((step: Step, index: number) => (
            <div key={index} className="">
              <div
                className={`w-20 h-1
              ${index < currentStep && step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index === currentStep - 1 && !step.complete ? "bg-[#4AC565] text-white" : ""}
              ${index > currentStep - 1 && "bg-gray-300 text-gray-600"}`}
              ></div>
            </div>
          ))}
        </div>
        <p className="font-normal text-[14px] mt-2">
          Step {currentStep}/4:{" "}
          <span className="font-semibold">{steps[currentStep - 1].name}</span>
        </p>
      </div>
    </>
  );
};

export default Stepper;
