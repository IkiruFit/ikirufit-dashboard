import { useState } from 'react'

const CHECKLISTS = {
  carousel: {
    marek: ['Pick a problem your audience already feels','Write hook — challenge a belief or name a pain point','Write slide-by-slide copy — one idea per slide','Include a pro tip only a real coach would know','Write caption (short value version of the carousel)','Approve final design before it goes live'],
    val: ['Build slides in Canva with IkiruFit template','Select and crop background photos from gallery','Add stats, labels, gold bars and brand tag','Export at 1080×1080px, send to Marek for review','Schedule post at optimal time (Mon/Fri 7–9am)']
  },
  reel: {
    marek: ['Open mid-sentence — no intro','Film 2–3 takes of the hook (first 2 seconds are everything)','Talk to ONE person — "if you train BJJ and work full time…"','Share the struggle or failure BEFORE the lesson','End with a question or opinion — invite comments','Film B-roll: mat footage, session clips, warm-up'],
    val: ['Cut to best take — keep it under 60 sec (90 max)','Add on-screen captions for accessibility + silent viewers','Add trending audio or clean background track','IkiruFit logo end card — 2 seconds','Export vertical 9:16, upload draft to gallery for review']
  },
  voiceover: {
    marek: ['Write script first — read it aloud before recording','Keep it conversational — talking, not reading','Record in a quiet space — post-session in the gym works','Script follows carousel structure — one point per beat'],
    val: ['Sync VO to B-roll footage or slide transitions','Add text overlays for key stats and points','Music at 20% under voice — never compete','Captions on for the voice track']
  },
  proof: {
    marek: ['After a client milestone — check in naturally, not formally','Screenshot DMs where clients share real moments','Film 15-sec clip of client post-session (ask first)','Write the story arc — struggle → change → result','Make the client the hero. You are the coach behind it.','End with a lesson anyone can take away'],
    val: ['Design the post with client photo or DM screenshot','IkiruFit branding subtle — don\'t overpower client story','Blur any personal info if sharing DM screenshots','Schedule mid-week — Wednesday performs best for proof posts']
  },
  biroll: {
    marek: ['Film at every session — even 30 seconds is usable','Get varied angles: wide room, close technique, face reactions','Film transitions — walking in, warm-up, post-roll chat','Film yourself coaching — not just athletes','Upload to gallery within 48 hours while it\'s fresh'],
    val: ['Tag clips by category: rolling / drilling / coaching / gym','Keep a running folder of best 10-second clips','Match B-roll to upcoming reel or voiceover topics','Flag clips with strong emotion — those lead reels']
  }
}

function Checklist({ items }) {
  const [done, setDone] = useState([])
  const toggle = i => setDone(d => d.includes(i) ? d.filter(x=>x!==i) : [...d,i])
  return (
    <div>
      {items.map((item,i) => (
        <div key={i} className={`check-item ${done.includes(i)?'done':''}`} onClick={() => toggle(i)}>
          <div className="check-icon">
            {done.includes(i) && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="var(--gold)" strokeWidth="1.5"/></svg>}
          </div>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

const TAB_INFO = {
  carousel: { badge: 'badge-you', badgeText: 'YOU — Authority', title: 'Carousel' },
  reel: { badge: 'badge-me', badgeText: 'ME — Relatable', title: 'Reel' },
  voiceover: { badge: 'badge-you', badgeText: 'YOU — Authority', title: 'Voiceover' },
  proof: { badge: 'badge-them', badgeText: 'THEM — Social Proof', title: 'Social Proof' },
  biroll: { badge: 'badge-me', badgeText: 'Supporting Footage', title: 'B-Roll' },
}

export default function Formats() {
  const [tab, setTab] = useState('carousel')
  const cl = CHECKLISTS[tab]
  const info = TAB_INFO[tab]

  return (
    <div>
      <div className="gold-bar" />
      <div className="section-title">Content <span>Formats</span></div>
      <div className="tabs">
        {['carousel','reel','voiceover','proof','biroll'].map(t => (
          <div key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
            {t === 'biroll' ? 'B-Roll' : t.charAt(0).toUpperCase()+t.slice(1)}
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className={`card ${tab==='carousel'?'card-gold':tab==='proof'?'card-red':'card-green'}`}>
          <span className={`tag ${info.badge} mb8`} style={{display:'inline-block'}}>{info.badgeText}</span>
          <div className="section-title" style={{fontSize:'17px',marginBottom:'8px'}}>{info.title} <span>Checklist</span></div>
          <div className="divider" />
          <div className="person-label"><div className="person-dot dot-marek" />Marek</div>
          <Checklist items={cl.marek} />
          <div className="divider" />
          <div className="person-label"><div className="person-dot dot-val" />Valentina</div>
          <Checklist items={cl.val} />
        </div>

        <div className="card">
          {tab === 'carousel' && (
            <>
              <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>Slide <span>Structure</span></div>
              {[['gold','Slide 1 — Hook','Challenge a belief. Name the pain.'],['','Slide 2 — Identity','Make them feel seen before you educate.'],['','Slides 3–6 — Methods','One concept per slide. Stats + copy.'],['','Slide 7 — Pro Tip','Only a real coach would know this.'],['','Slide 8 — Summary','The save-worthy slide.'],['gold','Slide 9 — CTA','Question or comment hook. No hard sell.']].map(([gold,title,sub]) => (
                <div key={title} className={`slide-row ${gold}`} style={{marginBottom:'4px'}}>
                  <strong style={{color:gold?'var(--gold)':'var(--white)'}}>{title}</strong><br/>
                  <span style={{color:'var(--grey)',fontSize:'11px'}}>{sub}</span>
                </div>
              ))}
              <div className="example-box">
                <div className="example-label">Example hook</div>
                <div className="example-text">"Zone 2 isn't the problem. Finding 2 hours for it every week is."</div>
              </div>
            </>
          )}
          {tab === 'reel' && (
            <>
              <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>Reel <span>Formula</span></div>
              {[['var(--green)','0–2s — Hook','Start mid-thought. Make them stay.'],['var(--grey2)','3–20s — Relate','Name their situation. You\'re one of them.'],['var(--grey2)','20–50s — Value','The lesson, the story, the fix.'],['var(--green)','50–60s — CTA','One question. One action.']].map(([c,t,s]) => (
                <div key={t} style={{background:'var(--bg4)',borderLeft:`2px solid ${c}`,padding:'7px 10px',fontSize:'12px',marginBottom:'4px'}}>
                  <strong style={{color:c}}>{t}</strong><br/><span style={{color:'var(--grey)',fontSize:'11px'}}>{s}</span>
                </div>
              ))}
              <div className="example-box">
                <div className="example-label">Example opener</div>
                <div className="example-text">"I used to gas in round 3 every single session. Here's what I was actually missing…"</div>
              </div>
            </>
          )}
          {tab === 'voiceover' && (
            <>
              <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>When to use <span>Voiceover</span></div>
              <div style={{fontSize:'13px',color:'var(--grey)',lineHeight:'1.8',marginBottom:'12px'}}>Use when content is educational and data-heavy, you have strong B-roll, or you want to repurpose a carousel into a reel.</div>
              <div className="example-box">
                <div className="example-label">Best for</div>
                <div className="example-text">Science explanations, 12-week programmes, training system breakdowns — educate without being on camera.</div>
              </div>
            </>
          )}
          {tab === 'proof' && (
            <>
              <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>Proof Post <span>Formats</span></div>
              {[['Story Arc','"6 months ago this guy was gassing by round 2. Last weekend he went 5 matches at a comp."'],['DM Screenshot','Real message from a client describing a breakthrough moment.'],['Before / After','What they were doing vs what you built for them.'],['Comp Result','Document from the day before to the result. That\'s the story arc.']].map(([t,s]) => (
                <div key={t} style={{background:'var(--bg4)',borderRadius:'6px',padding:'9px 12px',marginBottom:'6px'}}>
                  <div style={{fontSize:'12px',fontWeight:600,marginBottom:'3px'}}>{t}</div>
                  <div className="example-text" style={{fontSize:'11px'}}>{s}</div>
                </div>
              ))}
            </>
          )}
          {tab === 'biroll' && (
            <>
              <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>B-Roll <span>Shot List</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px'}}>
                {['Wide mat room','Close grip work','Post-roll reactions','Coaching cues','Whiteboard / notes','S&C session clips','Drill repetitions','Pre-session warm-up'].map(s => (
                  <div key={s} style={{background:'var(--bg4)',borderRadius:'5px',padding:'7px 9px',fontSize:'11px',color:'var(--grey)'}}>📷 {s}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
