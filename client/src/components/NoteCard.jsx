import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  isPinned,
  handlePin,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="border rounded p-4 bg-white shadow-md hover:shadow-xl transition-all ease-in-out flex flex-col">
      <div className="flex items-center justify-between ">
        <div className="w-[calc(100%-2rem)]">
          <h6 className="text-sm font-medium break-words truncate ">{title}</h6>

          <span className="text-xs text-green-700">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          onClick={handlePin}
          className={`icon-btn ${
            isPinned ? "text-[#2B85FF]" : "text-slate-300"
          } ml-2`}
        />
      </div>
      <p className="text-xs text-slate-600 mt-2 break-words flex-grow">
        {content?.slice(0, 50)}
      </p>

      <div className="flex items-center gap-2  flex-row-reverse mt-auto">
        <MdCreate
          className="icon-btn hover:text-green-600"
          onClick={handleEdit}
        />

        <MdDelete
          className="icon-btn hover:text-red-500"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default NoteCard;
