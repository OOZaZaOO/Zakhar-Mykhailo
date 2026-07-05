"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UnsavedChangesBarProps = {
  className?: string;
  formId?: string;
  isSaving?: boolean;
  onCancel: () => void;
  saveDisabled?: boolean;
};

export function UnsavedChangesBar({
  className,
  formId,
  isSaving = false,
  onCancel,
  saveDisabled = false,
}: UnsavedChangesBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-5 z-40 animate-[unsaved-bar-enter_260ms_cubic-bezier(0.16,1,0.3,1)] px-5 sm:bottom-6 sm:px-8",
        className,
      )}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#ded5c8] bg-[#fffaf2]/95 p-3 shadow-2xl shadow-[#2b2118]/15 backdrop-blur transition-transform duration-200 ease-out hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#24312f]">
            You have unsaved changes
          </p>
          <p className="text-xs font-medium text-[#66736f]">
            Save or cancel before leaving this page.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="h-10 rounded-full border-[#d9ceb9] px-5"
            disabled={isSaving}
            onClick={onCancel}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="h-10 rounded-full bg-[#1f5f55] px-5 hover:bg-[#174a43]"
            disabled={isSaving || saveDisabled}
            form={formId}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
