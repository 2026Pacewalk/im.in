import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { getComPage } from "@/lib/com-page";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Return & Refund Policy | InviteMart",
  description:
    "Refund, exchange and revision guidelines for InviteMart custom digital invitations.",
  alternates: { canonical: "/return-policy" },
};

export default async function ReturnPolicyPage() {
  const html = await getComPage("return-policy");
  return (
    <InfoPage title="Return & Refund Policy">
      {html ? (
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="text-gray-600">
          For refund or revision requests, please contact invitemart@gmail.com.
        </p>
      )}
    </InfoPage>
  );
}
