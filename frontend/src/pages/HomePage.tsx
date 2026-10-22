import { useEffect, useState } from 'react'

export default function HomePage() {
  const [status, setStatus] = useState('Comprovant...')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('Error de connexió'))
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Pastisseria La Vall</h1>
      <p className="mt-4">Estat del servidor: {status}</p>
    </main>
  )
}