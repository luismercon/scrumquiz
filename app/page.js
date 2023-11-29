import Link from "next/link"

export default function Home() {
  return (
    <main>
      <div className="container">
        <h1>Scrum Quiz</h1>
        <Link href='/quiz'>
          <button>Academic Mode</button>
        </Link>
        <Link href='/challenge'>
          <button>Challenge Mode</button>
        </Link>
      </div>
    </main>
  )
}
