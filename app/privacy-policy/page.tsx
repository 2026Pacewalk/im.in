import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import { getComPage } from "@/lib/com-page";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Privacy Policy | InviteMart",
  description:
    "How InviteMart collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
  const html = await getComPage("privacy-policy");
  return (
    <InfoPage title="Privacy Policy">
      {html ? (
        <div className="wp-content" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="text-gray-600">
          For details on how we handle your data, please contact us at
          invitemart@gmail.com.
        </p>
      )}
    </InfoPage>
  );
}
