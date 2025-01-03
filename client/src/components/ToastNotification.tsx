import React, { useEffect } from "react";

interface ToastNotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the notification after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onClose]);

  return (
    <div className={`notification notification--${type}`}>
      {message}
    </div>
  );
};

export default ToastNotification;
