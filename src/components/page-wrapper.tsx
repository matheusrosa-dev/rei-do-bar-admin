import { useNavigate } from "@tanstack/react-router";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import type { FileRouteTypes } from "../routeTree.gen";

type Props = {
  title: string;
  children: React.ReactNode;
  headerContent?: () => React.ReactNode;
  goBackTo?: FileRouteTypes["to"];
};

export const PageWrapper = ({
  title,
  children,
  headerContent: HeaderContent,
  goBackTo,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <header className="flex justify-between items-center px-5 h-18 border-b border-white/10 bg-white/3 select-none">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg tracking-tight">
            {title}
          </h3>
        </div>

        {HeaderContent && <HeaderContent />}
      </header>

      <div className="p-5 overflow-auto flex-1 flex flex-col">
        {goBackTo && (
          <button
            onClick={() =>
              navigate({
                to: goBackTo,
              })
            }
            type="button"
            className="text-white flex items-center gap-2 font-medium cursor-pointer mb-5 w-fit pr-2"
          >
            <MdOutlineArrowBackIosNew />
            Voltar
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
