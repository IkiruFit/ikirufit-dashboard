import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Gallery() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadFiles() }, [])

  async function loadFiles() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false })
    if (data) setFiles(data)
  }

  async function handleUpload(e) {
    const selected = Array.from(e.target.files)
    if (!selected.length) return
    setUploading(true)
    for (const file of selected) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${file.name}`
      const { data: storageData, error: storageError } = await supabase.storage.from('media').upload(path, file)
      if (!storageError) {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)
        const type = file.type.startsWith('video') ? 'video' : 'photo'
        await supabase.from('media').insert({ name: file.name, path, url: publicUrl, type, size: file.size })
      }
    }
    await loadFiles()
    setUploading(false)
    e.target.value = ''
  }

  async function deleteFile(file) {
    await supabase.storage.from('media').remove([file.path])
    await supabase.from('media').delete().eq('id', file.id)
    setFiles(files.filter(f => f.id !== file.id))
  }

  const filtered = filter === 'all' ? files : files.filter(f => f.type === filter)

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024*1024) return Math.round(bytes/1024) + 'KB'
    return (bytes/1024/1024).toFixed(1) + 'MB'
  }

  return (
    <div>
      <div className="gold-bar" />
      <div className="flex-between mb14">
        <div className="section-title" style={{marginBottom:0}}>Media <span>Gallery</span></div>
        <div className="flex-gap">
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{width:'auto',padding:'5px 9px',fontSize:'12px'}}>
            <option value="all">All Files</option>
            <option value="photo">Photos</option>
            <option value="video">Videos</option>
          </select>
          <button className="btn btn-gold btn-sm" onClick={() => document.getElementById('file-upload').click()} disabled={uploading}>
            {uploading ? 'Uploading...' : '↑ Upload'}
          </button>
          <input type="file" id="file-upload" multiple accept="image/*,video/*" style={{display:'none'}} onChange={handleUpload} />
        </div>
      </div>

      <div className="upload-zone" onClick={() => document.getElementById('file-upload').click()}>
        <div style={{fontSize:'28px',marginBottom:'7px'}}>☁</div>
        <p style={{fontSize:'13px',color:'var(--grey)',marginBottom:'3px'}}>Drag and drop or click to upload</p>
        <span style={{fontSize:'11px',color:'var(--grey2)'}}>Photos, videos, carousel exports</span>
      </div>

      {filtered.length > 0 && (
        <>
          <div className="gallery-grid mb20">
            {filtered.map(file => (
              <div key={file.id} className="gallery-item" style={{position:'relative'}}>
                {file.type === 'photo' && file.url ? (
                  <img src={file.url} alt={file.name} />
                ) : (
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px',padding:'10px'}}>
                    <span style={{fontSize:'24px'}}>{file.type === 'video' ? '▶' : '📄'}</span>
                    <div className="gallery-label">{file.name?.slice(0,16)}</div>
                  </div>
                )}
                <div
                  onClick={() => deleteFile(file)}
                  style={{position:'absolute',top:'4px',right:'4px',background:'rgba(248,113,113,0.8)',borderRadius:'50%',width:'18px',height:'18px',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:'12px',color:'white',opacity:0,transition:'opacity 0.15s'}}
                  onMouseEnter={e => e.currentTarget.style.opacity=1}
                  onMouseLeave={e => e.currentTarget.style.opacity=0}
                >×</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title" style={{fontSize:'15px',marginBottom:'10px'}}>All <span>Files</span></div>
            {filtered.map(file => (
              <div key={file.id} className="file-item">
                <span style={{fontSize:'16px',color:'var(--gold)'}}>{file.type === 'video' ? '▶' : '🖼'}</span>
                <span style={{flex:1,fontSize:'13px'}}>{file.name}</span>
                <span className="text-small" style={{marginRight:'8px'}}>{formatSize(file.size)}</span>
                <span className="tag tag-gold" style={{marginRight:'8px'}}>{file.type}</span>
                {file.url && <a href={file.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View</a>}
                <button className="btn btn-danger btn-sm" onClick={() => deleteFile(file)} style={{marginLeft:'4px'}}>×</button>
              </div>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && !uploading && (
        <div style={{textAlign:'center',padding:'40px',color:'var(--grey2)',fontSize:'13px'}}>
          No files yet — upload your first photo or video above
        </div>
      )}
    </div>
  )
}
