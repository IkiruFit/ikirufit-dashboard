import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TYPE_COLORS = { carousel: 'carousel', reel: 'reel', proof: 'proof', meeting: 'meeting', voiceover: 'meeting', biroll: 'reel' }
const STATUS_OPTS = ['Idea','In Progress','Ready to Film','Editing','Scheduled','Posted']

function getWeekDays() {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  return Array.from({length:7}, (_,i) => { const d = new Date(monday); d.setDate(monday.getDate()+i); return d })
}

export default function Schedule() {
  const [posts, setPosts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type:'carousel', title:'', notes:'', status:'Idea', day_index:0 })
  const [syncing, setSyncing] = useState(false)
  const weekDays = getWeekDays()
  const today = new Date()

  useEffect(() => {
    loadPosts()
    const channel = supabase.channel('posts')
      .on('postgres_changes', { event:'*', schema:'public', table:'posts' }, () => loadPosts())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function loadPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at')
    if (data) setPosts(data)
  }

  async function savePost() {
    setSyncing(true)
    const dayDate = weekDays[form.day_index]
    const payload = { ...form, day_label: DAYS_SHORT[dayDate.getDay()] + ' ' + dayDate.getDate(), day_index: form.day_index }
    const { data } = await supabase.from('posts').insert(payload).select().single()
    if (data) setPosts([...posts, data])
    setShowForm(false)
    setForm({ type:'carousel', title:'', notes:'', status:'Idea', day_index:0 })
    setSyncing(false)
  }

  async function updatePost(id, field, value) {
    await supabase.from('posts').update({ [field]: value }).eq('id', id)
    setPosts(posts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function deletePost(id) {
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
  }

  function postsForDay(i) { return posts.filter(p => p.day_index === i) }

  return (
    <div>
      <div className="gold-bar" />
      <div className="flex-between mb14">
        <div className="section-title" style={{marginBottom:0}}>Content <span>Schedule</span></div>
        <div className="flex-gap">
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
            {[['var(--gold)','Carousel'],['var(--green)','Reel'],['var(--red)','Proof'],['var(--blue)','Meeting']].map(([c,l]) => (
              <span key={l} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'11px',color:'var(--grey)'}}>
                <span style={{width:'8px',height:'8px',background:c,borderRadius:'2px',display:'inline-block'}}></span>{l}
              </span>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Post</button>
        </div>
      </div>

      <div className="card mb14">
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'4px'}}>
          {weekDays.map((d, i) => {
            const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth()
            const label = DAYS_SHORT[d.getDay()] + ' ' + d.getDate()
            return (
              <div key={i} className="day-col">
                <div className={`day-header ${isToday ? 'today' : ''}`}>{label}</div>
                <div className="day-slots">
                  {postsForDay(i).map(post => (
                    <div key={post.id} className={`slot slot-${TYPE_COLORS[post.type]||'carousel'}`}>
                      <div className="slot-title">{post.title || post.type}</div>
                      <div className="slot-sub">{post.status}</div>
                    </div>
                  ))}
                  <div className="slot-empty" onClick={() => { setForm(f => ({...f,day_index:i})); setShowForm(true) }}>+</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showForm && (
        <div className="card mb14 card-gold">
          <div className="flex-between mb12">
            <div className="section-title" style={{marginBottom:0,fontSize:'16px'}}>New <span>Post</span></div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
          <div className="grid-2 mb12">
            <div><label>Type</label>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))}>
                <option value="carousel">Carousel — Authority</option>
                <option value="reel">Reel — Relatable</option>
                <option value="proof">Social Proof</option>
                <option value="voiceover">Voiceover</option>
                <option value="biroll">B-Roll</option>
              </select>
            </div>
            <div><label>Day</label>
              <select value={form.day_index} onChange={e => setForm(f=>({...f,day_index:parseInt(e.target.value)}))}>
                {weekDays.map((d,i) => <option key={i} value={i}>{DAYS_SHORT[d.getDay()]} {d.getDate()} {MONTHS[d.getMonth()]}</option>)}
              </select>
            </div>
          </div>
          <div className="mb12"><label>Topic / Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Zone 2 vs HICT for BJJ cardio" />
          </div>
          <div className="mb12"><label>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} placeholder="Hook idea, key points…" style={{minHeight:'60px',resize:'vertical'}} />
          </div>
          <div className="flex-gap">
            <div style={{fontSize:'10px',color:'var(--grey2)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Status:</div>
            <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} style={{width:'auto'}}>
              {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-gold" onClick={savePost} style={{marginLeft:'auto'}} disabled={syncing}>
              {syncing ? 'Saving...' : '✓ Save Post'}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex-between mb12">
          <div className="section-title" style={{marginBottom:0,fontSize:'16px'}}>Post <span>Log</span></div>
          <span className="text-small">{posts.length} posts</span>
        </div>
        {posts.length === 0 && <div style={{fontSize:'12px',color:'var(--grey2)',textAlign:'center',padding:'20px'}}>No posts yet — add your first one above</div>}
        {posts.map(post => (
          <div key={post.id} className="file-item" style={{flexWrap:'wrap',gap:'7px'}}>
            <span style={{fontSize:'12px',flex:1,minWidth:'120px'}}>
              <input type="text" defaultValue={post.title} onBlur={e => updatePost(post.id,'title',e.target.value)} style={{background:'transparent',border:'none',color:'var(--white)',fontSize:'12px',padding:0,width:'100%'}} />
            </span>
            <span className="text-small" style={{marginRight:'4px'}}>{post.day_label}</span>
            <select value={post.type} onChange={e => updatePost(post.id,'type',e.target.value)} style={{width:'auto',padding:'2px 6px',fontSize:'11px',background:'var(--bg4)',border:'1px solid var(--border)'}}>
              <option value="carousel">Carousel</option><option value="reel">Reel</option><option value="proof">Proof</option><option value="voiceover">Voiceover</option><option value="biroll">B-Roll</option>
            </select>
            <select value={post.status} onChange={e => updatePost(post.id,'status',e.target.value)} style={{width:'auto',padding:'2px 6px',fontSize:'11px',background:'var(--bg4)',border:'1px solid var(--border)',color:'var(--gold)'}}>
              {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-danger btn-sm" onClick={() => deletePost(post.id)} style={{padding:'2px 8px'}}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
