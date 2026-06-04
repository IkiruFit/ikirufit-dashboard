import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_MAREK = [
  'Film Zone 2 reel — hook + talking point on camera',
  'Write carousel copy — aerobic vs anaerobic 12-week plan',
  'Voice note 3 caption ideas to Valentina',
  'Film client moment post-session for social proof',
  'Review and approve final carousel before posting',
]
const DEFAULT_VAL = [
  'Edit reel footage — captions, transitions, music',
  'Build carousel slides in Canva from Marek copy',
  'Schedule 5 posts Mon/Wed/Fri',
  'Upload new media files to gallery',
  'Log post metrics from last week',
]

function TaskList({ person, color, label }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
    const channel = supabase.channel('tasks-' + person)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `person=eq.${person}` }, () => loadTasks())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [person])

  async function loadTasks() {
    const { data } = await supabase.from('tasks').select('*').eq('person', person).order('created_at')
    if (data && data.length > 0) {
      setTasks(data)
    } else if (data && data.length === 0) {
      const defaults = person === 'marek' ? DEFAULT_MAREK : DEFAULT_VAL
      const rows = defaults.map(t => ({ person, text: t, done: false }))
      const { data: inserted } = await supabase.from('tasks').insert(rows).select()
      if (inserted) setTasks(inserted)
    }
    setLoading(false)
  }

  async function toggleTask(task) {
    await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id)
    setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))
  }

  async function addTask() {
    if (!newTask.trim()) return
    const { data } = await supabase.from('tasks').insert({ person, text: newTask.trim(), done: false }).select().single()
    if (data) setTasks([...tasks, data])
    setNewTask('')
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  if (loading) return <div style={{fontSize:'12px',color:'var(--grey2)'}}>Loading...</div>

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className={`check-item ${task.done ? 'done' : ''}`} style={{alignItems:'center'}}>
          <div className="check-icon" onClick={() => toggleTask(task)}>
            {task.done && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="var(--gold)" strokeWidth="1.5"/></svg>}
          </div>
          <span style={{flex:1}} onClick={() => toggleTask(task)}>{task.text}</span>
          <span onClick={() => deleteTask(task.id)} style={{color:'var(--grey2)',fontSize:'16px',cursor:'pointer',marginLeft:'4px',lineHeight:1}}>×</span>
        </div>
      ))}
      <div className="mt8 flex-gap">
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="Add task..." style={{fontSize:'12px',padding:'5px 8px'}} />
        <button className="btn btn-outline btn-sm" onClick={addTask}>+</button>
      </div>
    </div>
  )
}

export default function Overview() {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))

  return (
    <div>
      <div className="gold-bar" />
      <div className="section-title">Weekly <span>Overview</span></div>

      <div className="grid-4 mb20">
        <div className="stat-card"><div className="stat-num">2</div><div className="stat-label">Carousels due</div></div>
        <div className="stat-card"><div className="stat-num">2</div><div className="stat-label">Reels due</div></div>
        <div className="stat-card"><div className="stat-num">1</div><div className="stat-label">Social proof</div></div>
        <div className="stat-card"><div className="stat-num">5</div><div className="stat-label">Total this week</div></div>
      </div>

      <div className="grid-2 mb20">
        <div className="card card-gold">
          <div className="flex-between mb12">
            <div className="flex-gap">
              <div className="person-dot dot-marek" />
              <span style={{fontWeight:600,fontSize:'14px'}}>Marek</span>
              <span className="tag tag-gold">Coach</span>
            </div>
            <span className="text-small">This week</span>
          </div>
          <TaskList person="marek" color="var(--gold)" label="Marek" />
        </div>
        <div className="card card-green">
          <div className="flex-between mb12">
            <div className="flex-gap">
              <div className="person-dot dot-val" />
              <span style={{fontWeight:600,fontSize:'14px'}}>Valentina</span>
              <span className="tag tag-green">Editor</span>
            </div>
            <span className="text-small">This week</span>
          </div>
          <TaskList person="val" color="var(--green)" label="Valentina" />
        </div>
      </div>

      <div className="card mb20">
        <div className="flex-between mb14">
          <div className="section-title" style={{marginBottom:0}}>Weekly <span>Rhythm</span></div>
          <span className="text-small">Optimal posting pattern</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'7px'}}>
          {[['Monday','carousel','Authority / YOU'],['Tuesday','reel','Relatable / ME'],['Wednesday','proof','Client story'],['Friday','carousel','Authority / YOU'],['Saturday','reel','Relatable / ME']].map(([day,type,sub]) => (
            <div key={day} style={{background:'var(--bg3)',borderRadius:'6px',padding:'10px',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'10px',color:'var(--grey2)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'7px'}}>{day}</div>
              <div className={`slot slot-${type}`}><div className="slot-title">{type.charAt(0).toUpperCase()+type.slice(1)}</div><div className="slot-sub">{sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title mb12">Conversion <span>Path</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
          {[['Carousel','Builds trust','var(--gold-border)'],['Reel','Builds connection','var(--border)'],['Social Proof','Triggers enquiry','var(--border)']].map(([title,sub,bc],i) => (
            <>
              <div key={title} style={{background:'var(--bg3)',border:`1px solid ${bc}`,borderRadius:'6px',padding:'9px 12px',textAlign:'center',flex:1,minWidth:'90px'}}>
                <div style={{fontSize:'10px',color:'var(--grey2)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'3px'}}>{title}</div>
                <div style={{fontSize:'12px'}}>{sub}</div>
              </div>
              {i < 2 && <span style={{color:'var(--gold)'}}>→</span>}
            </>
          ))}
          <span style={{color:'var(--gold)'}}>→</span>
          <div style={{background:'var(--gold)',borderRadius:'6px',padding:'9px 12px',textAlign:'center',flex:1,minWidth:'90px'}}>
            <div style={{fontSize:'10px',color:'rgba(0,0,0,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'3px'}}>DM / Link</div>
            <div style={{fontSize:'12px',color:'#0e0e0e',fontWeight:600}}>Paid client</div>
          </div>
        </div>
      </div>
    </div>
  )
}
