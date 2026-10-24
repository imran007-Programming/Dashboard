export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

// Show "github.com/user/repo" instead of the full URL
export function shortUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
