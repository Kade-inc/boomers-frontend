import { MdErrorOutline } from "react-icons/md";

interface AdviceCardProps {
  advice: string | undefined;
  isPending: boolean;
  error: Error | null;
  className?: string;
  refetch: () => void;
  isRefetching: boolean;
}

const AdviceCard = ({
  className,
  advice,
  isPending,
  error,
  refetch,
  isRefetching,
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
      className={`container mx-auto gap-5 w-[90%] py-6 flex flex-col items-center justify-center bg-darkgrey border-[1px] border-white rounded-[5px] mt-2 mb-6 ${className} `}
    >
      <div className="text-center text-white text-[18px] font-semibold font-body">
        Today&apos;s advice
      </div>
      {advice && !error && (
        <>
          <div className="text-center text-white text-[14px] xl:text-[15px] font-regular font-body px-6">
            {advice}
          </div>
          <div className="flex justify-center w-[90%] bg-yellow rounded-[50px] text-center px-4 py-1 text-darkgrey text-[12px] font-medium font-body hover:underline">
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
      {!advice && error && (
        <div className="text-center text-white text-[14px] xl:text-[15px] font-regular font-body px-6">
          <MdErrorOutline className="w-10 h-10" />
          <span>No advice available</span>
        </div>
      )}
      {error && (
        <div className="text-center text-white text-[14px] xl:text-[15px] font-regular font-body px-6 flex flex-col items-center justify-center gap-2 mt-2">
          <MdErrorOutline className="w-10 h-10" />
          <p>Failed to fetch advice</p>
          <button
            className="bg-yellow text-darkgrey font-body font-medium px-6 py-2 rounded-sm text-[14px] mt-2"
            disabled={isRefetching}
            onClick={refetch}
          >
            {isRefetching ? (
              <div className="flex items-center justify-center">
                <span className="loading loading-dots loading-md text-darkgrey"></span>
              </div>
            ) : (
              <span>Refetch</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdviceCard;
