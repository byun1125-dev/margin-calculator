'use client';

import { useState, useEffect } from 'react';
import { PlatformConfig } from '@/types/platform';
import { Input } from '@/components/ui/Input';
import { X } from 'lucide-react';

interface PlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (platform: PlatformConfig) => void;
  editingPlatform?: PlatformConfig;
}

const PRESET_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#6366F1', '#000000',
];

export function PlatformModal({ isOpen, onClose, onSave, editingPlatform }: PlatformModalProps) {
  const [formData, setFormData] = useState<Partial<PlatformConfig>>({
    id: '',
    name: '',
    color: '#6366F1',
    salesCommission: { min: 0, max: 0, default: 0 },
    paymentFee: { min: 0, max: 0, default: 0 },
    description: '',
  });

  useEffect(() => {
    if (editingPlatform) {
      setFormData(editingPlatform);
    } else {
      setFormData({
        id: '',
        name: '',
        color: '#6366F1',
        salesCommission: { min: 0, max: 0, default: 0 },
        paymentFee: { min: 0, max: 0, default: 0 },
        description: '',
      });
    }
  }, [editingPlatform, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const platform: PlatformConfig = {
      id: formData.id || `custom-${Date.now()}`,
      name: formData.name || '',
      color: formData.color || '#6366F1',
      salesCommission: formData.salesCommission || { min: 0, max: 0, default: 0 },
      paymentFee: formData.paymentFee || { min: 0, max: 0, default: 0 },
      description: formData.description || '',
      isCustom: true,
    };

    onSave(platform);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {editingPlatform ? '플랫폼 수정' : '커스텀 플랫폼 추가'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Input
            label="플랫폼 이름"
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="예: 자체 개발 플랫폼"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              플랫폼 색상
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={formData.color || '#6366F1'}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">판매 수수료율 (%)</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="최소"
                type="number"
                step="0.01"
                value={formData.salesCommission?.min || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salesCommission: {
                      ...formData.salesCommission!,
                      min: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
              <Input
                label="최대"
                type="number"
                step="0.01"
                value={formData.salesCommission?.max || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salesCommission: {
                      ...formData.salesCommission!,
                      max: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
              <Input
                label="기본값"
                type="number"
                step="0.01"
                value={formData.salesCommission?.default || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salesCommission: {
                      ...formData.salesCommission!,
                      default: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">결제 수수료율 (%)</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="최소"
                type="number"
                step="0.01"
                value={formData.paymentFee?.min || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentFee: {
                      ...formData.paymentFee!,
                      min: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
              <Input
                label="최대"
                type="number"
                step="0.01"
                value={formData.paymentFee?.max || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentFee: {
                      ...formData.paymentFee!,
                      max: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
              <Input
                label="기본값"
                type="number"
                step="0.01"
                value={formData.paymentFee?.default || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentFee: {
                      ...formData.paymentFee!,
                      default: parseFloat(e.target.value) / 100 || 0,
                    },
                  })
                }
                suffix="%"
                min={0}
                max={100}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명 (선택)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="플랫폼에 대한 간단한 설명"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {editingPlatform ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
