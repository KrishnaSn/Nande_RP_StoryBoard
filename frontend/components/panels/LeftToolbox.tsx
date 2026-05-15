'use client'

import { useState } from 'react'
import { 
  Clapperboard, 
  MessageSquareQuote, 
  GitBranch, 
  UserPlus, 
  Layers, 
  Plus,
  Search,
  Image as ImageIcon,
  User,
  X,
  Save,
  Loader2
} from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'
import { useReactFlow } from 'reactflow'
import { nanoid } from 'nanoid'

export default function LeftToolbox() {
  const { addNode, characterAssets, currentLayer, setLayer, saveCharacterAsset } = useStoryStore()
  const { project } = useReactFlow()
  
  const [showCharModal, setShowCharModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [charForm, setCharData] = useState({ name: '', image: '', role: '', personality: '' })

  const handleCreateChar = async () => {
    if (!charForm.name || !charForm.image) return
    setIsCreating(true)
    await saveCharacterAsset({
      id: `char-${nanoid(5)}`,
      ...charForm
    })
    setIsCreating(false)
    setShowCharModal(false)
    setCharData({ name: '', image: '', role: '', personality: '' })
  }

  const handleAddNode = (type: string) => {
    const center = project({
      x: (window.innerWidth / 2) - 300,
      y: (window.innerHeight / 2) - 100
    })
    addNode(type, center)
  }
  
  const nodeItems = [
    { type: 'scene', label: 'Scene', icon: Clapperboard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { type: 'dialogue', label: 'Dialogue', icon: MessageSquareQuote, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { type: 'choice', label: 'Choice', icon: GitBranch, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { type: 'character', label: 'Character', icon: UserPlus, color: 'text-red-400', bg: 'bg-red-400/10' },
  ]

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative">
      <div className="ui-tag">[ASSET_TOOLBOX]</div>
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-9 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        {/* Node Creation Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Plus size={14} className="text-zinc-500" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Create Nodes
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {nodeItems.map((item) => (
              <button
                key={item.type}
                onClick={() => handleAddNode(item.type)}
                className="group flex flex-col items-center justify-center aspect-square rounded-xl border border-white/5 bg-white/5 p-2 text-center transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <h3 className="mt-2 text-[10px] font-bold text-white tracking-tight">
                  {item.label}
                </h3>
              </button>
            ))}
          </div>
        </div>

        {/* Character Moodboard Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User size={14} className="text-zinc-500" />
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Character Moodboard
              </h2>
            </div>
            <button 
              onClick={() => setShowCharModal(true)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {characterAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="group relative aspect-square rounded-lg overflow-hidden border border-white/5 cursor-grab active:cursor-grabbing hover:border-red-500/50 transition-colors"
                title={asset.name}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', 'character')
                  e.dataTransfer.setData('application/character-data', JSON.stringify({
                    name: asset.name,
                    image: asset.image,
                    role: asset.role || 'Cast Member',
                    personality: asset.personality || `Visual reference for ${asset.name}`
                  }))
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onClick={() => {
                  const center = project({
                    x: (window.innerWidth / 2) - 300,
                    y: (window.innerHeight / 2) - 100
                  })
                  addNode('character', center, {
                    name: asset.name,
                    image: asset.image,
                    role: asset.role || 'Cast Member',
                    personality: asset.personality || `Visual reference for ${asset.name}`
                  })
                }}
              >
                <img src={asset.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-[8px] font-bold text-white truncate">{asset.name}</span>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setShowCharModal(true)}
              className="aspect-square rounded-lg border border-white/5 border-dashed flex flex-col items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-500 transition-all"
            >
              <ImageIcon size={16} />
            </button>
          </div>
        </div>

        {/* Layers Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} className="text-zinc-500" />
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Project Layers
            </h2>
          </div>
          
          <div className="space-y-1">
            {['Story Graph', 'Logic Layer', 'Cinematic Path', 'Director Notes'].map((layer) => (
              <div 
                key={layer} 
                onClick={() => setLayer(layer)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-all ${
                  currentLayer === layer ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  currentLayer === layer ? 'bg-red-500' : 'bg-zinc-700 group-hover:bg-red-500'
                }`} />
                <span className={`text-[11px] font-medium transition-colors ${
                  currentLayer === layer ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  {layer}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-600 p-0.5 shadow-lg shadow-red-500/20">
            <div className="w-full h-full rounded-full bg-[#0d0d0d] flex items-center justify-center text-[10px] font-bold text-white">
              JD
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-white">Director Mode</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-zinc-500">System Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Upload Modal */}
      {showCharModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create New Character</h2>
              <button onClick={() => setShowCharModal(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Name</label>
                <input 
                  type="text"
                  value={charForm.name}
                  onChange={(e) => setCharData({ ...charForm, name: e.target.value })}
                  placeholder="Character Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Image URL</label>
                <input 
                  type="text"
                  value={charForm.image}
                  onChange={(e) => setCharData({ ...charForm, image: e.target.value })}
                  placeholder="Paste direct image link..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Role</label>
                  <input 
                    type="text"
                    value={charForm.role}
                    onChange={(e) => setCharData({ ...charForm, role: e.target.value })}
                    placeholder="e.g. Villain"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Personality</label>
                  <input 
                    type="text"
                    value={charForm.personality}
                    onChange={(e) => setCharData({ ...charForm, personality: e.target.value })}
                    placeholder="e.g. Brave"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-black/40 flex justify-end gap-3">
              <button 
                onClick={() => setShowCharModal(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateChar}
                disabled={isCreating}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
