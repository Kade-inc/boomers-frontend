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
    <div className="flex flex-col items-start">
      {steps.map((step: Step, index: number) => (
        <div key={index} className="flex items-start">
          <div className="flex flex-col items-center">
            {/* Step circle */}
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${index < currentStep && step.complete && "complete"}
                            ${index < currentStep && "bg-[#4AC565] text-white"} bg-gray-300 text-gray-600
                        `}
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
                className="w-[3px] bg-gray-300 my-1"
                style={{ height: `${lineHeight}px` }}
              >
                {index < currentStep - 1 && (
                  <div className="h-full bg-[#4AC565]" />
                )}
              </div>
            )}
          </div>

          {/* Step label */}
          <div className="ml-4">
            <p
              className={`font-normal ${index < currentStep ? "text-base-content" : "text-gray-400"}`}
            >
              {step.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
