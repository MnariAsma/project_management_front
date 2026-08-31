import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { removeToast } from "../../slices/toast/toastSlice";

export default function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.toast.toasts);

  if (!toasts || toasts.length === 0) return null;

  const getToastColors = (type: string) => {
    switch (type) {
      case "success":
        return {
          bg: "rgba(34, 197, 94, 0.15)",
          border: "rgba(34, 197, 94, 0.4)",
          text: "#86efac",
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          border: "rgba(239, 68, 68, 0.4)",
          text: "#fca5a5",
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          border: "rgba(245, 158, 11, 0.4)",
          text: "#fcd34d",
        };
      default:
        return {
          bg: "rgba(59, 130, 246, 0.15)",
          border: "rgba(59, 130, 246, 0.4)",
          text: "#93c5fd",
        };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
        maxWidth: "400px",
      }}
    >
      {toasts.map((toast) => {
        const colors = getToastColors(toast.type);
        return (
          <div
            key={toast.id}
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${colors.border}`,
              borderLeft: `4px solid ${colors.text}`,
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              animation: "fadeSlideUp 0.3s ease both",
            }}
          >
            <span style={{ fontSize: "14px", color: "var(--text-h)" }}>
              {toast.message}
            </span>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              style={{
                color: "var(--text-muted)",
                fontSize: "16px",
                cursor: "pointer",
                padding: "2px",
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
