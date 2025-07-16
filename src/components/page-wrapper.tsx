type PageWrapperProps = {
  children: React.ReactNode;
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return <section className="flex flex-col gap-5">{children}</section>;
}
