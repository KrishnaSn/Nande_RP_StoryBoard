'use client'

import { useState } from 'react'
import { Plus, User, Clapperboard, GitBranch, X, Sparkles, Trash2, Check } from 'lucide-react'
import { useStoryStore, Character } from '../../store/useStoryStore'
import { useReactFlow } from 'reactflow'

const COLOR_PALETTE = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Yellow', hex: '#facc15' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Rose', hex: '#f43f5e' },
]

export default function LeftToolbox() {
  const { addNode, isPresenting, getCharacters, addCustomCharacter, removeCustomCharacter } = useStoryStore()
  const { project } = useReactFlow()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCharName, setNewCharName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].hex)
  const [customHex, setCustomHex] = useState('')

  const characters = getCharacters()

  const handleAddCharacterNode = (char: Character) => {
    const center = project({
      x: (window.innerWidth / 2) - 300,
      y: (window.innerHeight / 2) - 100
    })
    addNode('characterScene', center, { 
      character: char.name, 
      color: char.color,
      title: `${char.name}'s Scene` 
    })
  }

  const handleAddChoiceNode = () => {
    const center = project({
      x: (window.innerWidth / 2) - 300,
      y: (window.innerHeight / 2) - 100
    })
    addNode('choice', center, { 
      character: 'System', 
      color: '#ec4899',
      title: 'Decision Point' 
    })
  }

  const handleDragStart = (event: React.DragEvent, char: Character) => {
    event.dataTransfer.setData('application/reactflow', 'characterScene')
    event.dataTransfer.setData(
      'application/character-data',
      JSON.stringify({
        character: char.name,
        color: char.color,
        title: `${char.name}'s Scene`
      })
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleCreateCustomCharacter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCharName.trim()) return

    const finalColor = customHex.trim() || selectedColor
    addCustomCharacter(newCharName.trim(), finalColor)
    setNewCharName('')
    setCustomHex('')
    setShowAddModal(false)
  }

  return (
    <>
      <aside className={`w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col z-20 relative transition-all duration-500 ${isPresenting ? '-translate-x-full opacity-0 invisible' : 'translate-x-0 opacity-100 visible'}`}>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {/* Node Creation Section */}
          <div>
            <div className="flex items-center justify-between mb-4 text-zinc-500">
              <div className="flex items-center gap-2">
                <User size={14} />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Cast & Characters
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider"
                title="Add custom character"
              >
                <Plus size={10} />
                <span>Custom</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Characters Grid */}
              <div className="grid grid-cols-2 gap-2">
                {characters.map((char) => (
                  <div
                    key={char.name}
                    className="relative group"
                  >
                    <button
                      draggable
                      onDragStart={(e) => handleDragStart(e, char)}
                      onClick={() => handleAddCharacterNode(char)}
                      className="w-full flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all text-center cursor-pointer active:scale-95"
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${char.color}20`, color: char.color, border: `1px solid ${char.color}40` }}
                      >
                        <User size={20} />
                      </div>
                      <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate w-full">
                        {char.name}
                      </span>
                    </button>

                    {/* Delete Custom Character Button */}
                    {!char.isDefault && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm(`Remove custom character "${char.name}"?`)) {
                            removeCustomCharacter(char.name)
                          }
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-zinc-500 hover:text-red-500 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove custom character"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Utility Nodes */}
              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                  <GitBranch size={14} />
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Flow Nodes
                  </h3>
                </div>

                <button
                  onClick={handleAddChoiceNode}
                  className="w-full group flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-left"
                >
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                    <GitBranch size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase">Decision Point</p>
                    <p className="text-[8px] text-zinc-500 uppercase font-medium">Create a choice branch</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {characters.length} Cast Available
            </span>
          </div>
        </div>
      </aside>

      {/* Add Custom Character Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[250] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 absolute top-4 right-4 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all"
                style={{ 
                  backgroundColor: `${customHex || selectedColor}20`, 
                  color: customHex || selectedColor, 
                  border: `1px solid ${customHex || selectedColor}50` 
                }}
              >
                <User size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">New Custom Character</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">Introduce a new role to the story</p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomCharacter} className="space-y-4">
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">
                  Character Name
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="e.g. Tommy Vercetti, Detective Miller..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors font-medium"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                  Theme Color
                </label>
                
                {/* Palette */}
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.hex)
                        setCustomHex('')
                      }}
                      className={`h-7 rounded-lg border transition-all flex items-center justify-center ${
                        selectedColor === c.hex && !customHex
                          ? 'border-white scale-110 shadow-lg' 
                          : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.hex && !customHex && (
                        <Check size={12} className="text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customHex || selectedColor}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    placeholder="Custom Hex (e.g. #a855f7)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              {/* Preview Card */}
              {newCharName.trim() && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${customHex || selectedColor}20`, 
                      color: customHex || selectedColor, 
                      border: `1px solid ${customHex || selectedColor}40` 
                    }}
                  >
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white uppercase tracking-tight block">
                      {newCharName.trim()}
                    </span>
                    <span className="text-[8px] font-mono text-zinc-500">
                      {customHex || selectedColor}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 text-[9px] font-black uppercase text-zinc-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCharName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[9px] font-black uppercase transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add Character</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

