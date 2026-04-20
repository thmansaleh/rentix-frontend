"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";

const MAX_LOCAL_DIGITS = {
  "971": 9, // UAE: +971 + 9 digits = 12 total raw
};
const DEFAULT_MAX_LOCAL = 12;

export function PhoneInputField({ value, onChange, disabled = false, className }) {
  const [dialCode, setDialCode] = useState("971");

  const handleChange = (phone, countryData) => {
    const code = countryData?.dialCode || dialCode;
    setDialCode(code);

    let cleaned = phone;

    // Strip leading zero after dial code (e.g. 9710501... → 971501...)
    if (code && cleaned.startsWith(code + "0")) {
      cleaned = code + cleaned.slice(code.length + 1);
    }

    onChange?.(cleaned);
  };

  const handleKeyDown = (e) => {
    // Always allow control keys
    const allowedKeys = [
      "Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight",
      "ArrowUp", "ArrowDown", "Home", "End",
    ];
    if (allowedKeys.includes(e.key)) return;
    // Only block digit keys — let anything else through
    if (!/^\d$/.test(e.key)) return;

    // Count raw digits currently in the input
    const currentRaw = e.target.value.replace(/\D/g, "");
    const max = dialCode.length + (MAX_LOCAL_DIGITS[dialCode] ?? DEFAULT_MAX_LOCAL);
    if (currentRaw.length >= max) {
      e.preventDefault();
    }
  };

  return (
    <div dir="ltr" className={cn("phone-input-wrapper", className)}>
      <PhoneInput
        country="ae"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        enableSearch
        searchPlaceholder="Search country..."
        countryCodeEditable={false}
        inputProps={{
          name: "phone",
          autoComplete: "tel",
          onKeyDown: handleKeyDown,
        }}
        containerClass="phone-input-container"
        inputClass="phone-input-field"
        buttonClass="phone-input-button"
        dropdownClass="phone-input-dropdown"
        searchClass="phone-input-search"
      />
    </div>
  );
}
