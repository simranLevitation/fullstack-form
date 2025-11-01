import React, { useRef, useState } from "react";
import type { FormPayload } from "../../types/form";

interface Props {
  data: Partial<FormPayload>;
  update: (patch: Partial<FormPayload>) => void;
  updateFiles: (files: File[]) => void;
}

export const Step3Documents: React.FC<Props> = ({
  data,
  update,
  updateFiles,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>("");

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const filesList = e.target.files;
    if (!filesList) {
      updateFiles([]);
      update({ files: [] });
      setError("");
      return;
    }

    const filesArray = Array.from(filesList);

    
    const MAX_SIZE = 70 * 1024; // 70 KB in bytes
    const oversized = filesArray.find((file) => file.size > MAX_SIZE);

    if (oversized) {
      setError(`File "${oversized.name}" exceeds the 60MB limit.`);
      updateFiles([]);
      update({ files: [] });
      e.target.value = ""; 
      return;
    }

    setError("");

    updateFiles(filesArray);

    const uploaded = filesArray.map((f) => ({
      originalname: f.name,
      filename: f.name,
      path: "",
      size: f.size,
    }));

    update({ files: uploaded });
  }

  return (
    <div className="step">
      <label>
        Upload documents (max 5)
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={onFilesChange}
        />
      </label>

      {/* ✅ Show error if any */}
      {error && (
        <p style={{ color: "red", marginTop: "6px", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <div className="preview">
        {(data.files ?? []).map((f, idx) => (
          <div key={idx} className="file-row">
            {f.originalname.match(/\.(jpg|jpeg|png|gif)$/i) && (
              <img
                src={URL.createObjectURL((data.filesRaw ?? [])[idx])}
                alt={f.originalname}
                width="100"
                style={{
                  marginTop: "6px",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
              />
            )}
            <p style={{ fontSize: "13px", marginTop: "4px" }}>{f.originalname}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
