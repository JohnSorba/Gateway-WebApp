import { PiWarningCircleFill } from "react-icons/pi";

import PropTypes from "prop-types";

function ConfirmDelete({ item, onCancel, onDelete }) {
  return (
    <>
      {" "}
      <div className="modal-backdrop"></div>
      <div className="modal flex flex-col items-center">
        <div className="flex gap-4 items-start">
          <PiWarningCircleFill className="h-12 w-12 text-red-600" />
          <div>
            <p className="font-semibold text-lg">
              Are you sure you want to delete this {item}?
            </p>
            <p className="text-sm btn-danger mb-8">
              Upon deletion, you will lose access to all data related to this{" "}
              {item}.
            </p>
          </div>
        </div>

        <footer className="flex gap-4">
          <button className="bg-green-500" onClick={onCancel}>
            Deny
          </button>
          <button className="bg-red-500" onClick={onDelete}>
            Confirm
          </button>
        </footer>
      </div>
    </>
  );
}

ConfirmDelete.propTypes = {
  item: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ConfirmDelete;
