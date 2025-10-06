import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import NoteFormModal from './components/NoteFormModal'

const API = import.meta.env.VITE_API_URL || "http://localhost:8765"
const COLORS = ['#fff59d', '#ffccbc', '#e1bee7', '#c8e6c9', '#bbdefb', '#ffe082']

function NoteCard({idea, index, onArchive, onEdit}){
  const style = { background: idea.custom_fields?.color || idea.color || COLORS[index % COLORS.length] }
  return (
    <Draggable draggableId={String(idea.id)} index={index}>
      {(provided)=>(
        <div className="note-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style, ...style}}>
          <div className="note-top">
            <h3 className="note-title">{idea.title}</h3>
            <div className="note-actions">
              <button className="icon-btn" onClick={()=>onEdit(idea)}>✎</button>
              <button className="icon-btn" onClick={()=>onArchive(idea.id)}>🗑</button>
            </div>
          </div>
          <p className="note-desc">{idea.description}</p>
          <div className="tags">{(idea.tags||[]).map((t,i)=>(<span key={i} className='tag'>{t}</span>))}</div>
        </div>
      )}
    </Draggable>
  )
}

export default function App(){
  const [ideas, setIdeas] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  async function load(){
    try{
      const res = await axios.get(API + '/ideas')
      setIdeas(res.data)
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ load() }, [])

  async function createIdea(payload){
    try{
      const res = await axios.post(API + '/ideas', payload)
      setIdeas(prev => [...prev, res.data])
    }catch(e){ console.error(e) }
  }

  async function updateIdea(id, payload){
    try{
      const res = await axios.patch(API + `/ideas/${id}`, payload)
      setIdeas(prev => prev.map(i=> i.id === id ? res.data : i))
      setEditing(null)
    }catch(e){ console.error(e) }
  }

  async function archiveIdea(id){
    try{
      await axios.patch(API + `/ideas/${id}`, { archived: true })
      setIdeas(prev => prev.filter(i=> i.id !== id))
    }catch(e){ console.error(e) }
  }

  async function onDragEnd(result){
    if(!result.destination) return
    if(result.destination.droppableId === 'trash'){
      const idea = ideas[result.source.index]
      await archiveIdea(idea.id)
      return
    }
    const items = Array.from(ideas)
    const [moved] = items.splice(result.source.index,1)
    items.splice(result.destination.index,0,moved)
    try{
      await Promise.all(items.map((it, idx)=> axios.patch(API + `/ideas/${it.id}`, { position: idx })))
    }catch(e){ console.error(e) }
    setIdeas(items)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Mydea</div>
        <div className="header-actions">
          <button className="btn secondary" onClick={()=>setModalOpen(true)}>New Note</button>
        </div>
      </header>

      <main className="board-wrap">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" direction="horizontal">
            {(provided)=>(
              <div className="board" ref={provided.innerRef} {...provided.droppableProps}>
                {ideas.map((idea, idx)=>(
                  <NoteCard idea={idea} key={idea.id} index={idx} onArchive={archiveIdea} onEdit={(it)=>{ setEditing(it); setModalOpen(true) }} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId="trash">
            {(provided)=>(
              <div className="trash" ref={provided.innerRef} {...provided.droppableProps}>
                <div className="trash-inner">🗑️ Trash<br/><small>Drag here to archive</small></div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      <button className="fab" onClick={()=>{ setEditing(null); setModalOpen(true) }}>+</button>

      <NoteFormModal open={modalOpen} onClose={()=>setModalOpen(false)} onCreate={createIdea} onUpdate={updateIdea} editing={editing} colors={COLORS} />
    </div>
  )
}
