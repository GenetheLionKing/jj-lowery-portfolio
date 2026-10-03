"use client";

import { ArrowIcon } from "@/components/icons";

export function PrintButton() {
  return (
    <button
      className="button button-dark"
      type="button"
      onClick={() => window.print()}
    >
      Print / save as PDF <ArrowIcon />
    </button>
  );
}
