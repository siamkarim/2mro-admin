import LayoutShell from "@/components/layout/LayoutShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <LayoutShell>{children}</LayoutShell>
      </div>
    </div>
  );
}
