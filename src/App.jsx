import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Overview from './pages/Overview'
import Formats from './pages/Formats'
import Schedule from './pages/Schedule'
import Gallery from './pages/Gallery'
import Meetings from './pages/Meetings'
import References from './pages/References'
import './index.css'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const NAV = [
  { id:'overview', label:'Overview', section:'Main', icon:'⊞' },
  { id:'formats', label:'Content Formats', section:'Main', icon:'✎' },
  { id:'schedule', label:'Schedule', section:'Main', icon:'⬡', badge:true },
  { id:'gallery', label:'Media Gallery', section:'Assets', icon:'⬜' },
  { id:'meetings', label:'Meetings', section:'Assets', icon:'▷' },
  { id:'reference', label:'References', section:'Inspiration', icon:'◎' },
]

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('overview')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0e0e0e',color:'#666',fontFamily:'sans-serif'}}>Loading...</div>
  if (!session) return <Auth />

  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay()+6)%7))
  const weekLabel = `Week of ${DAYS[monday.getDay()]} ${monday.getDate()} ${MONTHS[monday.getMonth()]} ${monday.getFullYear()}`

  const sections = [...new Set(NAV.map(n => n.section))]
  const pages = { overview:<Overview/>, formats:<Formats/>, schedule:<Schedule/>, gallery:<Gallery/>, meetings:<Meetings/>, reference:<References/> }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <div className="logo-mark">Ikiru<span>Fit</span></div>
          <div className="logo-sub">Content OS</div>
        </div>
        <div className="nav">
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section">{section}</div>
              {NAV.filter(n => n.section === section).map(item => (
                <div key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={() => setPage(item.id)}>
                  <span>{item.icon}</span>
                  {item.label}
                  {item.badge && <span className="nav-badge"/>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:'16px 18px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:'11px',color:'var(--grey2)',marginBottom:'6px'}}>Signed in as</div>
          <div style={{fontSize:'12px',color:'var(--grey)',marginBottom:'10px',wordBreak:'break-all'}}>{session.user.email}</div>
          <button className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </nav>
      <div className="main">
        <div className="topbar">
          <span className="week-badge">{weekLabel}</span>
          <div className="flex-gap">
            <span style={{fontSize:'11px',color:'var(--grey2)'}}><span className="sync-dot"/>Live sync</span>
            <div className="avatar">MV</div>
          </div>
        </div>
        <div className="page-content">{pages[page] || <Overview/>}</div>
      </div>
    </div>
  )
}
