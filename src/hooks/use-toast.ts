import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: "destructive" | "default"
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    const options = description ? { description } : undefined
    
    if (variant === "destructive") {
      sonnerToast.error(title || "Error", options)
    } else {
      sonnerToast.success(title || "Success", options)
    }
  }

  return {
    toast,
    dismiss: () => {},
    toasts: [],
  }
}
