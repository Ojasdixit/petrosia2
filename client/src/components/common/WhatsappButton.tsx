import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsappButtonProps extends ButtonProps {
  number: string;
  message?: string;
}

export function WhatsappButton({
  number,
  message = "",
  className,
  children,
  ...props
}: WhatsappButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    window.open(url, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className={cn("bg-green-600 hover:bg-green-700", className)}
      {...props}
    >
      {children || "Contact on WhatsApp"}
    </Button>
  );
}