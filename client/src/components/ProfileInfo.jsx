import React from "react";

import { getInitials } from "../utils/helper.js";

const ProfileInfo = ({ handleLogout, userInfo }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-200 font-medium text-slate-900">
        {getInitials(userInfo?.username)}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm bg-slate-900 text-slate-100 p-1 rounded-md border border-transparent  hover:bg-slate-100 hover:text-slate-900 hover:border-black"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileInfo;
