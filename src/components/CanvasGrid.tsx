/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BusinessModelCanvas, CanvasBlockId, BMCItem } from '../types';
import { CANVAS_BLOCKS_CONFIG } from '../data/examples';
import { Plus, Trash2, HelpCircle, Sparkles, Check, Edit2 } from 'lucide-react';

interface CanvasGridProps {
  canvas: BusinessModelCanvas;
  onChange: (updatedCanvas: BusinessModelCanvas) => void;
  onEnrichBlock: (blockId: CanvasBlockId) => void;
  isLoadingEnrich: CanvasBlockId | null;
}

export default function CanvasGrid({ canvas, onChange, onEnrichBlock, isLoadingEnrich }: CanvasGridProps) {
  const [activeQuestionTooltip, setActiveQuestionTooltip] = useState<CanvasBlockId | null>(null);
  const [newItemTexts, setNewItemTexts] = useState<{ [key in CanvasBlockId]?: string }>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Add a new item to a block
  const handleAddItem = (blockId: CanvasBlockId) => {
    const text = newItemTexts[blockId]?.trim();
    if (!text) return;

    const newItem: BMCItem = {
      id: `${blockId}-${Date.now()}`,
      text: text,
      isAiEnriched: false,
    };

    const updatedItems = [...(canvas[blockId] as BMCItem[]), newItem];
    onChange({
      ...canvas,
      [blockId]: updatedItems,
    });

    setNewItemTexts({
      ...newItemTexts,
      [blockId]: '',
    });
  };

  // Delete an item from a block
  const handleDeleteItem = (blockId: CanvasBlockId, itemId: string) => {
    const updatedItems = (canvas[blockId] as BMCItem[]).filter(item => item.id !== itemId);
    onChange({
      ...canvas,
      [blockId]: updatedItems,
    });
  };

  // Start editing an item
  const startEditing = (item: BMCItem) => {
    setEditingItemId(item.id);
    setEditingText(item.text);
  };

  // Save the edited item
  const saveEditing = (blockId: CanvasBlockId, itemId: string) => {
    if (!editingText.trim()) return;

    const updatedItems = (canvas[blockId] as BMCItem[]).map(item =>
      item.id === itemId ? { ...item, text: editingText.trim() } : item
    );

    onChange({
      ...canvas,
      [blockId]: updatedItems,
    });

    setEditingItemId(null);
  };

  // Render a block card
  const renderBlock = (blockId: CanvasBlockId, extraClasses: string = '') => {
    const config = CANVAS_BLOCKS_CONFIG[blockId];
    const items = canvas[blockId] as BMCItem[];
    const isEnriching = isLoadingEnrich === blockId;
    const isValueProp = blockId === 'valuePropositions';

    return (
      <div
        className={`rounded-xl border p-3.5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group relative ${
          isValueProp 
            ? 'border-indigo-200 bg-indigo-50/10' 
            : 'bg-white border-slate-200'
        } hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100/40 ${extraClasses}`}
        id={`bmc-block-${blockId}`}
        key={blockId}
      >
        {/* Block Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg" role="img" aria-label={config.title}>
              {config.emoji}
            </span>
            <div>
              <h4 className={`font-black text-xs tracking-tight uppercase ${isValueProp ? 'text-indigo-600' : 'text-slate-700'}`}>
                {config.title}
              </h4>
              <p className="text-[9px] text-slate-400 font-bold leading-none mt-0.5">{config.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Tooltip with questions */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveQuestionTooltip(blockId)}
                onMouseLeave={() => setActiveQuestionTooltip(null)}
                onClick={() => setActiveQuestionTooltip(activeQuestionTooltip === blockId ? null : blockId)}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                type="button"
                id={`q-btn-${blockId}`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {activeQuestionTooltip === blockId && (
                <div
                  className="absolute right-0 top-6 w-64 bg-slate-900 text-white text-[11px] rounded-lg p-3 shadow-xl z-20 border border-slate-800"
                  id={`tooltip-${blockId}`}
                >
                  <p className="font-bold mb-1 border-b border-slate-700 pb-1 text-indigo-400">Preguntas Clave:</p>
                  <ul className="list-disc pl-3 space-y-1 text-slate-300">
                    {config.questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* AI Enrich Button */}
            <button
              onClick={() => onEnrichBlock(blockId)}
              disabled={isEnriching}
              className="text-indigo-600 hover:text-white hover:bg-indigo-600 disabled:opacity-50 p-1 rounded-full border border-indigo-100 hover:border-indigo-600 transition-all flex items-center justify-center bg-indigo-50"
              title="Enriquecer este bloque con Inteligencia Artificial"
              id={`enrich-btn-${blockId}`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-grow my-1.5 min-h-[90px] overflow-y-auto max-h-[220px] pr-1" id={`items-container-${blockId}`}>
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-[11px] italic text-center px-4 py-6 border border-dashed border-slate-200 rounded-lg">
              Lienzo vacío listo para estructurar.
            </div>
          ) : (
            <div className="space-y-1">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between gap-1.5 p-1.5 rounded-lg text-xs group/item transition-all ${
                    item.isAiEnriched
                      ? 'bg-indigo-50/60 border border-indigo-100/80 text-slate-800 font-medium'
                      : 'bg-slate-50 border border-slate-200 text-slate-700'
                  }`}
                  id={`item-${item.id}`}
                >
                  <div className="flex-grow">
                    {editingItemId === item.id ? (
                      <div className="flex gap-1 items-center">
                        <input
                          type="text"
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && saveEditing(blockId, item.id)}
                          className="w-full bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          autoFocus
                          id={`edit-input-${item.id}`}
                        />
                        <button
                          onClick={() => saveEditing(blockId, item.id)}
                          className="p-0.5 text-indigo-600 hover:bg-indigo-100 rounded"
                          id={`save-edit-${item.id}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="break-words leading-tight">
                        {item.text}
                        {item.isAiEnriched && (
                          <span className="inline-block ml-1 text-[8px] bg-indigo-100 text-indigo-800 font-bold px-1 py-0.2 rounded-full scale-90 select-none">
                            IA
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                    {editingItemId !== item.id && (
                      <button
                        onClick={() => startEditing(item)}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-white"
                        title="Editar idea"
                        id={`edit-btn-${item.id}`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(blockId, item.id)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-white"
                      title="Eliminar idea"
                      id={`delete-btn-${item.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add input */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center gap-1.5 shrink-0">
          <input
            type="text"
            placeholder={config.placeholder}
            value={newItemTexts[blockId] || ''}
            onChange={e => setNewItemTexts({ ...newItemTexts, [blockId]: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleAddItem(blockId)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-300 transition-all placeholder:text-slate-400"
            id={`add-input-${blockId}`}
          />
          <button
            onClick={() => handleAddItem(blockId)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors shrink-0"
            id={`add-btn-${blockId}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4" id="canvas-grid-section">
      {/* Title / Description block */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" id="canvas-info-banner">
        <div className="flex-grow space-y-1 w-full">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100/80">
              Lienzo Activo
            </span>
          </div>
          <input
            type="text"
            placeholder="Introduce el nombre de tu Proyecto/Idea..."
            value={canvas.projectName}
            onChange={e => onChange({ ...canvas, projectName: e.target.value })}
            className="w-full text-lg font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5 transition-all font-sans"
            id="input-project-name"
          />
          <input
            type="text"
            placeholder="Describe brevemente de qué se trata..."
            value={canvas.description}
            onChange={e => onChange({ ...canvas, description: e.target.value })}
            className="w-full text-xs text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5 transition-all font-medium"
            id="input-project-desc"
          />
        </div>
      </div>

      {/* Main Upper Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5" id="bmc-main-table">
        {/* Row 1: Key Partnerships (🔗) */}
        {renderBlock('keyPartnerships', 'lg:row-span-2')}

        {/* Row 1, Col 2: Key Activities (⚡) and Key Resources (🛠️) stacked */}
        <div className="flex flex-col gap-3.5">
          {renderBlock('keyActivities', 'flex-grow')}
          {renderBlock('keyResources', 'flex-grow')}
        </div>

        {/* Row 1, Col 3: Value Propositions (🎁) */}
        {renderBlock('valuePropositions', 'lg:row-span-2')}

        {/* Row 1, Col 4: Customer Relationships (❤️) and Channels (🚚) stacked */}
        <div className="flex flex-col gap-3.5">
          {renderBlock('customerRelationships', 'flex-grow')}
          {renderBlock('channels', 'flex-grow')}
        </div>

        {/* Row 1, Col 5: Customer Segments (👥) */}
        {renderBlock('customerSegments', 'lg:row-span-2')}
      </div>

      {/* Bottom Row: Cost Structure (💰) and Revenue Streams (💵) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5" id="bmc-bottom-table">
        {renderBlock('costStructure')}
        {renderBlock('revenueStreams')}
      </div>
    </div>
  );
}
