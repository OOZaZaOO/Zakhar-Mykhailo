"use client";

import { ArrowDown, ArrowUp, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

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
  duplicateService,
  getDefaultServiceFormValues,
  getServiceFormValues,
  updateService,
  updateServiceActiveStatus,
  updateServicesSortOrder,
  validateServiceFormFields,
} from "@/lib/services/service";
import type {
  Service,
  ServiceFormErrors,
  ServiceFormFieldName,
  ServiceFormat,
  ServiceFormValues,
  ServiceType,
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
const serviceTypes: { label: string; value: ServiceType }[] = [
  { label: "One-time service", value: "one_time" },
  { label: "Package", value: "package" },
];
const minimumNoticeOptions = [
  { label: "None", value: "none" },
  { label: "30 minutes", value: "30" },
  { label: "1 hour", value: "60" },
  { label: "2 hours", value: "120" },
  { label: "4 hours", value: "240" },
  { label: "8 hours", value: "480" },
  { label: "12 hours", value: "720" },
  { label: "24 hours", value: "1440" },
  { label: "48 hours", value: "2880" },
];
const rescheduleNoticeOptions = [
  { label: "1 hour", value: "60" },
  { label: "2 hours", value: "120" },
  { label: "4 hours", value: "240" },
  { label: "8 hours", value: "480" },
  { label: "12 hours", value: "720" },
  { label: "24 hours", value: "1440" },
  { label: "48 hours", value: "2880" },
  { label: "72 hours", value: "4320" },
];
const cancellationNoticeOptions = [
  { label: "Anytime", value: "anytime" },
  { label: "1 hour", value: "60" },
  { label: "2 hours", value: "120" },
  { label: "4 hours", value: "240" },
  { label: "8 hours", value: "480" },
  { label: "12 hours", value: "720" },
  { label: "24 hours", value: "1440" },
  { label: "48 hours", value: "2880" },
  { label: "72 hours", value: "4320" },
];

function getScrollContainer(element: HTMLElement) {
  let currentElement = element.parentElement;

  while (currentElement) {
    const styles = window.getComputedStyle(currentElement);
    const overflowY = styles.overflowY;

    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      currentElement.scrollHeight > currentElement.clientHeight
    ) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}

function smoothScrollWithinContainer(
  container: HTMLElement,
  targetScrollTop: number,
) {
  const startScrollTop = container.scrollTop;
  const distance = targetScrollTop - startScrollTop;

  if (Math.abs(distance) < 1) {
    return () => {};
  }

  const duration = 280;
  const startTime = performance.now();
  let frameId = 0;

  const easeInOutCubic = (progress: number) =>
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    container.scrollTop = startScrollTop + distance * easedProgress;

    if (progress < 1) {
      frameId = window.requestAnimationFrame(animate);
    }
  };

  frameId = window.requestAnimationFrame(animate);

  return () => window.cancelAnimationFrame(frameId);
}

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
  if (message.includes("schema cache") || message.includes("allow_reschedule")) {
    return "The services database schema is not updated yet. Run the latest Supabase migration, then try again.";
  }

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

  if (message.includes("services_package")) {
    return "Check the package details. Monthly packages must fit within a 4-week month.";
  }

  if (message.includes("services_monthly_subscription")) {
    return "Monthly package settings must fit within a 4-week month.";
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

function getPriceHelperText(values: ServiceFormValues) {
  if (values.serviceType === "one_time") {
    return "Price for one session.";
  }

  return values.isMonthlySubscription
    ? "Monthly price for this package."
    : "Total price for the full package.";
}

function BookingRuleRow({
  children,
  description,
  label,
}: {
  children: ReactNode;
  description?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-[#f7f3ec] p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-[#24312f]">{label}</p>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-[#66736f]">{description}</p>
        ) : null}
      </div>
      <div className="sm:ml-6 sm:min-w-[180px] sm:self-center">{children}</div>
    </div>
  );
}

function getServiceBadge(service: Service) {
  if (service.is_monthly_subscription) {
    return "Monthly";
  }

  return service.service_type === "package" ? "Package" : "One-time";
}

function getServiceSummary(service: Service) {
  const price = formatPrice(service.price_amount, service.currency);
  const serviceType = service.service_type ?? "one_time";

  if (serviceType === "one_time") {
    return {
      detail: `${service.duration_minutes} min · ${service.format}`,
      priceLabel: `${price} per session`,
      stats: [
        { label: "Duration", value: `${service.duration_minutes} min` },
        { label: "Price", value: price },
        { label: "Format", value: service.format },
      ],
    };
  }

  const sessionsCount = service.sessions_count ?? 0;
  const maxSessionsPerWeek =
    service.max_sessions_per_week ?? service.sessions_per_week ?? 0;
  const perSession =
    sessionsCount > 0
      ? formatPrice(Math.round(service.price_amount / sessionsCount), service.currency)
      : price;

  return {
    detail: service.is_monthly_subscription
      ? `${sessionsCount} sessions/month · max ${maxSessionsPerWeek}/week · 4 weeks`
      : `${sessionsCount} sessions · max ${maxSessionsPerWeek}/week · 4 weeks`,
    priceLabel: service.is_monthly_subscription ? `${price}/month` : `${price} total`,
    stats: [
      {
        label: service.is_monthly_subscription ? "Monthly" : "Package",
        value: `${sessionsCount} sessions`,
      },
      { label: "Max/week", value: `${maxSessionsPerWeek}` },
      {
        label: "Per session",
        value: perSession,
      },
    ],
  };
}

export function ServicesManager({
  initialServices,
  specialistProfileId,
}: ServicesManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ServiceFormErrors>({});
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [formValues, setFormValues] = useState<ServiceFormValues>(
    getDefaultServiceFormValues(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [services, setServices] = useState(sortServices(initialServices));
  const firstAdvancedSettingRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const durationMinutesRef = useRef<HTMLInputElement | null>(null);
  const priceAmountRef = useRef<HTMLInputElement | null>(null);
  const currencyRef = useRef<HTMLInputElement | null>(null);
  const sessionsCountRef = useRef<HTMLInputElement | null>(null);
  const maxSessionsPerWeekRef = useRef<HTMLInputElement | null>(null);

  const advancedSettingsFields = new Set<ServiceFormFieldName>([]);

  function getFieldErrorClass(hasError: boolean) {
    return hasError
      ? "border-[#c85d4c] ring-1 ring-[#c85d4c] focus-visible:ring-[#c85d4c]"
      : "border-[#d9ceb9]";
  }

  function getFieldElement(field: ServiceFormFieldName) {
    switch (field) {
      case "title":
        return titleRef.current;
      case "durationMinutes":
        return durationMinutesRef.current;
      case "priceAmount":
        return priceAmountRef.current;
      case "currency":
        return currencyRef.current;
      case "sessionsCount":
        return sessionsCountRef.current;
      case "maxSessionsPerWeek":
        return maxSessionsPerWeekRef.current;
      default:
        return null;
    }
  }

  function openCreateForm() {
    setFormError(null);
    setFieldErrors({});
    setFormValues(getDefaultServiceFormValues());
    setIsAdvancedSettingsOpen(false);
    setFormMode({ type: "create" });
  }

  function openEditForm(service: Service) {
    setFormError(null);
    setFieldErrors({});
    setFormValues(getServiceFormValues(service));
    setIsAdvancedSettingsOpen(false);
    setFormMode({ service, type: "edit" });
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsAdvancedSettingsOpen(false);
    setFormMode(null);
    setFormError(null);
    setFieldErrors({});
  }

  function updateFormValue<Key extends keyof ServiceFormValues>(
    key: Key,
    value: ServiceFormValues[Key],
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));

    if (key in fieldErrors) {
      setFieldErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[key as ServiceFormFieldName];
        return nextErrors;
      });
    }
  }

  function updateServiceType(serviceType: ServiceType) {
    setFormValues((currentValues) => ({
      ...currentValues,
      isMonthlySubscription:
        serviceType === "package" ? currentValues.isMonthlySubscription : false,
      serviceType,
      sessionsCount:
        serviceType === "package" ? currentValues.sessionsCount : "",
      maxSessionsPerWeek:
        serviceType === "package" ? currentValues.maxSessionsPerWeek : "",
    }));
  }

  function updateMonthlySubscription(isMonthlySubscription: boolean) {
    setFormValues((currentValues) => ({
      ...currentValues,
      isMonthlySubscription,
    }));
  }

  useEffect(() => {
    if (!isAdvancedSettingsOpen || !firstAdvancedSettingRef.current) {
      return;
    }

    const element = firstAdvancedSettingRef.current;
    const scrollContainer = getScrollContainer(element);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let firstFrameId = 0;
    let secondFrameId = 0;
    let stopSmoothScroll = () => {};

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const containerBounds = scrollContainer
          ? scrollContainer.getBoundingClientRect()
          : { bottom: window.innerHeight, top: 0 };
        const isFullyVisible =
          bounds.top >= containerBounds.top && bounds.bottom <= containerBounds.bottom;

        if (isFullyVisible) {
          return;
        }

        if (!scrollContainer || prefersReducedMotion) {
          element.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "center",
            inline: "nearest",
          });
          return;
        }

        const elementOffsetTop = element.offsetTop;
        const targetScrollTop =
          elementOffsetTop -
          scrollContainer.clientHeight / 2 +
          element.clientHeight / 2;
        const maxScrollTop =
          scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const nextScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));

        stopSmoothScroll = smoothScrollWithinContainer(
          scrollContainer,
          nextScrollTop,
        );
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      stopSmoothScroll();
    };
  }, [isAdvancedSettingsOpen]);

  async function handleSaveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextFieldErrors = validateServiceFormFields(formValues);
    const firstErrorField = Object.keys(nextFieldErrors)[0] as
      | ServiceFormFieldName
      | undefined;

    if (firstErrorField) {
      setFieldErrors(nextFieldErrors);
      setFormError(null);

      if (advancedSettingsFields.has(firstErrorField)) {
        setIsAdvancedSettingsOpen(true);
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const firstInvalidField = getFieldElement(firstErrorField);
          firstInvalidField?.focus();
          firstInvalidField?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        });
      });
      return;
    }

    if (!formMode || isSaving) {
      return;
    }

    setError(null);
    setFormError(null);
    setFieldErrors({});
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
    setIsAdvancedSettingsOpen(false);
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

  async function handleDuplicateService(service: Service) {
    setError(null);
    setPendingServiceId(service.id);

    const supabase = createSupabaseBrowserClient();
    const { data, error: duplicateError } = await duplicateService(
      supabase,
      specialistProfileId,
      service,
      getNextSortOrder(services),
    );

    if (duplicateError) {
      setError(getFriendlyServiceError(duplicateError.message));
      setPendingServiceId(null);
      return;
    }

    setServices((currentServices) => sortServices([...currentServices, data]));
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
            const summary = getServiceSummary(service);

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
                  <span className="mt-2 inline-flex w-fit rounded-full bg-[#eef1da] px-3 py-1 text-xs font-bold text-[#59672c]">
                    {getServiceBadge(service)}
                  </span>
                  <p className="min-h-10 text-sm leading-6 text-[#66736f]">
                    {service.description || "No description yet."}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {summary.stats.map((item) => (
                      <div className="rounded-2xl bg-[#f7f3ec] p-3" key={item.label}>
                        <p className="text-[#7b8884]">{item.label}</p>
                        <p className="mt-1 font-bold capitalize">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-semibold leading-6 text-[#5a6865]">
                    {summary.priceLabel} · {summary.detail}
                  </p>

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
                      aria-label="Duplicate service"
                      className="flex size-11 cursor-pointer items-center justify-center rounded-full text-[#1f5f55] transition-colors hover:bg-[#eef5f3] disabled:pointer-events-none disabled:opacity-40"
                      disabled={actionsDisabled}
                      onClick={() => handleDuplicateService(service)}
                      title="Duplicate"
                      type="button"
                    >
                      <Copy className="size-4" />
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
                <Label>Service type</Label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {serviceTypes.map((serviceType) => (
                    <button
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        formValues.serviceType === serviceType.value
                          ? "border-[#1f5f55] bg-[#eef5f3] text-[#1f5f55]"
                          : "border-[#d9ceb9] bg-white text-[#24312f] hover:bg-[#f7f3ec]"
                      }`}
                      key={serviceType.value}
                      onClick={() => updateServiceType(serviceType.value)}
                      type="button"
                    >
                      <span className="text-sm font-bold">
                        {serviceType.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {formValues.serviceType === "package" ? (
                <div className="space-y-4 rounded-3xl border border-[#ded5c8] bg-white p-4 sm:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#24312f]">
                        Package settings
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#66736f]">
                        Set the total sessions and weekly booking limit.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-full bg-[#f7f3ec] px-4 py-3 text-sm font-semibold text-[#24312f]">
                      <input
                        checked={formValues.isMonthlySubscription}
                        className="size-4 accent-[#1f5f55]"
                        onChange={(event) =>
                          updateMonthlySubscription(event.target.checked)
                        }
                        type="checkbox"
                      />
                      Monthly subscription
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="service-sessions-count">
                        {formValues.isMonthlySubscription
                          ? "Sessions per month"
                          : "Number of sessions"}
                      </Label>
                      <Input
                        className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.sessionsCount))}`}
                        id="service-sessions-count"
                        min={formValues.isMonthlySubscription ? 1 : 2}
                        onChange={(event) =>
                          updateFormValue(
                            "sessionsCount",
                            event.target.value === ""
                              ? ""
                              : Number(event.target.value),
                          )
                        }
                        placeholder={formValues.isMonthlySubscription ? "8" : "10"}
                        ref={sessionsCountRef}
                        type="number"
                        value={formValues.sessionsCount}
                      />
                      {fieldErrors.sessionsCount ? (
                        <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                          {fieldErrors.sessionsCount}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <Label htmlFor="service-max-sessions-week">
                        Maximum sessions per week
                      </Label>
                      <Input
                        className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.maxSessionsPerWeek))}`}
                        id="service-max-sessions-week"
                        min={1}
                        onChange={(event) =>
                          updateFormValue(
                            "maxSessionsPerWeek",
                            event.target.value === ""
                              ? ""
                              : Number(event.target.value),
                          )
                        }
                        placeholder="2"
                        ref={maxSessionsPerWeekRef}
                        type="number"
                        value={formValues.maxSessionsPerWeek}
                      />
                      {fieldErrors.maxSessionsPerWeek ? (
                        <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                          {fieldErrors.maxSessionsPerWeek}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-2xl border border-dashed border-[#d9ceb9] bg-[#faf7f1] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                        Package duration
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#24312f]">
                        4 weeks
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service-package-notes">Package notes</Label>
                    <Textarea
                      className="mt-2 min-h-24 rounded-xl border-[#d9ceb9]"
                      id="service-package-notes"
                      onChange={(event) =>
                        updateFormValue("packageNotes", event.target.value)
                      }
                      placeholder="Add anything clients should know about this package."
                      value={formValues.packageNotes}
                    />
                  </div>
                </div>
              ) : null}

              <div className="sm:col-span-2">
                <Label htmlFor="service-title">Title</Label>
                <Input
                  className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.title))}`}
                  id="service-title"
                  onChange={(event) =>
                    updateFormValue("title", event.target.value)
                  }
                  placeholder="Individual Therapy"
                  ref={titleRef}
                  value={formValues.title}
                />
                {fieldErrors.title ? (
                  <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                    {fieldErrors.title}
                  </p>
                ) : null}
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
                  className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.durationMinutes))}`}
                  id="service-duration"
                  min={1}
                  onChange={(event) =>
                    updateFormValue(
                      "durationMinutes",
                      event.target.value === "" ? "" : Number(event.target.value),
                    )
                  }
                  placeholder="60"
                  ref={durationMinutesRef}
                  type="number"
                  value={formValues.durationMinutes}
                />
                {fieldErrors.durationMinutes ? (
                  <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                    {fieldErrors.durationMinutes}
                  </p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="service-price">Price amount</Label>
                <Input
                  className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.priceAmount))}`}
                  id="service-price"
                  inputMode="decimal"
                  onChange={(event) => updateFormValue("priceAmount", event.target.value)}
                  placeholder="50.00"
                  ref={priceAmountRef}
                  type="text"
                  value={formValues.priceAmount}
                />
                {fieldErrors.priceAmount ? (
                  <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                    {fieldErrors.priceAmount}
                  </p>
                ) : null}
                <p className="mt-2 text-xs font-medium text-[#66736f]">
                  {getPriceHelperText(formValues)}
                </p>
              </div>
              <div>
                <Label htmlFor="service-currency">Currency</Label>
                <Input
                  className={`mt-2 h-11 rounded-xl ${getFieldErrorClass(Boolean(fieldErrors.currency))}`}
                  id="service-currency"
                  maxLength={3}
                  onChange={(event) =>
                    updateFormValue(
                      "currency",
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="EUR"
                  ref={currencyRef}
                  value={formValues.currency}
                />
                {fieldErrors.currency ? (
                  <p className="mt-2 text-xs font-medium text-[#c85d4c]">
                    {fieldErrors.currency}
                  </p>
                ) : null}
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

              <div className="sm:col-span-2">
                <button
                  className="flex w-full items-center justify-between rounded-2xl border border-dashed border-[#d9ceb9] bg-white px-4 py-3 text-left transition-colors hover:bg-[#f7f3ec]"
                  onClick={() =>
                    setIsAdvancedSettingsOpen((currentValue) => !currentValue)
                  }
                  type="button"
                >
                  <div>
                    <p className="text-sm font-bold text-[#24312f]">
                      Advanced settings
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#66736f]">
                      Optional service options and future-ready sections.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#1f5f55]">
                    {isAdvancedSettingsOpen ? "Hide" : "Show"}
                  </span>
                </button>

                {isAdvancedSettingsOpen ? (
                  <div className="mt-4 space-y-4">
                    <Card className="rounded-3xl border-[#ded5c8] bg-white">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">Booking rules</CardTitle>
                        <p className="text-sm leading-6 text-[#66736f]">
                          Configure approval, booking limits, timing, and client
                          self-service behavior.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        <div ref={firstAdvancedSettingRef} className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                            Booking approval
                          </p>
                          <BookingRuleRow
                            description="Bookings must be manually approved before becoming confirmed."
                            label="Require specialist approval"
                          >
                            <Switch
                              checked={formValues.requireSpecialistApproval}
                              className="data-[state=checked]:bg-[#1f5f55]"
                              onCheckedChange={(checked) =>
                                updateFormValue("requireSpecialistApproval", checked)
                              }
                            />
                          </BookingRuleRow>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                            Booking limits
                          </p>
                          {formValues.serviceType === "one_time" ? (
                            <BookingRuleRow
                              description="A client can only have one active booking for this service at a time. They can book it again after the previous booking is completed or cancelled."
                              label="Limit to one booking per client"
                            >
                              <Switch
                                checked={formValues.limitOneBookingPerClient}
                                className="data-[state=checked]:bg-[#1f5f55]"
                                onCheckedChange={(checked) =>
                                  updateFormValue("limitOneBookingPerClient", checked)
                                }
                              />
                            </BookingRuleRow>
                          ) : null}
                          <BookingRuleRow
                            description="Enable a cap on how many active bookings one client can hold for this service."
                            label="Maximum active bookings per client"
                          >
                            <div className="space-y-3">
                              <div className="flex justify-end">
                                <Switch
                                  checked={formValues.limitActiveBookingsPerClient}
                                  className="data-[state=checked]:bg-[#1f5f55]"
                                  onCheckedChange={(checked) => {
                                    updateFormValue(
                                      "limitActiveBookingsPerClient",
                                      checked,
                                    );
                                    if (!checked) {
                                      updateFormValue("maxActiveBookingsPerClient", "");
                                    }
                                  }}
                                />
                              </div>
                              <Input
                                className="h-11 rounded-xl border-[#d9ceb9] bg-white disabled:bg-[#f3ede2]"
                                disabled={!formValues.limitActiveBookingsPerClient}
                                min={1}
                                onChange={(event) =>
                                  updateFormValue(
                                    "maxActiveBookingsPerClient",
                                    event.target.value === ""
                                      ? ""
                                      : Number(event.target.value),
                                  )
                                }
                                placeholder="Unlimited"
                                type="number"
                                value={formValues.maxActiveBookingsPerClient}
                              />
                            </div>
                          </BookingRuleRow>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                            Booking timing
                          </p>
                          <BookingRuleRow
                            description="Control how close to the session clients are allowed to book."
                            label="Minimum notice before booking"
                          >
                            <select
                              className="h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f]"
                              onChange={(event) =>
                                updateFormValue("minimumNoticeMinutes", event.target.value)
                              }
                              value={formValues.minimumNoticeMinutes}
                            >
                              {minimumNoticeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </BookingRuleRow>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                            Rescheduling
                          </p>
                          <BookingRuleRow
                            description="Let clients request a new time for an existing booking."
                            label="Allow client rescheduling"
                          >
                            <Switch
                              checked={formValues.allowClientRescheduling}
                              className="data-[state=checked]:bg-[#1f5f55]"
                              onCheckedChange={(checked) => {
                                updateFormValue("allowClientRescheduling", checked);
                                if (!checked) {
                                  updateFormValue(
                                    "requireSpecialistApprovalForReschedule",
                                    false,
                                  );
                                  updateFormValue("latestRescheduleMinutes", "1440");
                                }
                              }}
                            />
                          </BookingRuleRow>
                          {formValues.allowClientRescheduling ? (
                            <div className="space-y-3 rounded-2xl bg-[#f9f5ee] p-3">
                              <BookingRuleRow
                                description="Reschedule requests must be manually approved before they become final."
                                label="Require specialist approval for reschedule"
                              >
                                <Switch
                                  checked={formValues.requireSpecialistApprovalForReschedule}
                                  className="data-[state=checked]:bg-[#1f5f55]"
                                  onCheckedChange={(checked) =>
                                    updateFormValue(
                                      "requireSpecialistApprovalForReschedule",
                                      checked,
                                    )
                                  }
                                />
                              </BookingRuleRow>
                              <BookingRuleRow
                                description="Control how close to the session clients are allowed to request a change."
                                label="Latest reschedule before session"
                              >
                                <select
                                  className="h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f]"
                                  onChange={(event) =>
                                    updateFormValue(
                                      "latestRescheduleMinutes",
                                      event.target.value,
                                    )
                                  }
                                  value={formValues.latestRescheduleMinutes}
                                >
                                  {rescheduleNoticeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </BookingRuleRow>
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                            Cancellation
                          </p>
                          <BookingRuleRow
                            description="Let clients cancel their booking without contacting you first."
                            label="Allow client cancellation"
                          >
                            <Switch
                              checked={formValues.allowClientCancellation}
                              className="data-[state=checked]:bg-[#1f5f55]"
                              onCheckedChange={(checked) => {
                                updateFormValue("allowClientCancellation", checked);
                                if (!checked) {
                                  updateFormValue("latestCancellationMinutes", "anytime");
                                  updateFormValue("releaseSlotOnCancellation", true);
                                }
                              }}
                            />
                          </BookingRuleRow>
                          {formValues.allowClientCancellation ? (
                            <div className="space-y-3 rounded-2xl bg-[#f9f5ee] p-3">
                              <BookingRuleRow
                                description="Define how close to the session clients are still allowed to cancel."
                                label="Latest cancellation before session"
                              >
                                <select
                                  className="h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f]"
                                  onChange={(event) =>
                                    updateFormValue(
                                      "latestCancellationMinutes",
                                      event.target.value,
                                    )
                                  }
                                  value={formValues.latestCancellationMinutes}
                                >
                                  {cancellationNoticeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </BookingRuleRow>
                              <BookingRuleRow
                                description="Open the timeslot again automatically when a client cancels."
                                label="Automatically release the slot after cancellation"
                              >
                                <Switch
                                  checked={formValues.releaseSlotOnCancellation}
                                  className="data-[state=checked]:bg-[#1f5f55]"
                                  onCheckedChange={(checked) =>
                                    updateFormValue("releaseSlotOnCancellation", checked)
                                  }
                                />
                              </BookingRuleRow>
                              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-[#d9ceb9] bg-[#faf7f1] p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-[#24312f]">
                                    Cancellation fee
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-[#66736f]">
                                    Coming soon.
                                  </p>
                                </div>
                                <span className="rounded-full bg-[#efe6d8] px-3 py-1 text-xs font-semibold text-[#8a6d58]">
                                  Coming soon
                                </span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-[#ded5c8] bg-white">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">
                          Cancellation & rescheduling
                        </CardTitle>
                        <p className="text-sm leading-6 text-[#66736f]">
                          Configure package rescheduling and cancellation policy
                          here.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        {formValues.serviceType === "package" ? (
                          <>
                            <label className="flex items-center gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-sm font-semibold text-[#24312f]">
                              <input
                                checked={formValues.allowReschedule}
                                className="size-4 accent-[#1f5f55]"
                                onChange={(event) =>
                                  updateFormValue(
                                    "allowReschedule",
                                    event.target.checked,
                                  )
                                }
                                type="checkbox"
                              />
                              Allow rescheduling
                            </label>

                            <div>
                              <Label htmlFor="service-cancellation">
                                Cancellation policy
                              </Label>
                              <Textarea
                                className="mt-2 min-h-24 rounded-xl border-[#d9ceb9]"
                                id="service-cancellation"
                                onChange={(event) =>
                                  updateFormValue(
                                    "cancellationPolicy",
                                    event.target.value,
                                  )
                                }
                                placeholder="Clients can reschedule up to 24 hours before a session."
                                value={formValues.cancellationPolicy}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-[#d9ceb9] bg-[#faf7f1] p-4 text-sm leading-6 text-[#66736f]">
                            Cancellation and rescheduling options will be added
                            here later.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-[#ded5c8] bg-white">
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">
                          Visibility & automation
                        </CardTitle>
                        <p className="text-sm leading-6 text-[#66736f]">
                          Visibility and automation settings will be added here
                          later.
                        </p>
                      </CardHeader>
                    </Card>
                  </div>
                ) : null}
              </div>

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
