import { useState } from "react";
import {
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";

import { FloatingCard } from "../components/FloatingCard";
import { Eyebrow } from "../components/ui";
import { SOCIAL_ITEMS } from "../data/portfolioData";

export function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [socialPing, setSocialPing] = useState("");
  const email = "krakenari@onionmail.org";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const openSocial = async (label: string, href: string) => {
    if (href && href !== "#") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      await navigator.clipboard.writeText(label);
      setSocialPing(`${label} label copied`);
      window.setTimeout(() => setSocialPing(""), 1600);
    } catch {
      setSocialPing(`${label} link coming soon`);
      window.setTimeout(() => setSocialPing(""), 1600);
    }
  };

  return (
    <div className="page-canvas page-canvas--contact">
      <FloatingCard top="18%" left="10%" width={460} mountDelay={60} className="action-card">
        <Eyebrow>Contact</Eyebrow>
        <h2 className="glow-text text-3xl md:text-4xl font-extrabold text-bone leading-tight mb-6">
          Have a project in mind?
        </h2>
        <button onClick={handleCopy} className="email-btn cursor-hover no-drag">
          {copied ? "Email copied" : email}
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <p className="contact-hint">The email button copies the address. Social links open in a new tab when available.</p>
      </FloatingCard>

      <FloatingCard top="14%" right="9%" width={260} mountDelay={200} className="action-card">
        <Eyebrow>Social</Eyebrow>
        <div className="flex items-center gap-3">
          {SOCIAL_ITEMS.map(({ key, label, href }) => {
            const Icon = key === "github" ? Github : key === "linkedin" ? Linkedin : key === "x" ? Twitter : Mail;
            return (
              <button
                key={key}
                type="button"
                aria-label={label}
                className="social-btn cursor-hover no-drag"
                onClick={() => openSocial(label, href)}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        <div className={`social-ping ${socialPing ? "show" : ""}`}>
          {socialPing || "click an icon"}
        </div>
      </FloatingCard>

      <FloatingCard bottom="14%" left="14%" width={320} mountDelay={340} className="action-card location-card">
        <p className="text-2xs tracking-widest uppercase text-slate font-semibold mt-1">
          © 2026 krakenari
        </p>
        <button type="button" className="card-link-strip cursor-hover no-drag" onClick={handleCopy}>
          Copy the email address again <Copy size={13} />
        </button>
      </FloatingCard>
    </div>
  );
}
