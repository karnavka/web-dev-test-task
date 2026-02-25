import { useEffect, useState } from 'react'
import './index.css'

function App() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/')
      .then(res => {
        if (!res.ok) throw new Error('Request failed')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
  }, [])

  return (
    <div>
      <h1>Instant Wellness Kits — Admin</h1>
      <p>Backend status:</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {!data && !error && <p>Loading...</p>}
    </div>
  )
}

export default App