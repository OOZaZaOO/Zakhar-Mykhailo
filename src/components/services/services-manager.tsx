"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createService,
  deleteService,
  getDefaultServiceFormValues,
  getServiceFormValues,
  updateService,
  updateServiceActiveStatus,
  updateServicesSortOrder,
  validateServiceForm,
} from "@/lib/services/service";
import type {
  Service,
  ServiceFormat,
  ServiceFormValues,
} from "@/lib/services/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type ServicesManagerProps = {
  initialServices: Service[];
  specialistProfileId: string;
};

type FormMode =
  | { type: "create" }
  | { service: Service; type: "edit" };

const serviceFormats: ServiceFormat[] = ["online", "offline", "async"];

function formatPrice(amount: number, currency: string) {
  const value = amount / 100;
  return new Intl.NumberFormat("en", {
    currency,
    style: "currency",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function getFriendlyServiceError(message: string) {
  if (message.includes("violates row-level security policy")) {
    return "You do not have permission to modify this service.";
  }

  if (message.includes("services_title_check")) {
    return "Service title is required.";
  }

  if (message.includes("services_duration_minutes_check")) {
    return "Duration must be between 1 and 1440 minutes.";
  }

  if (message.includes("services_currency_check")) {
    return "Currency must be a 3-letter code.";
  }

  return message;
}

function sortServices(services: Service[]) {
  return [...services].sort((firstService, secondService) => {
    if (firstService.sort_order !== secondService.sort_order) {
      return firstService.sort_order - secondService.sort_order;
    }

    return secondService.created_at.localeCompare(firstService.created_at);
  });
}

function getNextSortOrder(services: Service[]) {
  if (services.length === 0) {
    return 0;
  }

  return Math.max(...services.map((service) => service.sort_order)) + 1;
}

export function ServicesManager({
  initialServices,
  specialistProfileId,
}: ServicesManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [formValues, setFormValues] = useState<ServiceFormValues>(
    getDefaultServiceFormValues(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [services, setServices] = useState(sortServices(initialServices));

  function openCreateForm() {
    setFormError(null);
    setFormValues(getDefaultServiceFormValues());
    setFormMode({ type: "create" });
  }

  function openEditForm(service: Service) {
    setFormError(null);
    setFormValues(getServiceFormValues(service));
    setFormMode({ service, type: "edit" });
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setFormMode(null);
    setFormError(null);
  }

  function updateFormValue<Key extends keyof ServiceFormValues>(
    key: Key,
    value: ServiceFormValues[Key],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  }

  async function handleSaveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateServiceForm(formValues);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!formMode || isSaving) {
      return;
    }

    setError(null);
    setFormError(null);
    setIsSaving(true);

    const supabase = createSupabaseBrowserClient();
    const valuesToSave =
      formMode.type === "create"
        ? { ...formValues, sortOrder: getNextSortOrder(services) }
        : formValues;
    const { data, error: saveError } =
      formMode.type === "create"
        ? await createService(supabase, specialistProfileId, valuesToSave)
        : await updateService(
            supabase,
            specialistProfileId,
            formMode.service.id,
            valuesToSave,
          );

    if (saveError) {
      setFormError(getFriendlyServiceError(saveError.message));
      setIsSaving(false);
      return;
    }

    setServices((currentServices) => {
      const nextServices =
        formMode.type === "create"
          ? [data, ...currentServices]
          : currentServices.map((service) =>
              service.id === data.id ? data : service,
            );

      return sortServices(nextServices);
    });
    setIsSaving(false);
    setFormMode(null);
  }

  async function handleToggleActive(service: Service) {
    setError(null);
    setPendingServiceId(service.id);

    const supabase = createSupabaseBrowserClient();
    const { data, error: toggleError } = await updateServiceActiveStatus(
      supabase,
      specialistProfileId,
      service.id,
      !service.is_active,
    );

    if (toggleError) {
      setError(getFriendlyServiceError(toggleError.message));
      setPendingServiceId(null);
      return;
    }

    setServices((currentServices) =>
      currentServices.map((currentService) =>
        currentService.id === data.id ? data : currentService,
      ),
    );
    setPendingServiceId(null);
  }

  function handleDeleteService(service: Service) {
    setServiceToDelete(service);
  }

  async function handleConfirmDelete() {
    if (!serviceToDelete) return;

    setError(null);
    setIsDeleting(true);
    setPendingServiceId(serviceToDelete.id);

    const supabase = createSupabaseBrowserClient();
    const { error: deleteError } = await deleteService(
      supabase,
      specialistProfileId,
      serviceToDelete.id,
    );

    if (deleteError) {
      setError(getFriendlyServiceError(deleteError.message));
      setIsDeleting(false);
      setPendingServiceId(null);
      return;
    }

    setServices((currentServices) =>
      currentServices.filter(
        (currentService) => currentService.id !== serviceToDelete.id,
      ),
    );
    setIsDeleting(false);
    setPendingServiceId(null);
    setServiceToDelete(null);
  }

  async function handleMoveService(serviceId: string, direction: "up" | "down") {
    if (isReordering) {
      return;
    }

    const sortedServices = sortServices(services);
    const currentIndex = sortedServices.findIndex(
      (service) => service.id === serviceId,
    );
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= sortedServices.length
    ) {
      return;
    }

    const reorderedServices = [...sortedServices];
    const [movedService] = reorderedServices.splice(currentIndex, 1);
    reorderedServices.splice(targetIndex, 0, movedService);

    const nextServices = reorderedServices.map((service, index) => ({
      ...service,
      sort_order: index,
    }));

    setError(null);
    setIsReordering(true);
    setPendingServiceId(serviceId);

    const supabase = createSupabaseBrowserClient();
    const { error: reorderError } = await updateServicesSortOrder(
      supabase,
      specialistProfileId,
      nextServices,
    );

    if (reorderError) {
      setError(getFriendlyServiceError(reorderError.message));
      setIsReordering(false);
      setPendingServiceId(null);
      return;
    }

    setServices(nextServices);
    setIsReordering(false);
    setPendingServiceId(null);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Services
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Bookable offers
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            Define what clients can book, how long it takes, and how it appears
            on the public profile.
          </p>
        </div>
        <Button
          className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
          onClick={openCreateForm}
          type="button"
        >
          <Plus className="size-4" />
          New service
        </Button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
          {error}
        </div>
      ) : null}

      {services.length === 0 ? (
        <Card className="mt-8 rounded-3xl border-[#ded5c8] bg-white">
          <CardContent className="p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
              Create your first service
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Start with one bookable offer
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#66736f]">
              Add a title, duration, price, and format so clients know what
              they can book.
            </p>
            <Button
              className="mt-6 rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
              onClick={openCreateForm}
              type="button"
            >
              <Plus className="size-4" />
              New service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => {
            const isPending = pendingServiceId === service.id;
            const actionsDisabled = isPending || isReordering;

            return (
              <Card
                className="rounded-3xl border-[#ded5c8] bg-white transition-shadow hover:shadow-md"
                key={service.id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="leading-7 text-[#24312f]">
                      {service.title}
                    </CardTitle>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Switch
                        aria-label={service.is_active ? "Disable service" : "Enable service"}
                        checked={service.is_active}
                        disabled={isPending}
                        onCheckedChange={() => handleToggleActive(service)}
                        className="data-[state=checked]:bg-[#1f5f55]"
                      />
                      <span
                        className={`text-xs font-medium ${
                          service.is_active ? "text-[#5d6b2f]" : "text-[#9a7060]"
                        }`}
                      >
                        {service.is_active ? "● Active" : "● Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="min-h-10 text-sm leading-6 text-[#66736f]">
                    {service.description || "No description yet."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-2xl bg-[#f7f3ec] p-3">
                      <p className="text-[#7b8884]">Duration</p>
                      <p className="mt-1 font-bold">
                        {service.duration_minutes} min
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f3ec] p-3">
                      <p className="text-[#7b8884]">Price</p>
                      <p className="mt-1 font-bold">
                        {formatPrice(service.price_amount, service.currency)}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#f7f3ec] p-3">
                      <p className="text-[#7b8884]">Format</p>
                      <p className="mt-1 font-bold capitalize">
                        {service.format}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1">
                    <button
                      aria-label="Move service up"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#5a6865] transition-colors hover:bg-[#f7f3ec] disabled:pointer-events-none disabled:opacity-35"
                      disabled={actionsDisabled || index === 0}
                      onClick={() => handleMoveService(service.id, "up")}
                      title="Move up"
                      type="button"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      aria-label="Move service down"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#5a6865] transition-colors hover:bg-[#f7f3ec] disabled:pointer-events-none disabled:opacity-35"
                      disabled={actionsDisabled || index === services.length - 1}
                      onClick={() => handleMoveService(service.id, "down")}
                      title="Move down"
                      type="button"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <button
                      aria-label="Edit service"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#1f5f55] transition-colors hover:bg-[#eef5f3] disabled:pointer-events-none disabled:opacity-40"
                      disabled={actionsDisabled}
                      onClick={() => openEditForm(service)}
                      title="Edit"
                      type="button"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      aria-label="Delete service"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#9a4c2f] transition-colors hover:bg-[#f6ddd4] disabled:pointer-events-none disabled:opacity-40"
                      disabled={actionsDisabled}
                      onClick={() => handleDeleteService(service)}
                      title="Delete"
                      type="button"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {formMode ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1f2725]/40 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl rounded-3xl border border-[#ded5c8] bg-[#fffaf2] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                  {formMode.type === "create" ? "New service" : "Edit service"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  {formMode.type === "create"
                    ? "Create a bookable offer"
                    : "Update service details"}
                </h2>
              </div>
              <Button
                className="rounded-full"
                onClick={closeForm}
                type="button"
                variant="outline"
              >
                Close
              </Button>
            </div>

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSaveService}>
              <div className="sm:col-span-2">
                <Label htmlFor="service-title">Title</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  id="service-title"
                  onChange={(event) =>
                    updateFormValue("title", event.target.value)
                  }
                  placeholder="Individual Therapy"
                  value={formValues.title}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  className="mt-2 min-h-24 rounded-xl border-[#d9ceb9]"
                  id="service-description"
                  onChange={(event) =>
                    updateFormValue("description", event.target.value)
                  }
                  placeholder="Describe what clients can expect..."
                  value={formValues.description}
                />
              </div>
              <div>
                <Label htmlFor="service-duration">Duration minutes</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  id="service-duration"
                  min={1}
                  onChange={(event) =>
                    updateFormValue(
                      "durationMinutes",
                      event.target.value === "" ? "" : Number(event.target.value),
                    )
                  }
                  placeholder="60"
                  type="number"
                  value={formValues.durationMinutes}
                />
              </div>
              <div>
                <Label htmlFor="service-price">Price amount</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  id="service-price"
                  inputMode="decimal"
                  onChange={(event) => updateFormValue("priceAmount", event.target.value)}
                  placeholder="50.00"
                  type="text"
                  value={formValues.priceAmount}
                />
              </div>
              <div>
                <Label htmlFor="service-currency">Currency</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  id="service-currency"
                  maxLength={3}
                  onChange={(event) =>
                    updateFormValue(
                      "currency",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="EUR"
                  value={formValues.currency}
                />
              </div>
              <div>
                <Label htmlFor="service-format">Format</Label>
                <select
                  className="mt-2 h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f]"
                  id="service-format"
                  onChange={(event) =>
                    updateFormValue("format", event.target.value as ServiceFormat)
                  }
                  value={formValues.format}
                >
                  {serviceFormats.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-[#24312f]">
                <input
                  checked={formValues.isActive}
                  className="size-4 accent-[#1f5f55]"
                  onChange={(event) =>
                    updateFormValue("isActive", event.target.checked)
                  }
                  type="checkbox"
                />
                Active service
              </label>

              {formError ? (
                <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f] sm:col-span-2">
                  {formError}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <Button
                  className="rounded-full"
                  disabled={isSaving}
                  onClick={closeForm}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving..." : "Save service"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmationDialog
        open={serviceToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setServiceToDelete(null);
        }}
        title="Delete service?"
        description="This action cannot be undone. The service will be permanently deleted."
        confirmLabel="Delete service"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        confirmIcon={<Trash2 className="size-4" />}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      >
        {serviceToDelete ? (
          <div className="rounded-2xl border border-[#ded5c8] bg-white p-4 space-y-3">
            <p className="font-semibold text-[#24312f] leading-6">
              {serviceToDelete.title}
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-[#f7f3ec] p-3">
                <p className="text-[#7b8884]">Duration</p>
                <p className="mt-1 font-bold">{serviceToDelete.duration_minutes} min</p>
              </div>
              <div className="rounded-xl bg-[#f7f3ec] p-3">
                <p className="text-[#7b8884]">Price</p>
                <p className="mt-1 font-bold">
                  {formatPrice(serviceToDelete.price_amount, serviceToDelete.currency)}
                </p>
              </div>
              <div className="rounded-xl bg-[#f7f3ec] p-3">
                <p className="text-[#7b8884]">Format</p>
                <p className="mt-1 font-bold capitalize">{serviceToDelete.format}</p>
              </div>
            </div>
          </div>
        ) : null}
      </ConfirmationDialog>
    </>
  );
}
