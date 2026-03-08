import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Transgo - Driver Reimburse",
    description: "Form pengajuan reimburse untuk driver",
};

export default function DriverReimburseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
