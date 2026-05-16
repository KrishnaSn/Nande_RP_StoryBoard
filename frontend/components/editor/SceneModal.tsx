'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save, User, FileText, Layout } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function SceneModal() {
  const { arcGraphs, currentArcId, updateNodeData, deleteNode } = useStoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [nodeId, setNodeId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ title: '', description: '', character: '', color: '' })

  useEffect(() => {
    const handleOpen = (e: any) => {
      const id = e.detail.nodeId
      const graph = arcGraphs[currentArcId]
      const node = graph?.nodes.find(n => n.id === id)
      
      if (node) {
        setNodeId(id)
        setEditData({
          title: node.data.title || '',
          description: node.data.description || '',
          character: node.data.character || 'System',
          color: node.data.color || '#ffffff'
        })
        setIsOpen(true)
      }
    }

    window.addEventListener('open-scene-modal', handleOpen)
    return () => window.removeEventListener('open-scene-modal', handleOpen)
  }, [arcGraphs, currentArcId])

  const handleSave = () => {
    if (nodeId) {
      updateNodeData(nodeId, { title: editData.title, description: editData.description })
      setIsOpen(false)
    }
  }

  const handleDelete = () => {
    if (nodeId && confirm('Delete this node from the workspace?')) {
      deleteNode(nodeId)
      setIsOpen(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div 
          className="p-6 flex items-center justify-between border-b border-white/5"
          style={{ backgroundColor: `${editData.color}05` }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-black/40"
              style={{ backgroundColor: `${editData.color}15`, color: editData.color, border: `1px solid ${editData.color}30` }}
            >
              <User size={24} />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Editing Node</h2>
              <p className="text-sm font-black text-white uppercase tracking-widest leading-none">{editData.character}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Layout size={14} />
              <label className="text-[10px] font-bold uppercase tracking-widest">Scene Title</label>
            </div>
            <input 
              type="text" 
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-700"
              placeholder="Give this scene a cinematic name..."
            />
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <FileText size={14} />
              <label className="text-[10px] font-bold uppercase tracking-widest">Scene Narrative & Details</label>
            </div>
            <textarea 
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-zinc-300 min-h-[300px] resize-none focus:outline-none focus:border-red-500/50 transition-all leading-relaxed placeholder:text-zinc-800"
              placeholder="Detail the sequence, dialogue pointers, and camera angles..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <Trash2 size={16} />
            <span>Discard Node</span>
          </button>

          <div className="flex gap-4">
             <button 
              onClick={() => setIsOpen(false)}
              className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase text-zinc-400 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-black px-10 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              <Save size={16} />
              <span>Update Graph</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
