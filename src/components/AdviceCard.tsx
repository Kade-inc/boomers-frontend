interface AdviceCardProps {
  advice: string;
  isPending: boolean;
  error: Error | null;
  className?: string;
}

const AdviceCard = ({
  className,
  advice,
  isPending,
  error,
}: AdviceCardProps) => {
  if (isPending) {
    return (
      <div
        className={`container mx-auto gap-5 w-[90%] py-6 flex flex-col items-center justify-center bg-darkgrey rounded-[5px] mt-5 ${className}`}
      >
        <span className="loading loading-dots loading-lg bg-white"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`container mx-auto gap-2 w-[90%] py-6 flex flex-col items-center justify-center bg-darkgrey rounded-[5px] mt-5 ${className}`}
      >
        <div className="text-center text-white text-[16px] font-semibold font-body">
          Could not fetch advice
        </div>
        <div className="text-center text-red-500 text-[14px] font-semibold font-body px-6">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto gap-5 w-[90%] py-6 flex flex-col items-center justify-center bg-darkgrey rounded-[5px] mt-5 ${className}`}
    >
      <div className="text-center text-white text-[18px] font-semibold font-body">
        Today’s advice
      </div>
      {advice && (
        <>
          <div className="text-center text-white text-[16px] font-regular font-body px-6">
            {advice}
          </div>
          <div className="flex justify-center bg-yellow rounded-[50px] text-center px-4 py-1 text-darkgrey text-[12px] font-medium font-body hover:underline">
            <a
              href="https://api.adviceslip.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              With ❤️ From Advice Slip Json API
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default AdviceCard;
