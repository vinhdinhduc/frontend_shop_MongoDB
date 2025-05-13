import React from "react";
import { useMouse } from "./useMouse"; // Đường dẫn đến file chứa hook

function CustomCursor() {
  const [mouse, ref] = useMouse();

  return (
    <div
      ref={ref}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: mouse.y ?? 0,
          left: mouse.x ?? 0,
          width: "20px",
          height: "20px",
          backgroundColor: "#3498db",
          borderRadius: "50%",
          pointerEvents: "none",
          transform: "translate(-50%, -50%)",
          transition: "transform 0.1s ease",
        }}
      />
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>
        Di chuyển chuột để thấy hiệu ứng
      </h1>
    </div>
  );
}

export default CustomCursor;
