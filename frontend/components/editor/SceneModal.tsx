'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Save, User, FileText, Layout, Plus, Minus, GitBranch } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function SceneModal() {
  const { arcGraphs, currentArcId, updateNodeData, deleteNode } = useStoryStore()
  const [isOpen, setIsOpen] = useState(false)
  const [nodeId, setNodeId] = useState<string | null>(null)
  const [nodeType, setNodeType] = useState<string>('characterScene')
  const [editData, setEditData] = useState({ title: '', description: '', character: '', color: '', options: [] as string[] })

  useEffect(() => {
    const handleOpen = (e: any) => {
      const id = e.detail.nodeId
      const graph = arcGraphs[currentArcId]
      const node = graph?.nodes.find(n => n.id === id)
      
      if (node) {
        setNodeId(id)
        setNodeType(node.type || 'characterScene')
        setEditData({
          title: node.data.title || '',
          description: node.data.description || '',
          character: node.data.character || 'System',
          color: node.data.color || '#ffffff',
          options: node.data.options || []
        })
        setIsOpen(true)
      }
    }

    window.addEventListener('open-scene-modal', handleOpen)
    return () => window.removeEventListener('open-scene-modal', handleOpen)
  }, [arcGraphs, currentArcId])

  const handleSave = () => {
    if (nodeId) {
      updateNodeData(nodeId, { 
        title: editData.title, 
        description: editData.description,
        options: nodeType === 'choice' ? editData.options : undefined
      })
      setIsOpen(false)
    }
  }

  const handleDelete = () => {
    if (nodeId && confirm('Delete this node from the workspace?')) {
      deleteNode(nodeId)
      setIsOpen(false)
    }
  }

  const addOption = () => {
    setEditData({ ...editData, options: [...editData.options, `New Option ${editData.options.length + 1}`] })
  }

  const updateOption = (index: number, val: string) => {
    const newOptions = [...editData.options]
    newOptions[index] = val
    setEditData({ ...editData, options: newOptions })
  }

  const removeOption = (index: number) => {
    setEditData({ ...editData, options: editData.options.filter((_, i) => i !== index) })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div 
          className="p-4 flex items-center justify-between border-b border-white/5"
          style={{ backgroundColor: `${editData.color}05` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-black/40"
              style={{ backgroundColor: `${editData.color}15`, color: editData.color, border: `1px solid ${editData.color}30` }}
            >
              {nodeType === 'choice' ? <GitBranch size={16} /> : <User size={16} />}
            </div>
            <div>
              <h2 className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Editing Node</h2>
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{editData.character}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="flex gap-6 items-start">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-zinc-600 mb-1">
                <Layout size={12} />
                <label className="text-[8px] font-bold uppercase tracking-widest">Scene Title</label>
              </div>
              <input 
                type="text" 
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-700"
                placeholder="Cinematic Name..."
              />
            </div>

            {nodeType === 'choice' && (
              <div className="flex-[1.5] space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <GitBranch size={12} />
                    <label className="text-[8px] font-bold uppercase tracking-widest">Decision Paths</label>
                  </div>
                  <button 
                    onClick={addOption}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-[8px] font-black uppercase"
                  >
                    <Plus size={10} />
                    <span>Add Path</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {editData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <input 
                        type="text" 
                        value={opt}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:border-amber-500/50 transition-all"
                      />
                      <button 
                        onClick={() => removeOption(idx)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Minus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-white/5">
             <div className="flex items-center gap-2 text-zinc-600 mb-1">
              <FileText size={12} />
              <label className="text-[8px] font-bold uppercase tracking-widest">Scene Narrative & Details</label>
            </div>
            <textarea 
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-zinc-300 min-h-[450px] resize-none focus:outline-none focus:border-red-500/50 transition-all leading-relaxed placeholder:text-zinc-800 custom-scrollbar"
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
