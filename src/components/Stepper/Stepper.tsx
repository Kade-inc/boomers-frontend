import { useState } from "react"
import "./stepper.css"
import { TiTick } from "react-icons/ti";

function Stepper() {
    const steps = ['Customer Info', 'Shipping Info', 'Payment']
    const [currentStep, setCurrentStep] = useState(1)
    const [complete, setComplete] = useState(false)
  return (
    <>
      {/* <div className="flex justify-between w-[30%]">
        {
            steps?.map((step, i) => (
                <div key={i} className={`step-item ${currentStep === i + 1 && "active"} ${(i + 1 < currentStep || complete) && "complete"}`}>
                    <div className="step">{
                        (i + 1 < currentStep || complete) ? <TiTick size={24}/> : i + 1 }</div>
                    <p className="text-base-content"> {step}</p>
                </div>
            ))
        }
    </div> */}

{/* Vertical stepper */}
    <div className="flex flex-col justify-between w-[30%] h-[60%]">
        {
            steps?.map((step, i) => (
                <div key={i} className={`step-item ${currentStep === i + 1 && "active"} ${(i + 1 < currentStep || complete) && "complete"}`}>
                    <div className="step">{(i + 1 < currentStep || complete) ? <TiTick size={24}/> : i + 1 }</div>
                    <p className="text-base-content"> {step}</p>
                </div>
            ))
        }
    </div>
    {
     !complete && <button className="btn" onClick={() => {
        currentStep === steps.length ? setComplete(true) : setCurrentStep(prev => prev + 1)
    
    }}>{currentStep === steps.length ? "Finish" : "Next"}</button>
    }
    
    </>
  
  )
}

export default Stepper