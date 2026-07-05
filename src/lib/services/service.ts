import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Service,
  ServiceFormValues,
  ServiceInsert,
  ServiceUpdate,
} from "@/lib/services/types";
import type { Database } from "@/lib/supabase/types";

type ServicesClient = SupabaseClient<Database>;

export function getDefaultServiceFormValues(): ServiceFormValues {
  return {
    currency: "EUR",
    description: "",
    durationMinutes: "",
    format: "online",
    isActive: true,
    priceAmount: "",
    sortOrder: 0,
    title: "",
  };
}

export function getServiceFormValues(service: Service): ServiceFormValues {
  return {
    currency: service.currency,
    description: service.description,
    durationMinutes: service.duration_minutes,
    format: service.format,
    isActive: service.is_active,
    priceAmount: service.price_amount,
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

  if (values.priceAmount === "" || values.priceAmount < 0) {
    return "Price cannot be negative.";
  }

  if (!/^[A-Z]{3}$/.test(values.currency.trim().toUpperCase())) {
    return "Currency must be a 3-letter code.";
  }

  return null;
}

function getServicePayload(values: ServiceFormValues) {
  return {
    currency: values.currency.trim().toUpperCase(),
    description: values.description.trim(),
    duration_minutes: values.durationMinutes === "" ? 0 : values.durationMinutes,
    format: values.format,
    is_active: values.isActive,
    price_amount: values.priceAmount === "" ? 0 : values.priceAmount,
    sort_order: values.sortOrder === "" ? 0 : values.sortOrder,
    title: values.title.trim(),
  };
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

export async function createService(
  supabase: ServicesClient,
  specialistProfileId: string,
  values: ServiceFormValues,
) {
  const payload: ServiceInsert = {
    ...getServicePayload(values),
    specialist_profile_id: specialistProfileId,
  };

  return supabase.from("services").insert(payload).select().single();
}

export async function updateService(
  supabase: ServicesClient,
  specialistProfileId: string,
  serviceId: string,
  values: ServiceFormValues,
) {
  const payload: ServiceUpdate = getServicePayload(values);

  return supabase
    .from("services")
    .update(payload)
    .eq("id", serviceId)
    .eq("specialist_profile_id", specialistProfileId)
    .select()
    .single();
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

export async function duplicateService(
  supabase: ServicesClient,
  specialistProfileId: string,
  service: Service,
) {
  const payload: ServiceInsert = {
    currency: service.currency,
    description: service.description,
    duration_minutes: service.duration_minutes,
    format: service.format,
    is_active: false,
    price_amount: service.price_amount,
    sort_order: service.sort_order + 1,
    specialist_profile_id: specialistProfileId,
    title: `${service.title} Copy`,
  };

  return supabase.from("services").insert(payload).select().single();
}
