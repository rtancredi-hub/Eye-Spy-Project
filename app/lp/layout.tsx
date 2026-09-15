// app/lp/layout.tsx
// Overrides the root layout for all landing pages —
// removes the main Navbar and Footer so they don't appear
import GoogleTag from "./components/GoogleTag";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleTag />
      {children}
    </>
  );
}
