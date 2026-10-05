import React, { useState } from 'react';
import {
  FileDiff,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  DollarSign,
  Clock,
  Check,
  Edit2,
  Trash2,
  Search
} from 'lucide-react';
import { ChangeLogItem, ChangeReviewStatus } from '../../../types/changeLog';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge, BadgeVariant } from '../../common/Badge';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';
import { Textarea } from '../../common/Textarea';
import { ChangeModal } from './ChangeModal';
import {
  calculateNetApprovedCostImpact,
  calculateNetApprovedScheduleImpactDays,
  countPendingChanges
} from '../../../services/changeLogService';
import { APP_CONFIG } from '../../../config/appConfig';

export const ChangeLogList: React.FC = () => {
  const {
    changeLogs,
    activeProject,
    addChangeLogItem,
    updateChangeLogStatus,
    updateChangeLogItem,
    deleteChangeLogItem
  } = useProject();
  const { role } = useRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChangeLogItem | null>(null);
  const [reviewingItem, setReviewingItem] = useState<ChangeLogItem | null>(null);
  const [reviewStatusChoice, setReviewStatusChoice] = useState<ChangeReviewStatus>('Approved');
  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeProject) return null;

  const isClientRole = role === 'client';
  const pendingCount = countPendingChanges(changeLogs);
  const netApprovedCost = calculateNetApprovedCostImpact(changeLogs);
  const netApprovedDays = calculateNetApprovedScheduleImpactDays(changeLogs);

  const filteredChanges = changeLogs.filter((change) => {
    const matchesStatus = statusFilter === 'ALL' || change.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      change.title.toLowerCase().includes(query) ||
      change.changeNumber.toLowerCase().includes(query) ||
      change.requestedBy.toLowerCase().includes(query) ||
      change.description.toLowerCase().includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ChangeLogItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: Omit<ChangeLogItem, 'id' | 'changeNumber'>, editingId?: string) => {
    if (editingId) {
      const existing = changeLogs.find((c) => c.id === editingId);
      if (existing) {
        updateChangeLogItem({
          ...existing,
          ...itemData
        });
      }
    } else {
      addChangeLogItem(itemData);
    }
  };

  const handleDelete = (id: string, changeNumber: string) => {
    if (window.confirm(`Delete scope change ${changeNumber}?`)) {
      deleteChangeLogItem(id);
    }
  };

  const handleOpenReview = (item: ChangeLogItem) => {
    setReviewingItem(item);
    setReviewStatusChoice(item.status === 'Pending Review' ? 'Approved' : item.status);
    setReviewNotesInput(item.reviewNotes || '');
  };

  const handleSaveReview = () => {
    if (reviewingItem) {
      updateChangeLogStatus(reviewingItem.id, reviewStatusChoice, reviewNotesInput);
      setReviewingItem(null);
    }
  };

  const getStatusBadgeVariant = (status: ChangeReviewStatus): BadgeVariant => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Pending Review':
        return 'pending-review';
      case 'Rejected':
        return 'rejected';
    }
  };

  return (
    <div className="main-view-container">
      {/* Header and Summary Cards */}
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
              <FileDiff size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Change Review Log</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Official project variation register, cost &amp; schedule variance governance
            </p>
          </div>

          {!isClientRole && (
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              icon={<Plus size={16} />}
            >
              Record Change
            </Button>
          )}
        </div>

        {/* Impact Metric Chips */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ padding: '10px 14px', background: 'var(--amber-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--amber-border)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--amber-primary)', fontWeight: 700 }}>
              Pending Review
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--amber-primary)', fontFamily: 'var(--font-mono)' }}>
              {pendingCount} requests
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--emerald-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--emerald-border)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--emerald-primary)', fontWeight: 700 }}>
              Net Approved Cost Impact
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-primary)' }}>
              {APP_CONFIG.currencySymbol}
              {netApprovedCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--blue-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-border)' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--blue-primary)', fontWeight: 700 }}>
              Schedule Impact
            </span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--blue-primary)', fontFamily: 'var(--font-mono)' }}>
              {netApprovedDays > 0 ? `+${netApprovedDays}` : netApprovedDays} Days
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'Pending Review', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                type="button"
                className={`role-tab-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'ALL' ? `All (${changeLogs.length})` : st}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search
              size={13}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search change title or ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ minHeight: '32px', paddingLeft: '32px', fontSize: '12px', width: '100%' }}
            />
          </div>
        </div>
      </Card>

      {/* Change Log Items List */}
      {changeLogs.length === 0 ? (
        <EmptyState
          icon={<FileDiff className="empty-state-icon" />}
          title="No changes have been logged."
          description="Log variations, scope adjustments, and client directives for review."
          actionText={!isClientRole ? 'Record First Change' : undefined}
          onAction={!isClientRole ? handleOpenAdd : undefined}
          actionIcon={<Plus size={15} />}
        />
      ) : filteredChanges.length === 0 ? (
        <div className="empty-state-box">
          <p className="empty-state-title">No changes match the active filter or search.</p>
          <Button
            variant="secondary"
            size="sm"
            style={{ marginTop: '8px' }}
            onClick={() => {
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredChanges.map((change) => (
            <Card key={change.id}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '12px',
                        background: 'var(--bg-subtle)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {change.changeNumber}
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {change.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={getStatusBadgeVariant(change.status)}>
                      {change.status}
                    </Badge>

                    {!isClientRole && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenReview(change)}
                          title="Review / Set Status"
                        >
                          Review
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(change)}
                          title="Edit Details"
                          aria-label={`Edit ${change.changeNumber}`}
                          icon={<Edit2 size={12} />}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(change.id, change.changeNumber)}
                          title="Delete Change"
                          aria-label={`Delete ${change.changeNumber}`}
                          icon={<Trash2 size={12} />}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <strong>Scope Details: </strong>
                  {change.description}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Justification: </strong>
                  {change.reason}
                </div>

                {/* Variance Info */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '8px 12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={13} color="var(--blue-primary)" />
                    Cost Impact:{' '}
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>
                      {change.costImpact >= 0 ? `+${APP_CONFIG.currencySymbol}` : `-${APP_CONFIG.currencySymbol}`}
                      {Math.abs(change.costImpact).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </strong>
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="var(--blue-primary)" />
                    Schedule Impact:{' '}
                    <strong>
                      {change.scheduleImpactDays >= 0 ? `+${change.scheduleImpactDays}` : change.scheduleImpactDays} days
                    </strong>
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="var(--text-muted)" />
                    Requested by: <strong>{change.requestedBy}</strong>
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    {change.dateRequested}
                  </span>
                </div>

                {/* Review Notes Callout */}
                {change.reviewNotes && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '6px 10px', borderLeft: '3px solid var(--blue-primary)', background: 'var(--bg-canvas)' }}>
                    <strong>Review Note ({change.reviewedDate || 'Recent'}): </strong>
                    {change.reviewNotes}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Change Modal */}
      <ChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
        projectId={activeProject.id}
      />

      {/* Review Status Modal */}
      <Modal
        isOpen={Boolean(reviewingItem)}
        onClose={() => setReviewingItem(null)}
        title={`Review Change: ${reviewingItem?.changeNumber}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReviewingItem(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveReview}>
              Save Review Decision
            </Button>
          </>
        }
      >
        {reviewingItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <strong style={{ fontSize: '14px' }}>{reviewingItem.title}</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Requested by {reviewingItem.requestedBy} on {reviewingItem.dateRequested}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Review Status Decision</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['Pending Review', 'Approved', 'Rejected'] as ChangeReviewStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`role-tab-btn ${reviewStatusChoice === st ? 'active' : ''}`}
                    onClick={() => setReviewStatusChoice(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Review / Approval Notes"
              placeholder="e.g. Approved by Client Representative Sarah Jenkins on 2026-09-20..."
              value={reviewNotesInput}
              onChange={(e) => setReviewNotesInput(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
