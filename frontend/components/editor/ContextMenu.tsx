'use client'

import React, { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { Trash2, Link2Off, Info } from 'lucide-react'
import { useStoryStore } from '../../store/useStoryStore'

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  type,
  onClick,
  ...props
}: any) {
  const { deleteNode, arcGraphs, currentArcId, onEdgesChange } = useStoryStore()
  const { getEdge, getNodes } = useReactFlow()

  const handleNodeDelete = useCallback(() => {
    if (confirm('Discard this node?')) {
      deleteNode(id)
    }
    onClick()
  }, [id, deleteNode, onClick])

  const handleEdgeDelete = useCallback(() => {
    onEdgesChange([{ id, type: 'remove' }])
    onClick()
  }, [id, onEdgesChange, onClick])

  const handleOpenDetails = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-scene-modal', { detail: { nodeId: id } }))
    onClick()
  }, [id, onClick])

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-[100] bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl p-1 min-w-[160px] backdrop-blur-xl"
      {...props}
    >
      <div className="px-3 py-2 border-b border-white/5 mb-1">
        <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Workspace Action</p>
      </div>
      
      {type === 'node' && (
        <>
          <button
            onClick={handleOpenDetails}
            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-white hover:bg-white/5 rounded-lg transition-all text-left uppercase tracking-tighter"
          >
            <Info size={14} className="text-blue-400" />
            <span>Node Details</span>
          </button>
          
          <button
            onClick={handleNodeDelete}
            className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all text-left uppercase tracking-tighter"
          >
            <Trash2 size={14} />
            <span>Discard Node</span>
          </button>
        </>
      )}

      {type === 'edge' && (
        <button
          onClick={handleEdgeDelete}
          className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-all text-left uppercase tracking-tighter"
        >
          <Link2Off size={14} />
          <span>Disconnect Path</span>
        </button>
      )}
    </div>
  )
}
