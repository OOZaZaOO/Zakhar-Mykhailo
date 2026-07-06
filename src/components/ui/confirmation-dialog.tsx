"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmVariant = "destructive" | "default";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ConfirmVariant;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
  confirmIcon?: React.ReactNode;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  loading = false,
  onConfirm,
  children,
  confirmIcon,
}: ConfirmationDialogProps) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  async function handleConfirm() {
    await onConfirm();
  }

  const isDestructive = confirmVariant === "destructive";

  return (
    <AlertDialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <AlertDialogContent
        className={cn(
          "rounded-3xl border-[#ded5c8] bg-[#fffaf2] shadow-2xl p-6 gap-0",
          "backdrop:bg-[#1f2725]/40 backdrop:backdrop-blur-sm",
        )}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          cancelRef.current?.focus();
        }}
        onEscapeKeyDown={loading ? (e) => e.preventDefault() : undefined}
      >
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="text-xl font-semibold tracking-normal text-[#24312f]">
            {title}
          </AlertDialogTitle>
          {description ? (
            <AlertDialogDescription className="text-sm leading-6 text-[#5a6865] mt-1">
              {description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>

        {children ? (
          <div className="mb-5">{children}</div>
        ) : null}

        <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            ref={cancelRef}
            disabled={loading}
            className="rounded-full border-[#d9ceb9] bg-transparent text-[#24312f] hover:bg-[#f0e8d8]"
            asChild={false}
          >
            {cancelLabel}
          </AlertDialogCancel>

          <Button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              "rounded-full gap-2",
              isDestructive
                ? "bg-[#9a4c2f] hover:bg-[#7d3c24] text-white"
                : "bg-[#1f5f55] hover:bg-[#174a43] text-white",
            )}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : confirmIcon ? (
              confirmIcon
            ) : null}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
