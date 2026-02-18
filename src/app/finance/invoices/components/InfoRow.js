"use client";

import React from "react";

/**
 * Reusable label/value row for detail dialogs.
 */
export default function InfoRow({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
