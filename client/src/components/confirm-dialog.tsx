"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "./ui";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, children, confirmLabel, busy, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    // Close when the page gets hidden by navigation
    return () => dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="m-auto w-[min(92vw,28rem)] border-[3px] border-ink bg-cream p-0 text-ink shadow-brutal-xl backdrop:bg-ink/60"
    >
      <div className="flex items-center gap-3 border-b-[3px] border-ink bg-red bg-stripes px-5 py-3">
        <span className="flex size-8 shrink-0 items-center justify-center border-2 border-ink bg-white font-display" aria-hidden>
          !
        </span>
        <h2 className="font-display text-xl uppercase">{title}</h2>
      </div>
      <div className="p-5 font-medium">{children}</div>
      <div className="flex justify-end gap-3 border-t-[3px] border-ink p-4">
        <Button color="white" onClick={onCancel} disabled={busy} autoFocus>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} disabled={busy}>
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
