import * as TooltipPrimitive from "@radix-ui/react-tooltip";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: TooltipPrimitive.TooltipContentProps["side"];
  sideOffset?: number;
  disabled?: boolean;
};

export const Tooltip = ({
  children,
  content,
  side = "top",
  sideOffset = 6,
  disabled,
}: Props) => {
  if (disabled) return children;

  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className="bg-amber-500 text-black font-bold text-xs px-2.5 py-1.5 rounded-md shadow-md select-none animate-in fade-in-0 zoom-in-95"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-amber-500" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
