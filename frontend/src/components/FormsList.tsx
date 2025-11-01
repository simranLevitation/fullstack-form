import React from "react";
import { useFormsQuery, FormListItem } from "../hooks/useFormsQuery";

function fileDataUrl(file: { data?: string; mimeType?: string } | undefined): string | null {
    if (!file?.data) return null;
    const mime = file.mimeType ?? "application/octet-stream";
    return `data:${mime};base64,${file.data}`;
}

export const FormsList: React.FC = () => {
    const { data: forms, isLoading, isError, error } = useFormsQuery();

    if (isLoading) return <div>Loading submissions...</div>;
    if (isError) return <div style={{ color: "red" }}>Error: {error.message}</div>;

    return (
        <div className="forms-list" style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
            <h2>Submitted Forms ({forms?.length ?? 0})</h2>

            <div style={{ display: "grid", gap: 12 }}>
                {(forms ?? []).map((f: FormListItem) => (
                    <div key={f._id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <strong>{f.firstName} {f.lastName}</strong>
                                <div style={{ fontSize: 13, color: "#666" }}>{f.email} {f.phone ? `• ${f.phone}` : ""}</div>
                                <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
                                    {f.address?.line1}, {f.address?.city}, {f.address?.state} — {f.address?.zip}
                                </div>
                            </div>
                            <div style={{ textAlign: "right", fontSize: 12, color: "#999" }}>
                                {f.createdAt ? new Date(f.createdAt).toLocaleString() : null}
                            </div>
                        </div>

                        <div style={{ marginTop: 10 }}>
                            <strong>Files:</strong>
                            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                {(f.files ?? []).map((file, idx) => {
                                    const dataUrl = fileDataUrl(file);
                                    const isImage = (file.mimeType ?? "").startsWith("image");
                                    return (
                                        <div key={idx} style={{ width: 120, textAlign: "center" }}>
                                            {isImage && dataUrl ? (
                                                <img
                                                    src={dataUrl}
                                                    alt={file.originalname}
                                                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd" }}
                                                />
                                            ) : (
                                                <div style={{ width: 120, height: 80, display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ddd", borderRadius: 6 }}>
                                                    <span style={{ fontSize: 12 }}>{file.originalname.split(".").pop()?.toUpperCase() ?? "FILE"}</span>
                                                </div>
                                            )}

                                            {dataUrl ? (
                                                <a
                                                    href={dataUrl}
                                                    download={file.filename ?? file.originalname}
                                                    style={{ display: "block", marginTop: 6, fontSize: 12 }}
                                                >
                                                    Download
                                                </a>
                                            ) : (
                                                <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>{file.filename ?? file.originalname}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
