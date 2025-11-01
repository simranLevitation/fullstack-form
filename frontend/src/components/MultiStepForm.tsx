import React, { useState } from "react";
import { Step1Personal } from "./formSteps/Step1Personal";
import { Step2Address } from "./formSteps/Step2Address";
import { Step3Documents } from "./formSteps/Step3Documents";
import { Step4Review } from "./formSteps/Step4Review";
import type { FormPayload, Address } from "../types/form";
import { useFormMutation } from "../hooks/useFormMutation";
import { fileToBase64 } from "../utils/fileToBase64";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3 | 4;

type FieldErrors = {
  [key: string]: string | undefined;
};

type StepErrors = {
  personal: FieldErrors;
  address: FieldErrors;
  documents: FieldErrors;
  submit?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s]{7,15}$/;
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["image/png", "image/jpeg", "application/pdf"];

export const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [isIntentionalSubmit, setIsIntentionalSubmit] = useState(false);
  const [data, setData] = useState<Partial<FormPayload>>({
    address: { line1: "", city: "", state: "", country: "", zip: "" },
    files: [],
    filesRaw: [],
  });

  const [errors, setErrors] = useState<StepErrors>({
    personal: {},
    address: {},
    documents: {},
  });
  const navigate = useNavigate();

  const mutation = useFormMutation();

  // ------- Validation helpers -------

  function validatePersonal(p: Partial<FormPayload>): FieldErrors {
    const e: FieldErrors = {};
    if (!p.firstName || String(p.firstName).trim().length === 0) {
      e.firstName = "First name is required";
    }
    if (!p.lastName || String(p.lastName).trim().length === 0) {
      e.lastName = "Last name is required";
    }
    if (!p.email || String(p.email).trim().length === 0) {
      e.email = "Email is required";
    } else if (!EMAIL_RE.test(String(p.email))) {
      e.email = "Email is not valid";
    }
    if (p.phone && String(p.phone).trim().length > 0) {
      if (!PHONE_RE.test(String(p.phone))) {
        e.phone = "Phone number looks invalid";
      }
    }
    return e;
  }

  function validateAddress(a: Partial<Address> | undefined): FieldErrors {
    const e: FieldErrors = {};
    const addr = a ?? ({} as Address);
    if (!addr.line1 || String(addr.line1).trim().length === 0) {
      e.line1 = "Address Line 1 is required";
    }
    if (!addr.city || String(addr.city).trim().length === 0) {
      e.city = "City is required";
    }
    if (!addr.state || String(addr.state).trim().length === 0) {
      e.state = "State is required";
    }
    if (!addr.country || String(addr.country).trim().length === 0) {
      e.country = "Country is required";
    }
    if (!addr.zip || String(addr.zip).trim().length === 0) {
      e.zip = "ZIP / Postal code is required";
    }
    return e;
  }

  function validateDocuments(filesRaw: File[] | undefined): FieldErrors {
    const e: FieldErrors = {};
    const arr = filesRaw ?? [];
    if (arr.length === 0) {
      e.files = "Please upload at least one document (image/pdf)";
      return e;
    }
    if (arr.length > MAX_FILES) {
      e.files = `Maximum ${MAX_FILES} files allowed`;
      return e;
    }

    for (let i = 0; i < arr.length; i += 1) {
      const f = arr[i];
      if (!ALLOWED_MIME.includes(f.type)) {
        e.files = `File "${f.name}" has unsupported type (${f.type})`;
        return e;
      }
      if (f.size > MAX_FILE_SIZE) {
        e.files = `File "${f.name}" exceeds ${Math.round(
          MAX_FILE_SIZE / 1024 / 1024
        )}MB`;
        return e;
      }
    }
    return e;
  }

  // Combined validations per step
  function validateStep(current: Step): boolean {
    if (current === 1) {
      const e = validatePersonal(data);
      setErrors((prev) => ({ ...prev, personal: e }));
      return Object.keys(e).length === 0;
    }
    if (current === 2) {
      const e = validateAddress(data.address);
      setErrors((prev) => ({ ...prev, address: e }));
      return Object.keys(e).length === 0;
    }
    if (current === 3) {
      const e = validateDocuments((data.filesRaw ?? []) as File[]);
      setErrors((prev) => ({ ...prev, documents: e }));
      return Object.keys(e).length === 0;
    }
    return true;
  }

  // ------- State update helpers -------

  const update = (patch: Partial<FormPayload>): void => {
    setData((prev) => ({ ...prev, ...patch }));
    // clear step-level errors as user types/changes
    setErrors((prev) => ({
      ...prev,
      personal: {},
      address: {},
      documents: {},
    }));
  };

  const updateFilesRaw = (files: File[]): void => {
    setData((prev) => ({ ...prev, filesRaw: files }));
    // also update metadata preview if desired
    const uploaded = files.map((f) => ({
      originalname: f.name,
      filename: f.name,
      path: "",
      size: f.size,
    }));
    setData((prev) => ({
      ...prev,
      files: uploaded,
      filesRaw: files,
    }));
  };

  // ------- Navigation controls -------

  function next(): void {
    // validate current step before moving forward
    if (validateStep(step)) {
      setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
    } else {
      // focus remains, errors displayed
      // optional: scroll into view of first error
    }
  }

  function prev(): void {
    setStep((s) => (s > 1 ? ((s - 1) as Step) : s));
  }

  // ------- Build JSON payload for submit -------

  async function buildJsonPayload(): Promise<Record<string, unknown>> {
    const addr = data.address ?? {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    };

    const filesRaw = (data.filesRaw ?? []) as File[];
    const uploadedFiles = await Promise.all(
      filesRaw.slice(0, MAX_FILES).map(async (file) => {
        const base64Data = await fileToBase64(file);
        return {
          originalname: file.name,
          filename: file.name,
          data: base64Data.split(",")[1],
          mimeType: file.type,
          size: file.size,
        };
      })
    );

    return {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      address: addr,
      files: uploadedFiles,
    };
  }

  // ------- Submit handler -------

  async function onSubmit(e?: React.FormEvent<HTMLFormElement>): Promise<void> {
    e?.preventDefault();

    // ensure last-step validation
    const personalOk = validateStep(1);
    const addressOk = validateStep(2);
    const docsOk = validateStep(3);

    if (!personalOk) {
      setStep(1);
      return;
    }
    if (!addressOk) {
      setStep(2);
      return;
    }
    if (!docsOk) {
      setStep(3);
      return;
    }

    if (isIntentionalSubmit) {
      try {
        setErrors((prev) => ({ ...prev, submit: undefined }));
        const jsonPayload = await buildJsonPayload();

        mutation.mutate(jsonPayload, {
          onError: (err: unknown) => {
            const msg =
              err instanceof Error ? err.message : "Submission failed";
            setErrors((prev) => ({ ...prev, submit: msg }));
          },
          onSuccess: () => {
            navigate("/submissions");
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to build payload";
        setErrors((prev) => ({ ...prev, submit: message }));
      } finally {
        setIsIntentionalSubmit(false);
      }
    } else {
      // move to next if not intentional submit and not last step
      if (step < 4) next();
    }
  }

  // ------- UI helpers -------

  const renderSubmitError = (): JSX.Element | null => {
    if (errors.submit) {
      return <div style={{ color: "red", marginTop: 8 }}>{errors.submit}</div>;
    }
    if (mutation.isError) {
      const msg = (mutation.error as Error).message ?? "Submission failed";
      return <div style={{ color: "red", marginTop: 8 }}>{msg}</div>;
    }
    if (mutation.isSuccess) {
      return (
        <div style={{ color: "green", marginTop: 8 }}>
          Submitted! ID: {mutation.data?.id}
        </div>
      );
    }
    return null;
  };

  // ------- Render -------

  return (
    <div className="container">
      <form
        onSubmit={onSubmit}
        className="form"
        noValidate
        aria-label="Multi step form"
      >
        <div className="steps-indicator">Step {step} / 4</div>

        {step === 1 && (
          <>
            <Step1Personal data={data} update={update} />
            {/* show personal errors */}
            <div style={{ color: "red", fontSize: 13 }}>
              {Object.values(errors.personal).map((v, i) => (
                <div key={i}>{v}</div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Step2Address data={data} update={update} />
            <div style={{ color: "red", fontSize: 13 }}>
              {Object.values(errors.address).map((v, i) => (
                <div key={i}>{v}</div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Step3Documents
              data={data}
              update={update}
              updateFiles={updateFilesRaw}
            />
            <div style={{ color: "red", fontSize: 13 }}>
              {Object.values(errors.documents).map((v, i) => (
                <div key={i}>{v}</div>
              ))}
            </div>
          </>
        )}

        {step === 4 && <Step4Review data={data} />}

        <div className="actions" style={{ marginTop: 8 }}>
          {step > 1 && (
            <button type="button" onClick={prev} disabled={step === 1}>
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
               
                if (validateStep(step)) next();
              }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setIsIntentionalSubmit(true)}
              type="submit"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>

        {renderSubmitError()}
      </form>

      <style>{`
        .container{max-width:720px;margin:0 auto;padding:16px}
        .form{display:flex;flex-direction:column;gap:12px}
        label{display:flex;flex-direction:column;gap:6px}
        input[type=text],input[type=email],input[type=tel],input[type=file] {
          padding:8px;border:1px solid #ddd;border-radius:6px; width:100%;
        }
        .actions{display:flex;gap:8px}
        @media (max-width:600px){.container{padding:8px}}
      `}</style>
    </div>
  );
};
