import Link from "next/link";

export default function AccountLink() {
  return (
    <Link
      href="/my-account"
      aria-label="My Account"
      className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </Link>
  );
}
