"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectTypes } from "./content";

type Fields = "name" | "email" | "company" | "projectType" | "message";

export function ContactForm() {
  const [projectType, setProjectType] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [reference, setReference] = useState("");
  const requestId = useRef<string | null>(null);
  const typeRef = useRef<HTMLButtonElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || "").trim();
    const payload = { name: value("name"), email: value("email"), company: value("company"), projectType, message: value("message"), website: value("website") };
    const nextErrors: Partial<Record<Fields, string>> = {};
    if (payload.name.length < 2) nextErrors.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) nextErrors.email = "Please enter a valid email address.";
    if (!projectType) nextErrors.projectType = "Please choose a project type.";
    if (payload.message.length < 10) nextErrors.message = "Tell us a little about your project (at least 10 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0] as Fields;
      if (first === "projectType") typeRef.current?.focus();
      else (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    requestId.current ??= crypto.randomUUID();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestId: requestId.current }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json() as { error?: string; reference?: string; fields?: Partial<Record<Fields, string>> };
      if (!response.ok) {
        if (result.fields) setErrors(result.fields);
        throw new Error(result.error || "Your brief could not be sent. Please try again or email us directly.");
      }
      setReference(result.reference || "");
      setStatus("success");
      form.reset();
      setProjectType("");
      requestId.current = null;
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error && error.name !== "TimeoutError" ? error.message : "The connection timed out. Your details are still here. Please try again.");
    }
  }

  const fieldError = (key: Fields) => errors[key] ? <span id={`${key}-error`} className="field-error">{errors[key]}</span> : null;

  if (status === "success") return <div className="contact-success" role="status" aria-live="polite">
    <CheckCircle2 size={40} strokeWidth={1.2}/><span className="eyebrow">BRIEF RECEIVED</span>
    <h3>A great place to start.</h3><p>Thank you. Your project brief has been received by CodeKraft.</p>
    {reference && <span className="brief-reference">Reference: {reference}</span>}
    <p className="form-note">Want to add something? Email <a href="mailto:codekraft.pvt@gmail.com">codekraft.pvt@gmail.com</a>.</p>
    <button type="button" className="text-link" onClick={() => setStatus("idle")}>Send another brief <RotateCcw size={15}/></button>
  </div>;

  return <form className="contact-form" onSubmit={submit} noValidate aria-label="Start a project" aria-busy={status === "sending"}>
    <p className="form-required-note">Fields marked * are required.</p>
    <div className="form-row">
      <div className="form-field"><label htmlFor="name">Name <span>*</span></label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}/>{fieldError("name")}</div>
      <div className="form-field"><label htmlFor="email">Email <span>*</span></label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}/>{fieldError("email")}</div>
    </div>
    <div className="form-row">
      <div className="form-field"><label htmlFor="company">Company / Organization <span className="optional">(optional)</span></label><input id="company" name="company" autoComplete="organization" maxLength={160} placeholder="Your company"/>{fieldError("company")}</div>
      <div className="form-field"><label htmlFor="projectType">Project Type <span>*</span></label>
        <Select value={projectType} onValueChange={(value) => { setProjectType(value); setErrors((prev) => ({...prev, projectType: undefined})); }}>
          <SelectTrigger id="projectType" ref={typeRef} className="project-select" aria-required="true" aria-invalid={!!errors.projectType} aria-describedby={errors.projectType ? "projectType-error" : undefined}><SelectValue placeholder="Select a project type"/></SelectTrigger>
          <SelectContent position="popper" className="project-options">{projectTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
        </Select>{fieldError("projectType")}
      </div>
    </div>
    <div className="form-field"><label htmlFor="message">Message <span>*</span></label><textarea id="message" name="message" rows={4} required minLength={10} maxLength={5000} placeholder="Tell us what you have in mind. What would you like to build?" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}/>{fieldError("message")}</div>
    <div className="form-trap" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
    <div className="form-bottom"><p className="form-note">Your details are used to respond to your project enquiry.</p><button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? <>Sending <Loader2 className="spinner" size={16}/></> : <>Start a Project <ArrowRight size={16}/></>}</button></div>
    {status === "error" && <p className="form-feedback" role="alert">{feedback} <a href="mailto:codekraft.pvt@gmail.com">Email CodeKraft</a></p>}
  </form>;
}
