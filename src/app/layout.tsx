import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Root layout delegates html/body to [locale]/layout.tsx
// so next-intl can set the correct lang attribute
export default function RootLayout({ children }: Props) {
  return children;
}
