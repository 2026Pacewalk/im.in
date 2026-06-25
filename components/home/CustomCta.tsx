import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/wcpa-types";

export default function CustomCta() {
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi InviteMart! I'd like a custom invitation design."
  )}`;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
        Want to make something different?
      </h2>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 font-semibold text-white shadow-sm transition hover:brightness-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.243z" />
        </svg>
        WhatsApp Today
      </a>

      <Link
        href="/product-category/video-invitation"
        className="mx-auto mt-8 block max-w-2xl rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-4 font-display text-xl font-bold text-white shadow-sm transition hover:from-brand-800 hover:to-ink md:text-2xl"
      >
        Digital Wedding Invitation Video Maker
      </Link>

      <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-gray-600 md:text-base">
        When you decide to send out an exquisitely curated invite, all your
        guests will say &lsquo;Yes&rsquo; to your special day! Let us bring you
        stylish and customized invitations with zero sweat. If you want to invite
        your guests uniquely, check out our reliable wedding invitation video
        maker and get personalized video invitations based on your preference,
        requirement, and budget. Browse through our available templates, and
        you&apos;ll surely find the one that suits your event&apos;s theme.
      </p>
    </section>
  );
}
