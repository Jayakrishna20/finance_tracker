import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { subscribeToPushNotifications } from "../../utils/push";
import { Bell, X } from "lucide-react";

export const PushNotificationPrompt: React.FC = () => {
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show prompt on main route when permission is default
    if (location.pathname === "/" && "Notification" in window) {
      if (Notification.permission === "default") {
        setShowPrompt(true);
      }
    }
  }, [location.pathname]);

  const handleEnable = async () => {
    setShowPrompt(false);
    await subscribeToPushNotifications();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-80 relative flex flex-col">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={18} />
        </button>
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-green-50 align-top">
            <Bell size={24} className="text-green-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-800">Enable Notifications</h3>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Get weekly reminders to log your expenses!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleEnable}
                className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: "#10b981", color: "white" }}
              >
                Allow
              </button>
              <button
                onClick={handleDismiss}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
