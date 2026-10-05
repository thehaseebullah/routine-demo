import React, { useState, useEffect } from 'react';
import { BOQItem } from '../../../types/boq';
import { Modal } from '../../common/Modal';
import { Input } from '../../common/Input';
import { Select } from '../../common/Select';
import { Textarea } from '../../common/Textarea';
import { Button } from '../../common/Button';
import { APP_CONFIG } from '../../../config/appConfig';
import { calculateBOQAmount } from '../../../services/boqService';

interface BOQItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<BOQItem, 'id' | 'amount'>, editingId?: string) => void;
  editingItem?: BOQItem | null;
  projectId: string;
}

export const BOQItemModal: React.FC<BOQItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  projectId
}) => {
  const [itemNumber, setItemNumber] = useState('');
  const [category, setCategory] = useState(APP_CONFIG.boqCategories[0]);
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState(APP_CONFIG.defaultUnits[0]);
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [rate, setRate] = useState<number | ''>(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setItemNumber(editingItem.itemNumber);
      setCategory(editingItem.category);
      setDescription(editingItem.description);
      setUnit(editingItem.unit);
      setQuantity(editingItem.quantity);
      setRate(editingItem.rate);
      setNotes(editingItem.notes || '');
    } else {
      setItemNumber('');
      setCategory(APP_CONFIG.boqCategories[0]);
      setDescription('');
      setUnit(APP_CONFIG.defaultUnits[0]);
      setQuantity(1);
      setRate(0);
      setNotes('');
    }
    setErrors({});
  }, [editingItem, isOpen]);

  // Real-time calculated line amount
  const liveAmount = calculateBOQAmount(Number(quantity) || 0, Number(rate) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = 'Item description is required.';
    }
    if (quantity === '' || Number(quantity) < 0) {
      newErrors.quantity = 'Quantity must be zero or a positive number.';
    }
    if (rate === '' || Number(rate) < 0) {
      newErrors.rate = 'Unit rate must be zero or a positive number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(
      {
        projectId,
        itemNumber: itemNumber.trim() || '1.00',
        category,
        description: description.trim(),
        unit,
        quantity: Number(quantity) || 0,
        rate: Number(rate) || 0,
        notes: notes.trim()
      },
      editingItem?.id
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit BOQ Line Item' : 'Add BOQ Line Item'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingItem ? 'Update Line Item' : 'Add Item to BOQ'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-row">
          <Input
            label="Item / Spec Number"
            placeholder="e.g. 2.04"
            value={itemNumber}
            onChange={(e) => setItemNumber(e.target.value)}
            helperText="Section line reference"
          />

          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {APP_CONFIG.boqCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Item Description *"
          placeholder="e.g. Double-stud acoustic drywall partition system"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          error={errors.description}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Select
            label="Measurement Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {APP_CONFIG.defaultUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>

          <Input
            label="Quantity *"
            type="number"
            step="any"
            min="0"
            value={quantity}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : parseFloat(e.target.value);
              setQuantity(val);
              if (errors.quantity) setErrors({ ...errors, quantity: '' });
            }}
            error={errors.quantity}
            required
          />

          <Input
            label={`Unit Rate (${APP_CONFIG.currencySymbol}) *`}
            type="number"
            step="0.01"
            min="0"
            value={rate}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : parseFloat(e.target.value);
              setRate(val);
              if (errors.rate) setErrors({ ...errors, rate: '' });
            }}
            error={errors.rate}
            required
          />
        </div>

        {/* Real-time Calculated Amount Display */}
        <div
          style={{
            padding: '12px 14px',
            background: 'var(--blue-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--blue-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--blue-primary)', fontWeight: 600 }}>
            Calculated Line Amount (Quantity × Rate):
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue-primary)'
            }}
          >
            {APP_CONFIG.currencySymbol}
            {liveAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <Textarea
          label="Specification Notes / Inclusions (Optional)"
          placeholder="e.g. Includes certified haulage, Class B pressure testing, fixing brackets."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </form>
    </Modal>
  );
};
