import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MEETING_TYPES = ['Weekly content review','Filming plan session','Caption + copy review','Analytics review','Strategy session']
const DURATIONS = ['15 min','30 min','45 min','1 hour']

function getWeekDays() {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({length:7}, (_,i) => { const d = new Date(monday); d.setDate(monday.getDate()+i); return d })
}

export default function Meetings() {
  const [meetings, setMeetings] = useState([])
  const [form, setForm] = useState({ type: MEETING_TYPES[0], day: 'Monday', duration: '30 min' })
  const [saving, setSaving] = useState(false)
  const weekDays = getWeekDays()

  useEffect(() => {
    loadMeetings()
    const channel = supabase.channel('meetings')
      .on('postgres_changes', { event:'*', schema:'public', table:'meetings' }, () => loadMeetings())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function loadMeetings() {
    const { data } = await supabase.from('meetings').select('*').order('created_at')
    if (data) setMeetings(data)
  }

  async function bookMeeting() {
    setSaving(true)
    const { data } = await supabase.from('meetings').insert({
      type: form.type, day: form.day, duration: form.duration, booked: true
    }).select().single()
    if (data) setMeetings([...meetings, data])
    setSaving(false)
  }

  async function deleteMeeting(id) {
    await supabase.from('meetings').delete().eq('id', id)
    setMeetings(meetings.filter(m => m.id !== id))
  }

  return (
    <div>
      <div className="gold-bar" />
      <div className="flex-between mb14">
        <div className="section-title" style={{marginBottom:0}}>Meeting <span>Calendar</span></div>
      </div>

      <div className="grid-2 mb14">
        <div className="card">
          <div style={{fontSize:'12px',fontWeight:600,marginBottom:'12px',color:'var(--gold)'}}>This Week</div>
          {meetings.length === 0 && <div style={{fontSize:'12px',color:'var(--grey2)',padding:'10px 0'}}>No meetings booked yet</div>}
          {meetings.map(m => (
            <div key={m.id} className="meeting-slot booked">
              <div className="meeting-time">{m.day?.slice(0,3).toUpperCase()}</div>
              <div>
                <div className="meeting-title">{m.type}</div>
                <div className="meeting-sub">Marek + Valentina · {m.duration}</div>
              </div>
              <div className="meeting-tag tag-booked" style={{marginLeft:'auto'}}>Booked</div>
              <button onClick={() => deleteMeeting(m.id)} className="btn btn-danger btn-sm" style={{padding:'2px 7px',marginLeft:'6px'}}>×</button>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{fontSize:'12px',fontWeight:600,marginBottom:'12px',color:'var(--gold)'}}>Book a Slot</div>
          <div style={{marginBottom:'9px'}}>
            <label>Meeting type</label>
            <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
              {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{marginBottom:'9px'}}>
            <label>Day</label>
            <select value={form.day} onChange={e => setForm(f=>({...f,day:e.target.value}))}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div style={{marginBottom:'12px'}}>
            <label>Duration</label>
            <select value={form.duration} onChange={e => setForm(f=>({...f,duration:e.target.value}))}>
              {DURATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <button className="btn btn-gold" style={{width:'100%',justifyContent:'center'}} onClick={bookMeeting} disabled={saving}>
            {saving ? 'Booking...' : '📅 Confirm Booking'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>Recommended <span>Recurring Meetings</span></div>
        <div className="grid-2">
          {[
            {title:'Weekly content review',detail:'Every Wednesday · 30 min · Review posts, assign tasks, check metrics.',gold:true},
            {title:'Filming plan',detail:'Every Friday · 20 min · Plan weekend B-roll, shot list, topics.',gold:false},
            {title:'Monthly strategy',detail:'First Monday of month · 1 hour · Metrics, content pillars, next 4 weeks.',gold:false},
            {title:'Caption review',detail:'Ad hoc · 15 min · Marek checks voice, Valentina checks format.',gold:false},
          ].map(m => (
            <div key={m.title} style={{background:'var(--bg3)',borderRadius:'6px',padding:'10px 12px',borderLeft:`2px solid ${m.gold?'var(--gold)':'var(--grey2)'}`}}>
              <div style={{fontSize:'12px',fontWeight:600,marginBottom:'3px'}}>{m.title}</div>
              <div style={{fontSize:'11px',color:'var(--grey)'}}>{m.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
