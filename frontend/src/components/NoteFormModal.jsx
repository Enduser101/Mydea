import React, { useEffect, useState } from 'react'

export default function NoteFormModal({open, onClose, onCreate, onUpdate, editing, colors}){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [color, setColor] = useState(colors?.[0] || '#fff59d')

  useEffect(()=>{
    if(editing){
      setTitle(editing.title || '')
      setDescription(editing.description || '')
      setTags((editing.tags || []).join(', '))
      setColor(editing.custom_fields?.color || editing.color || colors?.[0])
    } else {
      setTitle(''); setDescription(''); setTags(''); setColor(colors?.[0] || '#fff59d')
    }
  }, [editing, colors, open])

  if(!open) return null

  function submit(e){
    e.preventDefault()
    const payload = {
      title,
      description,
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      custom_fields: { color }
    }
    if(editing){
      onUpdate(editing.id, payload)
    } else {
      onCreate(payload)
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h3>{editing ? 'Edit Note' : 'New Note'}</h3>
        <form onSubmit={submit} className="modal-form">
          <label>Title</label>
          <input required value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} />
          <label>Tags (comma separated)</label>
          <input value={tags} onChange={e=>setTags(e.target.value)} />
          <label>Color</label>
          <div className="color-row">
            {colors.map(c=> (
              <button type="button" key={c} className={'color-swatch' + (color===c?' active':'')} style={{background:c}} onClick={()=>setColor(c)} />
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
