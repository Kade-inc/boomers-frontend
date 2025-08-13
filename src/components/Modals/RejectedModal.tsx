import JoinRequest from "../../entities/JoinRequest";
interface RejectedModalProps {
  selectedRejectRequest: JoinRequest | null;
}

const RejectedModal = ({ selectedRejectRequest }: RejectedModalProps) => {
  return (
    <dialog id="my_modal_15" className="modal modal-middle font-body">
      <div
        className="modal-box !p-0 !overflow-y-auto !overflow-x-hidden !rounded-md"
        style={{ borderRadius: "0px" }}
      >
        <form method="dialog" className="ml-[90%] mt-3">
          <button className="text-darkgrey font-semibold">X</button>
        </form>
        <div className="p-4">
          <h3 className="py-2 text-[16px] font-semibold">
            The reason for your rejection is:
          </h3>
          <p className="mb-3">{selectedRejectRequest?.comment}</p>
        </div>
      </div>
    </dialog>
  );
};

export default RejectedModal;
