export type TemporaryAvatarPreview = {
  file: File | null;
  previewUrl: string | null;
};

const avatarPreviewEventName = "buymytime:temporary-avatar-preview";

let currentPreview: TemporaryAvatarPreview = {
  file: null,
  previewUrl: null,
};

export function getTemporaryAvatarPreview() {
  return currentPreview;
}

export function setTemporaryAvatarPreview(nextPreview: TemporaryAvatarPreview) {
  currentPreview = nextPreview;

  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<TemporaryAvatarPreview>(avatarPreviewEventName, {
      detail: currentPreview,
    }),
  );
}

export function subscribeToTemporaryAvatarPreview(
  listener: (preview: TemporaryAvatarPreview) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleAvatarPreviewChange = (event: Event) => {
    listener(
      event instanceof CustomEvent
        ? (event.detail as TemporaryAvatarPreview)
        : currentPreview,
    );
  };

  window.addEventListener(avatarPreviewEventName, handleAvatarPreviewChange);

  return () => {
    window.removeEventListener(
      avatarPreviewEventName,
      handleAvatarPreviewChange,
    );
  };
}
