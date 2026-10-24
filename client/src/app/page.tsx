import { HeroActions } from "@/components/hero-actions";
import { Card, StatusBadge, Starburst, Window } from "@/components/ui";

const features = [
  { title: "Submit", color: "yellow", text: "Add your GitHub repo, live link and a short description." },
  { title: "Track", color: "blue", text: "See every project as pending, approved or rejected at a glance." },
  { title: "Review", color: "pink", text: "Mentors and admins browse all projects with search and filters." },
] as const;

const tickerWords = ["SUBMIT", "★", "REVIEW", "★", "APPROVE", "★", "SHIP", "★"];

const steps = [
  { n: "01", title: "Create an account", text: "Sign up as a student in a few seconds." },
  { n: "02", title: "Submit your project", text: "Paste the GitHub repo and the live link." },
  { n: "03", title: "Wait for review", text: "A mentor approves or rejects it. Fix and resubmit." },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <section className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <span className="inline-block border-[3px] border-ink bg-green px-3 py-1 font-mono text-sm font-bold uppercase shadow-brutal-sm">
            Student project tracker
          </span>
          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.92] sm:text-7xl">
            Build it.
            <br />
            <span className="inline-block border-[3px] border-ink bg-yellow px-2 shadow-brutal">Ship it.</span>
            <br />
            Get it reviewed.
          </h1>
          <p className="mt-8 max-w-lg text-lg font-medium">
            One loud, simple dashboard for every project you build. Submit, edit, and follow its review status
            until it gets the green light.
          </p>
          <div className="mt-10">
            <HeroActions />
          </div>
        </div>

        {/* Decorative preview stack */}
        <div className="relative mx-auto h-92 w-full max-w-sm" aria-hidden>
          <Card color="pink" className="absolute top-0 left-6 w-64 p-4">
            <StatusBadge status="REJECTED" />
            <p className="mt-3 font-display uppercase">Weather app</p>
          </Card>
          <Card color="blue" className="absolute top-27 right-0 w-64 p-4">
            <StatusBadge status="PENDING" />
            <p className="mt-3 font-display uppercase">Chat server</p>
          </Card>
          <Card className="absolute bottom-0 left-0 w-72 p-5 shadow-brutal-xl">
            <span className="tape -top-3 left-1/2 -translate-x-1/2" />
            <StatusBadge status="APPROVED" />
            <p className="mt-3 font-display text-xl uppercase">Portfolio site</p>
            <p className="mt-1 font-mono text-xs">github.com/you/portfolio</p>
          </Card>
          <Starburst color="green" className="absolute -right-2 bottom-6">
            Mentor approved!
          </Starburst>
        </div>
      </section>

      <div className="-mx-4 overflow-hidden border-y-[3px] border-ink bg-ink py-3 text-cream sm:-mx-6">
        <div className="flex w-max animate-marquee gap-8 font-display text-2xl">
          {[...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords].map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </div>
      </div>

      <section className="grid gap-8 md:grid-cols-3">
        {features.map((f, i) => (
          <Card key={f.title} color={f.color} className="relative p-6">
            <span className="tape -top-3 left-6" aria-hidden />
            <span className="inline-block border-2 border-ink bg-white px-1.5 font-mono text-sm font-bold">0{i + 1}</span>
            <h2 className="mt-3 font-display text-2xl uppercase">{f.title}</h2>
            <p className="mt-3 font-medium">{f.text}</p>
          </Card>
        ))}
      </section>

      {/* How it works, on graph paper */}
      <section className="border-[3px] border-ink bg-white bg-grid-paper p-6 shadow-brutal sm:p-10">
        <h2 className="font-display text-3xl uppercase sm:text-4xl">
          How it <span className="bg-pink bg-stripes px-1">works</span>
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <Window title={`step_${s.n}.txt`} color={s.n === "01" ? "yellow" : s.n === "02" ? "blue" : "green"} bodyClassName="p-5">
                <p className="font-display text-xl uppercase">{s.title}</p>
                <p className="mt-2 font-medium">{s.text}</p>
              </Window>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
