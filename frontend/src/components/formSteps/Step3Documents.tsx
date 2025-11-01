import React, { useRef } from "react";
import type { FormPayload } from "../../types/form";

interface Props {
  data: Partial<FormPayload>;
  update: (patch: Partial<FormPayload>) => void;
  updateFiles: (files: File[]) => void; // new: send real File[] to parent
}

export const Step3Documents: React.FC<Props> = ({
  data,
  update,
  updateFiles,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const filesList = e.target.files;
    if (!filesList) {
      updateFiles([]); // clear
      update({ files: [] }); // clear preview metadata too
      return;
    }

    const filesArray = Array.from(filesList);

    // update parent with real File[] for submission
    updateFiles(filesArray);

    // also update client-side preview metadata if you want
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

          <div className="preview">
              {(data.files ?? []).map((f, idx) => (
                  <div key={idx} className="file-row">
                     
                      {f.originalname.match(/\.(jpg|jpeg|png|gif)$/i) && (
                          <img
                              src={URL.createObjectURL((data.filesRaw ?? [])[idx])}
                              alt={f.originalname}
                              width="100"
                              style={{ marginTop: "6px", borderRadius: "6px" }}
                          />
                      )}
                  </div>
              ))}
          </div>

    </div>
  );
};
