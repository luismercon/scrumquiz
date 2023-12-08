import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div className="container">
        <h1>Scrum Quiz</h1>
        <Link href='/quiz'>
          <button>Academic Mode</button>
        </Link>
        <Link href='/quickfire'>
          <button>Quick Fire Challenge</button>
        </Link>
        <Link href='/timed'>
          <button>Timed Challenge</button>
        </Link>
      </div>
    </main>
  )
}
