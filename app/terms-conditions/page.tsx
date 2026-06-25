import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { getComPage } from "@/lib/com-page";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Terms & Conditions | InviteMart",
  description:
    "Delivery timelines, pricing, revisions and service terms for InviteMart digital invitations.",
  alternates: { canonical: "/terms-conditions" },
};

export default async function TermsPage() {
  const html = await getComPage("terms-conditions");
  return (
    <InfoPage title="Terms & Conditions">
      {html ? (
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="text-gray-600">
          For our full terms of service, please contact invitemart@gmail.com.
        </p>
      )}
    </InfoPage>
  );
}
