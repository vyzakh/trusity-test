type FormWrapperProps = {
  children: React.ReactNode;
};

export default function FormWrapper({ children }: FormWrapperProps) {
  return (
    <div className="rounded-xl bg-white px-1 py-16 sm:px-4">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}
