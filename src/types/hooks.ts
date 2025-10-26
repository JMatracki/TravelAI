export interface UseOfflineReturn {
  isOffline: boolean;
  isOnline: boolean;
  connectionType: string;
}

export interface UseItineraryReturn {
  isLoading: boolean;
  error: string | null;
  data: unknown | null;
  generateItinerary: (formData: unknown) => Promise<unknown>;
  clearError: () => void;
  clearData: () => void;
}

export interface UseToastReturn {
  toast: (options: Record<string, unknown>) => void;
  toasts: unknown[];
}

export type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  cancel?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
} & Record<string, unknown>;

export type ActionType =
  | "ADD_TOAST"
  | "UPDATE_TOAST"
  | "DISMISS_TOAST"
  | "REMOVE_TOAST";

export type Action =
  | {
      type: "ADD_TOAST";
      toast: ToasterToast;
    }
  | {
      type: "UPDATE_TOAST";
      toast: Partial<ToasterToast>;
    }
  | {
      type: "DISMISS_TOAST";
      toastId?: ToasterToast["id"];
    }
  | {
      type: "REMOVE_TOAST";
      toastId?: ToasterToast["id"];
    };

export interface ToastState {
  toasts: ToasterToast[];
}

export type Toast = Omit<ToasterToast, "id">;
