import * as React from "react";
import { createPortal } from "react-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContext = React.createContext<{
  onOpenChange?: (open: boolean) => void;
}>({});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <DialogContext.Provider value={{ onOpenChange }}>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop / Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => onOpenChange(false)}
        />

        {/* Modal Container */}
        <div
          className="relative z-10 w-full max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>,
    document.body,
  );
}

export function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const ctx = React.useContext(DialogContext);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props && typeof (props as any).onClick === "function") {
      (props as any).onClick(e);
    }
    if (ctx.onOpenChange) ctx.onOpenChange(false);
  };

  return (
    <button data-slot="dialog-close" {...(props as any)} onClick={handleClick}>
      {(props as any).children}
    </button>
  );
}

export function DialogContent({
  children,
  className = "",
}: DialogContentProps) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full mx-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = "" }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>{children}</div>
  );
}

export function DialogTitle({ children, className = "" }: DialogTitleProps) {
  return (
    <h2
      className={cn("text-xl font-bold leading-none tracking-tight", className)}
    >
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}

export function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
