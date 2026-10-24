import { Card, LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <Card color="yellow" className="relative mx-auto max-w-lg bg-stripes p-10 text-center shadow-brutal-xl">
      <span className="tape -top-3 left-1/2 -translate-x-1/2" aria-hidden />
      <p className="font-display text-8xl leading-none">404</p>
      <p className="mt-4 inline-block bg-white px-2 font-display text-xl uppercase">This page does not exist</p>
      <div>
        <LinkButton href="/" color="white" className="mt-8">
          ← Go home
        </LinkButton>
      </div>
    </Card>
  );
}
