/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BusinessModelCanvas } from '../types';
import { Copy, Check, Download, X, Code, FileText } from 'lucide-react';

interface ExportModalProps {
  canvas: BusinessModelCanvas;
  onClose: () => void;
}

export default function ExportModal({ canvas, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'json' | 'markdown'>('html');

  // Generate a beautiful standalone HTML5 template with inline Tailwind CSS CDN and modern styling
  const generateHTML = (bmc: BusinessModelCanvas) => {
    const listToHtml = (items: { text: string }[]) => {
      if (!items || items.length === 0) return `<li style="color: #9ca3af; font-style: italic; font-size: 0.875rem;">Vacío</li>`;
      return items.map(item => `<li style="margin-bottom: 0.5rem; font-size: 0.875rem; color: #374151;">• ${item.text}</li>`).join('');
    };

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Model Canvas - ${bmc.projectName || 'Mi Proyecto'}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.25rem;
            color: #111827;
        }
        .header p {
            margin: 10px 0 0 0;
            color: #4b5563;
            font-size: 1.1rem;
        }
        .canvas-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .block {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            background-color: #f9fafb;
            min-height: 180px;
            display: flex;
            flex-direction: column;
        }
        .block-title {
            font-weight: bold;
            font-size: 0.95rem;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .block-content {
            margin: 0;
            padding: 0;
            list-style: none;
            flex-grow: 1;
        }
        .double-height {
            grid-row: span 2;
        }
        /* Lower layout row (Costs & Revenues) */
        .bottom-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        @media (max-width: 1024px) {
            .canvas-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }
        @media (max-width: 768px) {
            .canvas-grid {
                grid-template-columns: 1fr;
            }
            .bottom-row {
                grid-template-columns: 1fr;
            }
            .double-height {
                grid-row: auto;
            }
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.8rem;
            color: #9ca3af;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>${bmc.projectName || 'Proyecto Sin Nombre'}</h1>
        <p>${bmc.description || 'Modelo de negocio generado y optimizado con Consultor BMC de Élite.'}</p>
    </div>

    <!-- Upper row of 5 columns -->
    <div class="canvas-grid">
        <!-- Col 1 -->
        <div class="block double-height">
            <div class="block-title">🔗 Alianzas Clave</div>
            <ul class="block-content">
                ${listToHtml(bmc.keyPartnerships)}
            </ul>
        </div>

        <!-- Col 2 -->
        <div style="display: flex; flex-direction: column; gap: 15px; grid-row: span 2;">
            <div class="block" style="flex-grow: 1; min-height: 120px;">
                <div class="block-title">⚡ Actividades Clave</div>
                <ul class="block-content">
                    ${listToHtml(bmc.keyActivities)}
                </ul>
            </div>
            <div class="block" style="flex-grow: 1; min-height: 120px;">
                <div class="block-title">🛠️ Recursos Clave</div>
                <ul class="block-content">
                    ${listToHtml(bmc.keyResources)}
                </ul>
            </div>
        </div>

        <!-- Col 3 -->
        <div class="block double-height">
            <div class="block-title">🎁 Propuesta de Valor</div>
            <ul class="block-content">
                ${listToHtml(bmc.valuePropositions)}
            </ul>
        </div>

        <!-- Col 4 -->
        <div style="display: flex; flex-direction: column; gap: 15px; grid-row: span 2;">
            <div class="block" style="flex-grow: 1; min-height: 120px;">
                <div class="block-title">❤️ Relaciones con Clientes</div>
                <ul class="block-content">
                    ${listToHtml(bmc.customerRelationships)}
                </ul>
            </div>
            <div class="block" style="flex-grow: 1; min-height: 120px;">
                <div class="block-title">🚚 Canales</div>
                <ul class="block-content">
                    ${listToHtml(bmc.channels)}
                </ul>
            </div>
        </div>

        <!-- Col 5 -->
        <div class="block double-height">
            <div class="block-title">👥 Segmentos de Clientes</div>
            <ul class="block-content">
                ${listToHtml(bmc.customerSegments)}
            </ul>
        </div>
    </div>

    <!-- Bottom row -->
    <div class="bottom-row">
        <div class="block">
            <div class="block-title">💰 Estructura de Costos</div>
            <ul class="block-content">
                ${listToHtml(bmc.costStructure)}
            </ul>
        </div>
        <div class="block">
            <div class="block-title">💵 Fuentes de Ingresos</div>
            <ul class="block-content">
                ${listToHtml(bmc.revenueStreams)}
            </ul>
        </div>
    </div>

    <div class="footer">
        Generado el ${new Date(bmc.createdAt).toLocaleDateString()} • Desarrollado con Consultor de Negocios BMC de Élite.
    </div>
</div>

</body>
</html>`;
  };

  const generateMarkdown = (bmc: BusinessModelCanvas) => {
    const listToMd = (items: { text: string }[]) => {
      if (!items || items.length === 0) return "_Por llenar_";
      return items.map(i => `- ${i.text}`).join('\n');
    };

    return `# Business Model Canvas: ${bmc.projectName || 'Mi Proyecto'}
> ${bmc.description || 'Sin descripción'}

| Alianzas Clave (🔗) | Actividades Clave (⚡) | Propuesta de Valor (🎁) | Relaciones con Clientes (❤️) | Segmentos de Clientes (👥) |
|---|---|---|---|---|
| ${bmc.keyPartnerships.map(i => i.text).join('<br>') || '_Por llenar_'} | ${bmc.keyActivities.map(i => i.text).join('<br>') || '_Por llenar_'} | ${bmc.valuePropositions.map(i => i.text).join('<br>') || '_Por llenar_'} | ${bmc.customerRelationships.map(i => i.text).join('<br>') || '_Por llenar_'} | ${bmc.customerSegments.map(i => i.text).join('<br>') || '_Por llenar_'} |
| | **Recursos Clave (🛠️)** | | **Canales (🚚)** | |
| | ${bmc.keyResources.map(i => i.text).join('<br>') || '_Por llenar_'} | | ${bmc.channels.map(i => i.text).join('<br>') || '_Por llenar_'} | |
| **Estructura de Costos (💰)** | | | **Fuentes de Ingresos (💵)** | |
| ${bmc.costStructure.map(i => i.text).join('<br>') || '_Por llenar_'} | | | ${bmc.revenueStreams.map(i => i.text).join('<br>') || '_Por llenar_'} | |

---
*Generado el ${new Date(bmc.createdAt).toLocaleDateString()} con Consultor de Negocios BMC de Élite.*`;
  };

  const getExportText = () => {
    switch (activeTab) {
      case 'html':
        return generateHTML(canvas);
      case 'json':
        return JSON.stringify(canvas, null, 2);
      case 'markdown':
        return generateMarkdown(canvas);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'html' ? 'html' : activeTab === 'json' ? 'json' : 'md';
    const mime = activeTab === 'html' ? 'text/html' : activeTab === 'json' ? 'application/json' : 'text/markdown';
    const blob = new Blob([getExportText()], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BusinessModelCanvas-${canvas.projectName.replace(/\s+/g, '-') || 'Proyecto'}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="export-modal-container">
      <div className="bg-white rounded-2xl max-w-4xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden border border-slate-150" id="export-modal">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between" id="export-modal-header">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
              <Code className="text-indigo-600 w-5 h-5" /> Exportar Modelo de Negocio
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Elige el formato de salida para exportar o copiar tu canvas.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            id="export-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2" id="export-tabs">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wide border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'html'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" /> HTML5 Completo
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wide border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> JSON Estructurado
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-4 py-2.5 font-bold text-xs uppercase tracking-wide border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'markdown'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Tabla Markdown
          </button>
        </div>

        {/* Preview Code Content */}
        <div className="flex-grow p-6 overflow-y-auto bg-slate-900 font-mono text-[11px] text-slate-300 relative" id="export-code-box">
          <pre className="whitespace-pre-wrap">{getExportText()}</pre>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4" id="export-actions">
          <span className="text-[11px] font-medium text-slate-500">
            {activeTab === 'html' && '💡 Listo para copiar y pegar en un archivo .html o CMS.'}
            {activeTab === 'json' && '⚙️ Ideal para respaldar o integrar con otros sistemas.'}
            {activeTab === 'markdown' && '📝 Perfecto para copiar directamente en Notion, GitHub o informes.'}
          </span>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95"
              id="btn-copy-code"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-indigo-400" /> ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar Código
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs transition-all shadow-sm active:scale-95"
              id="btn-download-file"
            >
              <Download className="w-4 h-4" /> Descargar Archivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
