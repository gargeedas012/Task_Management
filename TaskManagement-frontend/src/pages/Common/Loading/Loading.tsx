import { Spinner, type SpinnerProps } from "@fluentui/react-components";

interface LoadingProps extends SpinnerProps{
    message?: string;
}
export const Loading = ({
    message = "Loading...",
    ...props
}:LoadingProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "16px 20px",
        borderRadius: "10px",
        backgroundColor: "var(--bg--card)", 
        border: "1px solid var(--border-color)", 
        color: "var(--permanent-text-color)",
        fontSize: "13px",
        fontWeight: 500,
        width: "fit-content",
        margin: "20px auto",
      }}
    >
      <Spinner size="medium" {...props} />
      <span>{message}</span>
    </div>
  );
};

