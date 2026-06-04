export default function References() {
  const refs = [
    { initials:'EP', name:'Electrum Performance', handle:'@electrum_performance', desc:'46K followers. Elite BJJ athletes worldwide. Strong carousel game — evidence-based programming, clean visuals, DM funnel for programmes. What works: consistency, credibility markers, direct language.', tags:['Carousel-heavy','46K','Programme sales'] },
    { initials:'JJ', name:'Joel Jamieson', handle:'@8weeksout', desc:'S&C coach for elite MMA fighters. Deep educational content, long-form captions, science-backed. Positions as authority through depth over virality. Niche specificity is the key.', tags:['Educational','Long-form','MMA S&C'] },
    { initials:'CA', name:'Combathlete', handle:'@combathlete', desc:'S&C for BJJ, MMA, wrestling athletes. 10+ countries, PFL and IBJJF champions. What works: "real life" messaging, combat sports specificity, testimonial-led conversion.', tags:['Social proof','Testimonials','Online coaching'] },
    { initials:'CP', name:'Charles Allan-Price', handle:'@charlesallanprice', desc:'London-based S&C for BJJ. Mat Strong programme, IBJJF world champion clients. Closest competitor in your market. What works: specific client results, ADCC name drops, accessible programme pricing.', tags:['London','Closest competitor','Programme model'] },
  ]

  return (
    <div>
      <div className="gold-bar" />
      <div className="section-title">Coach <span>References</span></div>
      <div style={{background:'var(--bg3)',border:'1px solid var(--gold-border)',borderRadius:'6px',padding:'10px 14px',marginBottom:'16px',fontSize:'12px',color:'var(--grey)'}}>
        💡 Use these as benchmark and inspiration — observe their format, hooks, and engagement tactics. Never copy. Use as a standard to beat.
      </div>

      {refs.map(r => (
        <div key={r.initials} className="ref-card">
          <div className="ref-avatar">{r.initials}</div>
          <div>
            <div style={{fontWeight:600,fontSize:'13px',marginBottom:'2px'}}>{r.name}</div>
            <div style={{fontSize:'11px',color:'var(--gold)',marginBottom:'4px'}}>{r.handle}</div>
            <div style={{fontSize:'12px',color:'var(--grey)',lineHeight:'1.5'}}>{r.desc}</div>
            <div>{r.tags.map(t => <span key={t} className="ref-tag">{t}</span>)}</div>
          </div>
        </div>
      ))}

      <div className="card mt12">
        <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>Your <span>Differentiators</span></div>
        <div className="grid-2">
          {[
            'Practising BJJ grappler AND S&C coach — both sides',
            'London premium market — Third Space, serious athletes',
            'IkiruFit brand identity — clear aesthetic, recognisable',
            'BJJ curriculum design experience — not just conditioning',
          ].map(d => (
            <div key={d} className="check-item" style={{cursor:'default'}}>
              <div className="check-icon" style={{borderColor:'var(--gold)',background:'var(--gold-faint)'}}>
                <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="var(--gold)" strokeWidth="1.5"/></svg>
              </div>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
