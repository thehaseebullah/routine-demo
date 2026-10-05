import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calculator, Layers, FileSpreadsheet, Search } from 'lucide-react';
import { BOQItem } from '../../../types/boq';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { EmptyState } from '../../common/EmptyState';
import { BOQItemModal } from './BOQItemModal';
import { BOQCategorySummary } from './BOQCategorySummary';
import { calculateBOQTotal, getBOQCategorySummaries } from '../../../services/boqService';
import { APP_CONFIG } from '../../../config/appConfig';

export const BOQList: React.FC = () => {
  const { boqItems, activeProject, addBOQItem, updateBOQItem, deleteBOQItem } = useProject();
  const { role } = useRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BOQItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeProject) return null;

  const isClientRole = role === 'client';
  const totalAmount = calculateBOQTotal(boqItems);
  const categorySummaries = getBOQCategorySummaries(boqItems);

  // Filtering by category and search term
  const filteredItems = boqItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      item.description.toLowerCase().includes(query) ||
      item.itemNumber.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BOQItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: Omit<BOQItem, 'id' | 'amount'>, editingId?: string) => {
    if (editingId) {
      const existing = boqItems.find((b) => b.id === editingId);
      if (existing) {
        updateBOQItem({
          ...existing,
          ...itemData
        });
      }
    } else {
      addBOQItem(itemData);
    }
  };

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Remove BOQ item: "${description}"?`)) {
      deleteBOQItem(id);
    }
  };

  return (
    <div className="main-view-container">
      {/* Top BOQ Header Card */}
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>
                {isClientRole ? 'Bill of Quantities Summary' : 'Bill of Quantities (BOQ)'}
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Standard Schedule of Quantities, Unit Rates, and Estimated Costs
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Total Project BOQ
              </div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue-primary)'
                }}
              >
                {APP_CONFIG.currencySymbol}
                {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {!isClientRole && (
              <Button
                variant="primary"
                onClick={handleOpenAdd}
                icon={<Plus size={16} />}
              >
                Add BOQ Item
              </Button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          {categorySummaries.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                scrollbarWidth: 'none'
              }}
            >
              <button
                type="button"
                className={`role-tab-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('ALL')}
              >
                All ({boqItems.length})
              </button>
              {categorySummaries.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  className={`role-tab-btn ${selectedCategory === cat.category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.category)}
                >
                  {cat.category} ({cat.itemCount})
                </button>
              ))}
            </div>
          )}

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search items, specs, codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ minHeight: '32px', paddingLeft: '32px', fontSize: '12px', width: '100%' }}
            />
          </div>
        </div>
      </Card>

      {/* Category Cost Breakdown Cards */}
      <BOQCategorySummary summaries={categorySummaries} totalAmount={totalAmount} />

      {/* BOQ Line Items List or Empty State */}
      {boqItems.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="empty-state-icon" />}
          title="No BOQ items have been added to this project."
          description="Create your first quantified bill of quantities line item with units and rates."
          actionText={!isClientRole ? 'Add First BOQ Item' : undefined}
          onAction={!isClientRole ? handleOpenAdd : undefined}
          actionIcon={<Plus size={15} />}
        />
      ) : (
        <Card title={`Line Items (${filteredItems.length})`}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Item #</th>
                  <th style={{ width: '140px' }}>Category</th>
                  <th>Description</th>
                  <th style={{ width: '90px' }} className="num-cell">Qty</th>
                  <th style={{ width: '80px' }}>Unit</th>
                  <th style={{ width: '100px' }} className="num-cell">Rate ({APP_CONFIG.currencySymbol})</th>
                  <th style={{ width: '120px' }} className="num-cell">Amount ({APP_CONFIG.currencySymbol})</th>
                  {!isClientRole && <th style={{ width: '90px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {item.itemNumber}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          background: 'var(--bg-subtle)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.description}</div>
                      {item.notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="num-cell">{item.quantity.toLocaleString('en-US')}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.unit}</td>
                    <td className="num-cell">
                      {item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="num-cell" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {!isClientRole && (
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '4px' }}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Item"
                            aria-label={`Edit ${item.description}`}
                            icon={<Edit2 size={13} />}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id, item.description)}
                            title="Remove Item"
                            aria-label={`Remove ${item.description}`}
                            icon={<Trash2 size={13} />}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-subtle)', fontWeight: 700 }}>
                  <td colSpan={isClientRole ? 6 : 6} style={{ textAlign: 'right', fontSize: '13px' }}>
                    Total Evaluated BOQ:
                  </td>
                  <td className="num-cell" style={{ fontSize: '15px', color: 'var(--blue-primary)' }}>
                    {APP_CONFIG.currencySymbol}
                    {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  {!isClientRole && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit BOQ Modal */}
      <BOQItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
        projectId={activeProject.id}
      />
    </div>
  );
};
