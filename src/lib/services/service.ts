import type { SupabaseClient } from "@supabase/supabase-js";

import type {
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
    cancellationPolicy: "",
    currency: "EUR",
    description: "",
    durationMinutes: "",
    format: "online",
    isMonthlySubscription: false,
    isActive: true,
    packageNotes: "",
    packageValidityWeeks: "",
    priceAmount: "",
    serviceType: "one_time",
    sessionsCount: "",
    sessionsPerWeek: "",
    sortOrder: 0,
    title: "",
  };
}

export function getServiceFormValues(service: Service): ServiceFormValues {
  return {
    allowReschedule: service.allow_reschedule ?? true,
    cancellationPolicy: service.cancellation_policy ?? "",
    currency: service.currency,
    description: service.description,
    durationMinutes: service.duration_minutes,
    format: service.format,
    isMonthlySubscription: service.is_monthly_subscription ?? false,
    isActive: service.is_active,
    packageNotes: service.package_notes ?? "",
    packageValidityWeeks: service.package_validity_weeks ?? "",
    priceAmount: service.price_amount === 0 ? "" : (service.price_amount / 100).toString(),
    serviceType: service.service_type ?? "one_time",
    sessionsCount: service.sessions_count ?? "",
    sessionsPerWeek: service.sessions_per_week ?? "",
    sortOrder: service.sort_order,
    title: service.title,
  };
}

export function validateServiceForm(values: ServiceFormValues) {
  if (!values.title.trim()) {
    return "Service title is required.";
  }

  if (values.durationMinutes === "" || values.durationMinutes <= 0 || values.durationMinutes > 1440) {
    return "Duration must be between 1 and 1440 minutes.";
  }

  const parsedPrice = parseFloat(values.priceAmount.replace(",", "."));
  if (values.priceAmount === "" || isNaN(parsedPrice) || parsedPrice < 0) {
    return "Price must be a valid positive number.";
  }

  if (!/^[A-Z]{3}$/.test(values.currency.trim().toUpperCase())) {
    return "Currency must be a 3-letter code.";
  }

  if (values.serviceType === "package") {
    const sessionsCount = values.sessionsCount;
    const sessionsPerWeek = values.sessionsPerWeek;
    const packageValidityWeeks = values.isMonthlySubscription
      ? 4
      : values.packageValidityWeeks;

    if (sessionsCount === "" || sessionsCount < 1) {
      return values.isMonthlySubscription
        ? "Monthly packages need at least one session per month."
        : "Packages need at least two sessions.";
    }

    if (!values.isMonthlySubscription && sessionsCount < 2) {
      return "One-off packages need at least two sessions.";
    }

    if (sessionsPerWeek === "" || sessionsPerWeek < 1) {
      return "Sessions per week must be at least 1.";
    }

    if (sessionsPerWeek > sessionsCount) {
      return "Sessions per week cannot be greater than the number of sessions.";
    }

    if (packageValidityWeeks === "" || packageValidityWeeks < 1) {
      return "Package duration must be at least 1 week.";
    }

    if (values.isMonthlySubscription) {
      if (sessionsCount > sessionsPerWeek * 4) {
        return "Monthly subscription sessions must fit within a 4-week month.";
      }
    } else if (packageValidityWeeks * sessionsPerWeek < sessionsCount) {
      return "Package duration should be long enough for the selected session pace.";
    }
  }

  return null;
}

function getServicePayload(values: ServiceFormValues) {
  const isPackage = values.serviceType === "package";
  const isMonthlySubscription = isPackage && values.isMonthlySubscription;

  return {
    allow_reschedule: isPackage ? values.allowReschedule : true,
    cancellation_policy: isPackage ? values.cancellationPolicy.trim() : "",
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    duration_minutes: values.durationMinutes === "" ? 0 : values.durationMinutes,
    format: values.format,
    is_monthly_subscription: isMonthlySubscription,
    is_active: values.isActive,
    package_notes: isPackage ? values.packageNotes.trim() : "",
    package_validity_weeks: isPackage
      ? isMonthlySubscription
        ? 4
        : values.packageValidityWeeks === ""
          ? null
          : values.packageValidityWeeks
      : null,
    price_amount: values.priceAmount === "" ? 0 : Math.round(parseFloat(values.priceAmount.replace(",", ".")) * 100),
    service_type: values.serviceType,
    sessions_count: isPackage
      ? values.sessionsCount === ""
        ? null
        : values.sessionsCount
      : null,
    sessions_per_week: isPackage
      ? values.sessionsPerWeek === ""
        ? null
        : values.sessionsPerWeek
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
    error?.message?.includes("is_monthly_subscription")
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
    cancellation_policy: service.cancellation_policy ?? "",
    currency: service.currency,
    description: service.description,
    duration_minutes: service.duration_minutes,
    format: service.format,
    is_active: false,
    is_monthly_subscription: service.is_monthly_subscription ?? false,
    location_details: service.location_details,
    package_notes: service.package_notes ?? "",
    package_validity_weeks: service.package_validity_weeks,
    price_amount: service.price_amount,
    service_type: service.service_type ?? "one_time",
    sessions_count: service.sessions_count,
    sessions_per_week: service.sessions_per_week,
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
