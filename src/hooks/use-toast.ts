import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function useToast() {
  const toast = ({
    title,
    description,
    variant = 'default',
    action,
  }: ToastOptions) => {
    return sonnerToast[title ? (variant === 'destructive' ? 'error' : 'success') : 'info'](
      description || title || '',
      {
        description: description ? title : undefined,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      }
    );
  };

  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export const toast = (options: Parameters<ReturnType<typeof useToast>['toast']>[0]) => {
  const { toast } = useToast();
  return toast(options);
};