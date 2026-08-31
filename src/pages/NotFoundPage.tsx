import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DASHBOARD } from "../routes/routes";

const NotFoundPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100svh",
                width: "100%",
                textAlign: "center",
                padding: "24px",
                background:
                    "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(108, 99, 255, 0.12) 0%, transparent 80%), var(--bg)",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "460px",
                }}
            >
                <h1
                    style={{
                        fontSize: "clamp(80px, 15vw, 130px)",
                        fontWeight: 900,
                        lineHeight: 1,
                        letterSpacing: "-2px",
                        background: "linear-gradient(135deg, #ffffff 30%, var(--accent) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        margin: "0 0 12px 0",
                        textShadow: "0 0 40px rgba(108, 99, 255, 0.25)",
                    }}
                >
                    404
                </h1>

                <p
                    style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "var(--text-h)",
                        marginBottom: "28px",
                    }}
                >
                    Oops! Page not found
                </p>

                <button
                    type="button"
                    onClick={() => navigate(DASHBOARD)}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "var(--accent)",
                        color: "#ffffff",
                        padding: "12px 24px",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: 600,
                        fontSize: "14px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 18px var(--accent-glow)",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(108, 99, 255, 0.5)";
                        e.currentTarget.style.background = "var(--accent-dark)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 18px var(--accent-glow)";
                        e.currentTarget.style.background = "var(--accent)";
                    }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "16px", height: "16px" }}
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;