import React from "react";
import IconSvg from "@/components/features/notify/IconSvg";

function NotificationItem({ title, description, icon, color, time, isNew, className = "" }) {
  return (
    <div className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`${color} mt-1`}>{icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-800">{title}</h3>
            {isNew && (
              <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">Mới</span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          {time && <p className="text-xs text-gray-500 mt-1">{time}</p>}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
