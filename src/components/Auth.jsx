import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mode, setMode] = useState('login')
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Account created. Check your email to confirm, then log in.')
    }
    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">Ikiru<span>Fit</span></div>
        <div className="auth-sub">Content OS</div>
        {error && <div className="auth-error">{error}</div>}
        {message && <div style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)',color:'var(--green)',padding:'10px 14px',borderRadius:'5px',fontSize:'12px',marginBottom:'14px'}}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb16">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="mb20">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-gold" style={{width:'100%',justifyContent:'center'}} disabled={loading}>
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'var(--grey2)'}}>
          {mode === 'login' ? (
            <>No account? <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={() => setMode('signup')}>Create one</span></>
          ) : (
            <>Have an account? <span style={{color:'var(--gold)',cursor:'pointer'}} onClick={() => setMode('login')}>Sign in</span></>
          )}
        </div>
      </div>
    </div>
  )
}
