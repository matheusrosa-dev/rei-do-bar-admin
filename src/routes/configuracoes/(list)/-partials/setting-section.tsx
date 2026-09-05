type Props = {
  title: string;
  children: React.ReactNode;
};

export const SettingSection = ({ title, children }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white text-lg font-bold">{title}</h2>
      <hr className="border-white/10" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </div>
  );
};
