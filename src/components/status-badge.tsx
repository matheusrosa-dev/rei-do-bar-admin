type Variant = "active" | "inactive" | "alert" | "neutral";

type Props = {
  children: React.ReactNode;
  variant: Variant;
};

export const StatusBadge = ({ children, variant }: Props) => {
  const variantClasses: Record<Variant, string> = {
    active: "bg-green-500/15 text-green-400",
    inactive: "bg-red-500/15 text-red-400",
    alert: "bg-orange-500/15 text-orange-400",
    neutral: "bg-white/10 text-gray-300",
  };

  return (
    <span
      className={`select-none w-fit px-2 py-0.5 rounded-full text-xs font-medium 
      ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};
