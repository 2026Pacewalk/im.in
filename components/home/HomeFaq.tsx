const VIDEO_URL = "https://youtu.be/cJbpdlYLQrI";

const FAQS: { q: string; a: string; link?: string }[] = [
  {
    q: "What is a digital invitation card?",
    a: "A digital invitation card is an electronic invitation that can be sent through WhatsApp, email, messaging apps, or any social media platform instead of a physical card. It is also considered the save-the-date card.",
  },
  {
    q: "What are the advantages of using digital invitation cards?",
    a: "Many benefits can be obtained if you are using digital invitation cards such as convenience, cost-effectiveness, customization, contactless sharing, time-saving, being environmentally friendly, and many more.",
  },
  {
    q: "Can I personalize digital invitation cards?",
    a: "Digital invitation cards can be personalized with different designs, backgrounds, traditions, fonts, colors, pictures, caricatures, and fun elements to reflect the theme or style of your event. With the help of our professionals, you can get it done without any hassle.",
  },
  {
    q: "How does an online invitation maker work?",
    a: "An online invitation maker has a team of professional designers who can offer you tailored options as per your preferences that allow you to create and customise digital invitation cards by choosing from different templates, fonts, colours, and graphics. You can talk to our experts at +91 73073 44844.",
  },
  {
    q: "What information should be included on an invitation card?",
    a: "Invitation cards should include the event's name, date, time, location, RSVP information, dress code, and any additional relevant information. Additionally, you can include a Google Maps location link or QR code for easy event venue navigation.",
  },
  {
    q: "What are the different types of invitation cards?",
    a: "You can find abundant types of invitation cards, including wedding invitations, engagement invitations, anniversary invitations, birthday invitations, baby shower invitations, graduation invitations, corporate event invitations, and many more.",
  },
  {
    q: "How to make a digital invitation online?",
    a: "Watch our quick step-by-step video guide:",
    link: VIDEO_URL,
  },
];

export default function HomeFaq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.link ? `${f.a} ${f.link}` : f.a,
      },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 scroll-mt-24">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">
          Frequently asked questions
        </h2>
        <div className="gold-rule mx-auto mt-4 w-24" />
      </div>

      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-black/5 bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
              {f.q}
              <span className="text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {f.a}
              {f.link && (
                <>
                  {" "}
                  <a
                    href={f.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Watch the video ▶
                  </a>
                </>
              )}
            </p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
