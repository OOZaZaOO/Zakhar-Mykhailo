import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  ServiceFormErrors,
  ServiceFormFieldName,
  Service,
  ServiceFormValues,
  ServiceInsert,
  ServiceUpdate,
} from "@/lib/services/types";
import type { Database } from "@/lib/supabase/types";

type ServicesClient = SupabaseClient<Database>;
type ServiceMutationError = {
  code?: string;
  message?: string;
} | null;

export function getDefaultServiceFormValues(): ServiceFormValues {
  return {
    allowReschedule: true,
    allowClientCancellation: false,
    allowClientRescheduling: false,
    cancellationPolicy: "",
    latestCancellationMinutes: "anytime",
    latestRescheduleMinutes: "1440",
    currency: "EUR",
    description: "",
    durationMinutes: "",
    format: "online",
    isMonthlySubscription: false,
    isActive: true,
    limitActiveBookingsPerClient: false,
    limitOneBookingPerClient: false,
    maxActiveBookingsPerClient: "",
    maxSessionsPerWeek: "",
    minimumNoticeMinutes: "none",
    packageNotes: "",
    priceAmount: "",
    releaseSlotOnCancellation: true,
    requireSpecialistApproval: false,
    requireSpecialistApprovalForReschedule: false,
    serviceType: "one_time",
    sessionsCount: "",
    sortOrder: 0,
    title: "",
  };
}

export function getServiceFormValues(service: Service): ServiceFormValues {
  return {
    allowReschedule: service.allow_reschedule ?? true,
    allowClientCancellation: service.allow_client_cancellation ?? false,
    allowClientRescheduling: service.allow_client_rescheduling ?? false,
    cancellationPolicy: service.cancellation_policy ?? "",
    latestCancellationMinutes:
      service.latest_cancellation_minutes === null
        ? "anytime"
        : String(service.latest_cancellation_minutes),
    latestRescheduleMinutes:
      service.latest_reschedule_minutes === null
        ? "1440"
        : String(service.latest_reschedule_minutes),
    currency: service.currency,
    description: service.description,
    durationMinutes: service.duration_minutes,
    format: service.format,
    isMonthlySubscription: service.is_monthly_subscription ?? false,
    isActive: service.is_active,
    limitActiveBookingsPerClient:
      service.limit_active_bookings_per_client ?? false,
    limitOneBookingPerClient: service.limit_one_booking_per_client ?? false,
    maxActiveBookingsPerClient: service.max_active_bookings_per_client ?? "",
    maxSessionsPerWeek:
      service.max_sessions_per_week ?? service.sessions_per_week ?? "",
    minimumNoticeMinutes:
      service.minimum_notice_minutes === null
        ? "none"
        : String(service.minimum_notice_minutes),
    packageNotes: service.package_notes ?? "",
    priceAmount: service.price_amount === 0 ? "" : (service.price_amount / 100).toString(),
    releaseSlotOnCancellation: service.release_slot_on_cancellation ?? true,
    requireSpecialistApproval: service.require_specialist_approval ?? false,
    requireSpecialistApprovalForReschedule:
      service.reschedule_requires_approval ?? false,
    serviceType: service.service_type ?? "one_time",
    sessionsCount: service.sessions_count ?? "",
    sortOrder: service.sort_order,
    title: service.title,
  };
}

export function validateServiceForm(values: ServiceFormValues) {
  const fieldErrors = validateServiceFormFields(values);
  const firstErrorField = Object.keys(fieldErrors)[0] as
    | ServiceFormFieldName
    | undefined;

  if (!firstErrorField) {
    return null;
  }

  return fieldErrors[firstErrorField] ?? null;
}

export function validateServiceFormFields(
  values: ServiceFormValues,
): ServiceFormErrors {
  const fieldErrors: ServiceFormErrors = {};

  if (!values.title.trim()) {
    fieldErrors.title = "Service title is required.";
  }

  if (
    values.durationMinutes === "" ||
    values.durationMinutes <= 0 ||
    values.durationMinutes > 1440
  ) {
    fieldErrors.durationMinutes = "Duration must be between 1 and 1440 minutes.";
  }

  const parsedPrice = parseFloat(values.priceAmount.replace(",", "."));
  if (values.priceAmount === "" || isNaN(parsedPrice) || parsedPrice < 0) {
    fieldErrors.priceAmount = "Price must be a valid positive number.";
  }

  if (!/^[A-Z]{3}$/.test(values.currency.trim().toUpperCase())) {
    fieldErrors.currency = "Currency must be a 3-letter code.";
  }

  if (values.serviceType === "package") {
    const sessionsCount = values.sessionsCount;
    const maxSessionsPerWeek = values.maxSessionsPerWeek;

    if (sessionsCount === "" || sessionsCount < 1) {
      fieldErrors.sessionsCount = values.isMonthlySubscription
        ? "Monthly packages need at least one session per month."
        : "Packages need at least two sessions.";
    }

    if (sessionsCount !== "" && !Number.isInteger(sessionsCount)) {
      fieldErrors.sessionsCount = "Number of sessions must be a whole number.";
    }

    if (
      !values.isMonthlySubscription &&
      sessionsCount !== "" &&
      sessionsCount < 2
    ) {
      fieldErrors.sessionsCount = "One-off packages need at least two sessions.";
    }

    if (maxSessionsPerWeek === "" || maxSessionsPerWeek < 1) {
      fieldErrors.maxSessionsPerWeek =
        "Maximum sessions per week must be at least 1.";
    }

    if (
      maxSessionsPerWeek !== "" &&
      !Number.isInteger(maxSessionsPerWeek)
    ) {
      fieldErrors.maxSessionsPerWeek =
        "Maximum sessions per week must be a whole number.";
    }

    if (
      maxSessionsPerWeek !== "" &&
      sessionsCount !== "" &&
      maxSessionsPerWeek > sessionsCount
    ) {
      fieldErrors.maxSessionsPerWeek =
        "Maximum sessions per week cannot exceed total sessions.";
    }

    if (
      sessionsCount !== "" &&
      maxSessionsPerWeek !== "" &&
      sessionsCount > maxSessionsPerWeek * 4
    ) {
      fieldErrors.maxSessionsPerWeek =
        "Maximum sessions per week is too low for a 4-week package.";
    }
  }

  return fieldErrors;
}

function getServicePayload(values: ServiceFormValues) {
  const isPackage = values.serviceType === "package";
  const isMonthlySubscription = isPackage && values.isMonthlySubscription;
  const maxActiveBookingsPerClient =
    values.limitActiveBookingsPerClient &&
    values.maxActiveBookingsPerClient !== ""
      ? values.maxActiveBookingsPerClient
      : null;
  const minimumNoticeMinutes =
    values.minimumNoticeMinutes === "none"
      ? null
      : Number(values.minimumNoticeMinutes);
  const latestRescheduleMinutes =
    values.allowClientRescheduling && values.latestRescheduleMinutes !== ""
      ? Number(values.latestRescheduleMinutes)
      : null;
  const latestCancellationMinutes =
    values.allowClientCancellation &&
    values.latestCancellationMinutes !== "anytime"
      ? Number(values.latestCancellationMinutes)
      : null;

  return {
    allow_reschedule: isPackage ? values.allowReschedule : true,
    allow_client_cancellation: values.allowClientCancellation,
    allow_client_rescheduling: values.allowClientRescheduling,
    cancellation_policy: isPackage ? values.cancellationPolicy.trim() : "",
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    duration_minutes: values.durationMinutes === "" ? 0 : values.durationMinutes,
    format: values.format,
    is_monthly_subscription: isMonthlySubscription,
    is_active: values.isActive,
    latest_cancellation_minutes: latestCancellationMinutes,
    latest_reschedule_minutes: latestRescheduleMinutes,
    limit_active_bookings_per_client: values.limitActiveBookingsPerClient,
    limit_one_booking_per_client:
      values.serviceType === "one_time" ? values.limitOneBookingPerClient : false,
    max_active_bookings_per_client: maxActiveBookingsPerClient,
    max_sessions_per_week: isPackage
      ? values.maxSessionsPerWeek === ""
        ? null
        : values.maxSessionsPerWeek
      : null,
    minimum_notice_minutes: minimumNoticeMinutes,
    package_notes: isPackage ? values.packageNotes.trim() : "",
    package_validity_weeks: isPackage ? 4 : null,
    price_amount: values.priceAmount === "" ? 0 : Math.round(parseFloat(values.priceAmount.replace(",", ".")) * 100),
    release_slot_on_cancellation: values.releaseSlotOnCancellation,
    require_specialist_approval: values.requireSpecialistApproval,
    reschedule_requires_approval:
      values.allowClientRescheduling && values.requireSpecialistApprovalForReschedule,
    service_type: values.serviceType,
    sessions_count: isPackage
      ? values.sessionsCount === ""
        ? null
        : values.sessionsCount
      : null,
    sessions_per_week: isPackage
      ? values.maxSessionsPerWeek === ""
        ? null
        : values.maxSessionsPerWeek
      : null,
    sort_order: values.sortOrder === "" ? 0 : values.sortOrder,
    title: values.title.trim(),
  };
}

function getLegacyOneTimeServicePayload(values: ServiceFormValues) {
  return {
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    duration_minutes: values.durationMinutes === "" ? 0 : values.durationMinutes,
    format: values.format,
    is_active: values.isActive,
    price_amount:
      values.priceAmount === ""
        ? 0
        : Math.round(parseFloat(values.priceAmount.replace(",", ".")) * 100),
    sort_order: values.sortOrder === "" ? 0 : values.sortOrder,
    title: values.title.trim(),
  };
}

function isServicePackageSchemaCacheError(error: ServiceMutationError) {
  return (
    error?.code === "PGRST204" ||
    error?.message?.includes("schema cache") ||
    error?.message?.includes("allow_reschedule") ||
    error?.message?.includes("service_type") ||
    error?.message?.includes("is_monthly_subscription") ||
    error?.message?.includes("max_sessions_per_week")
  );
}

export async function getServicesForSpecialistProfile(
  supabase: ServicesClient,
  specialistProfileId: string,
) {
  return supabase
    .from("services")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
}

export async function getActiveServicesForPublicProfile(
  supabase: ServicesClient,
  specialistProfileId: string,
) {
  return supabase
    .from("services")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
}

export async function getActiveServicesForSpecialistProfile(
  supabase: ServicesClient,
  specialistProfileId: string,
) {
  return supabase
    .from("services")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
}

export function formatServicePrice(amount: number, currency: string) {
  const value = amount / 100;

  return new Intl.NumberFormat("en", {
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    style: "currency",
  }).format(value);
}

export async function createService(
  supabase: ServicesClient,
  specialistProfileId: string,
  values: ServiceFormValues,
) {
  const payload: ServiceInsert = {
    ...getServicePayload(values),
    specialist_profile_id: specialistProfileId,
  };

  const result = await supabase.from("services").insert(payload).select().single();

  if (
    values.serviceType === "one_time" &&
    isServicePackageSchemaCacheError(result.error)
  ) {
    return supabase
      .from("services")
      .insert({
        ...getLegacyOneTimeServicePayload(values),
        specialist_profile_id: specialistProfileId,
      })
      .select()
      .single();
  }

  return result;
}

export async function updateService(
  supabase: ServicesClient,
  specialistProfileId: string,
  serviceId: string,
  values: ServiceFormValues,
) {
  const payload: ServiceUpdate = getServicePayload(values);

  const result = await supabase
    .from("services")
    .update(payload)
    .eq("id", serviceId)
    .eq("specialist_profile_id", specialistProfileId)
    .select()
    .single();

  if (
    values.serviceType === "one_time" &&
    isServicePackageSchemaCacheError(result.error)
  ) {
    return supabase
      .from("services")
      .update(getLegacyOneTimeServicePayload(values))
      .eq("id", serviceId)
      .eq("specialist_profile_id", specialistProfileId)
      .select()
      .single();
  }

  return result;
}

export async function updateServiceActiveStatus(
  supabase: ServicesClient,
  specialistProfileId: string,
  serviceId: string,
  isActive: boolean,
) {
  return supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", serviceId)
    .eq("specialist_profile_id", specialistProfileId)
    .select()
    .single();
}

export async function duplicateService(
  supabase: ServicesClient,
  specialistProfileId: string,
  service: Service,
  sortOrder: number,
) {
  const isLegacyOneTimeService =
    !service.service_type || service.service_type === "one_time";
  const payload: ServiceInsert = {
    allow_reschedule: service.allow_reschedule ?? true,
    allow_client_cancellation: service.allow_client_cancellation ?? false,
    allow_client_rescheduling: service.allow_client_rescheduling ?? false,
    cancellation_policy: service.cancellation_policy ?? "",
    currency: service.currency,
    description: service.description,
    duration_minutes: service.duration_minutes,
    format: service.format,
    is_active: false,
    is_monthly_subscription: service.is_monthly_subscription ?? false,
    latest_cancellation_minutes: service.latest_cancellation_minutes ?? null,
    latest_reschedule_minutes: service.latest_reschedule_minutes ?? null,
    limit_active_bookings_per_client:
      service.limit_active_bookings_per_client ?? false,
    limit_one_booking_per_client: service.limit_one_booking_per_client ?? false,
    location_details: service.location_details,
    max_active_bookings_per_client:
      service.max_active_bookings_per_client ?? null,
    max_sessions_per_week:
      service.max_sessions_per_week ?? service.sessions_per_week ?? null,
    minimum_notice_minutes: service.minimum_notice_minutes ?? null,
    package_notes: service.package_notes ?? "",
    package_validity_weeks: service.service_type === "package" ? 4 : null,
    price_amount: service.price_amount,
    release_slot_on_cancellation: service.release_slot_on_cancellation ?? true,
    require_specialist_approval: service.require_specialist_approval ?? false,
    reschedule_requires_approval:
      service.reschedule_requires_approval ?? false,
    service_type: service.service_type ?? "one_time",
    sessions_count: service.sessions_count,
    sessions_per_week: service.max_sessions_per_week ?? service.sessions_per_week,
    sort_order: sortOrder,
    specialist_profile_id: specialistProfileId,
    title: `${service.title} Copy`,
  };

  const result = await supabase.from("services").insert(payload).select().single();

  if (isLegacyOneTimeService && isServicePackageSchemaCacheError(result.error)) {
    return supabase
      .from("services")
      .insert({
        currency: service.currency,
        description: service.description,
        duration_minutes: service.duration_minutes,
        format: service.format,
        is_active: false,
        location_details: service.location_details,
        price_amount: service.price_amount,
        sort_order: sortOrder,
        specialist_profile_id: specialistProfileId,
        title: `${service.title} Copy`,
      })
      .select()
      .single();
  }

  return result;
}

export async function updateServicesSortOrder(
  supabase: ServicesClient,
  specialistProfileId: string,
  orderedServices: Pick<Service, "id">[],
) {
  const updates = await Promise.all(
    orderedServices.map((service, index) =>
      supabase
        .from("services")
        .update({ sort_order: index })
        .eq("id", service.id)
        .eq("specialist_profile_id", specialistProfileId),
    ),
  );

  return {
    error: updates.find((update) => update.error)?.error ?? null,
  };
}

export async function deleteService(
  supabase: ServicesClient,
  specialistProfileId: string,
  serviceId: string,
) {
  // TODO: Replace hard delete with archive when services are linked to bookings.
  return supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("specialist_profile_id", specialistProfileId);
}
