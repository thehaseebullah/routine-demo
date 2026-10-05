import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Edit2,
  Trash2,
  Clock,
  User,
  Calendar,
  Layers,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../../types/task';
import { useProject } from '../../../context/ProjectContext';
import { useRole } from '../../../context/RoleContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Badge, BadgeVariant } from '../../common/Badge';
import { ProgressBar } from '../../common/ProgressBar';
import { EmptyState } from '../../common/EmptyState';
import { TaskModal } from './TaskModal';

export const TaskList: React.FC = () => {
  const { tasks, activeProject, addTask, updateTask, updateTaskStatusAndProgress, deleteTask } = useProject();
  const { role } = useRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!activeProject) return null;

  const isClientRole = role === 'client';

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.assignee.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query));
    return matchesStatus && matchesPriority && matchesQuery;
  });

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSave = (taskData: Omit<Task, 'id'>, editingId?: string) => {
    if (editingId) {
      const existing = tasks.find((t) => t.id === editingId);
      if (existing) {
        updateTask({
          ...existing,
          ...taskData
        });
      }
    } else {
      addTask(taskData);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete task: "${title}"?`)) {
      deleteTask(id);
    }
  };

  const handleToggleComplete = (task: Task) => {
    if (task.status === 'Completed') {
      updateTaskStatusAndProgress(task.id, 'In Progress', 50);
    } else {
      updateTaskStatusAndProgress(task.id, 'Completed', 100);
    }
  };

  const getStatusBadgeVariant = (status: TaskStatus): BadgeVariant => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'In Progress':
        return 'in-progress';
      case 'Not Started':
        return 'not-started';
    }
  };

  const getPriorityBadgeVariant = (priority: TaskPriority): BadgeVariant => {
    switch (priority) {
      case 'Urgent':
        return 'urgent';
      case 'High':
        return 'delayed';
      case 'Medium':
        return 'in-progress';
      case 'Low':
        return 'default';
    }
  };

  return (
    <div className="main-view-container">
      {/* Task Section Header */}
      <Card>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={18} color="var(--blue-primary)" />
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Project Tasks</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Site operations schedule, assignments, and execution progress
            </p>
          </div>

          {!isClientRole && (
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              icon={<Plus size={16} />}
            >
              Add Task
            </Button>
          )}
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            {['ALL', 'Not Started', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                type="button"
                className={`role-tab-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'ALL' ? `All (${tasks.length})` : s}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '180px' }}>
              <Search
                size={13}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search tasks or assignees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ minHeight: '30px', paddingLeft: '30px', fontSize: '12px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Priority:
              </span>
              <select
                className="form-select"
                style={{ minHeight: '30px', padding: '2px 8px', fontSize: '12px' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="ALL">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Tasks List or Empty State */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="empty-state-icon" />}
          title="No tasks have been created yet."
          description="Create your first construction activity or engineering milestone."
          actionText={!isClientRole ? 'Create First Task' : undefined}
          onAction={!isClientRole ? handleOpenAdd : undefined}
          actionIcon={<Plus size={15} />}
        />
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state-box">
          <p className="empty-state-title">No tasks match the active filters.</p>
          <Button
            variant="secondary"
            size="sm"
            style={{ marginTop: '8px' }}
            onClick={() => {
              setStatusFilter('ALL');
              setPriorityFilter('ALL');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.map((task) => (
            <Card key={task.id} className="task-card-item">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {!isClientRole && (
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(task)}
                        title={task.status === 'Completed' ? 'Mark In Progress' : 'Mark Completed'}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: task.status === 'Completed' ? 'var(--status-success-text)' : 'var(--text-muted)'
                        }}
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <div>
                      <h3
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          textDecoration: task.status === 'Completed' ? 'line-through' : 'none'
                        }}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                    {!isClientRole && (
                      <div style={{ display: 'inline-flex', gap: '2px', marginLeft: '6px' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(task)}
                          aria-label={`Edit ${task.title}`}
                          icon={<Edit2 size={13} />}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(task.id, task.title)}
                          aria-label={`Delete ${task.title}`}
                          icon={<Trash2 size={13} />}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Execution: {task.progress}%</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                  <ProgressBar progress={task.progress} />
                </div>

                {/* Footer metadata */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="var(--text-muted)" />
                    {task.assignee}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    Target: {task.dueDate}
                  </span>
                  {task.boqReferenceDesc && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--blue-primary)' }}>
                      <Layers size={13} />
                      BOQ: {task.boqReferenceDesc}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingTask={editingTask}
        projectId={activeProject.id}
      />
    </div>
  );
};
