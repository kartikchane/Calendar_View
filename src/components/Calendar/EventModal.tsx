import React, { useState, useEffect, FormEvent } from 'react';
import { EventModalProps, EventFormData, FormErrors, CalendarEvent } from './CalendarView.types';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import { Select } from '@/components/primitives/Select';
import { EVENT_COLORS, EVENT_CATEGORIES, validateEvent } from '@/utils/event.utils';
import clsx from 'clsx';

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: initialDate || new Date(),
    endDate: initialDate || new Date(),
    color: EVENT_COLORS[0].value,
    category: EVENT_CATEGORIES[0],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        startDate: event.startDate,
        endDate: event.endDate,
        color: event.color || EVENT_COLORS[0].value,
        category: event.category || EVENT_CATEGORIES[0],
      });
    } else if (initialDate) {
      const endDate = new Date(initialDate);
      endDate.setHours(initialDate.getHours() + 1);
      
      setFormData({
        title: '',
        description: '',
        startDate: initialDate,
        endDate,
        color: EVENT_COLORS[0].value,
        category: EVENT_CATEGORIES[0],
      });
    }
    setErrors({});
  }, [event, initialDate, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleDateTimeChange = (name: 'startDate' | 'endDate', value: string) => {
    const date = new Date(value);
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const eventData: Partial<CalendarEvent> = {
      ...formData,
      id: event?.id,
    };

    const validationErrors = validateEvent(eventData);
    
    if (validationErrors.length > 0) {
      const errorObj: FormErrors = {};
      validationErrors.forEach((error) => {
        if (error.includes('Title')) errorObj.title = error;
        if (error.includes('Description')) errorObj.description = error;
        if (error.includes('Start date')) errorObj.startDate = error;
        if (error.includes('End date')) errorObj.endDate = error;
      });
      setErrors(errorObj);
      return;
    }

    onSave(eventData as CalendarEvent);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const formatDateTimeValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
      description={event ? 'Update event details' : 'Add a new event to your calendar'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Title <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            className={clsx(
              'w-full px-3 py-2 border rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-colors duration-200',
              errors.title ? 'border-error-500' : 'border-neutral-300'
            )}
            placeholder="Event title"
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1.5 text-sm text-error-500" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            maxLength={500}
            rows={3}
            className={clsx(
              'w-full px-3 py-2 border rounded-lg resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-colors duration-200',
              errors.description ? 'border-error-500' : 'border-neutral-300'
            )}
            placeholder="Event description (optional)"
            aria-invalid={errors.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && (
            <p id="description-error" className="mt-1.5 text-sm text-error-500" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Start <span className="text-error-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formatDateTimeValue(formData.startDate)}
              onChange={(e) => handleDateTimeChange('startDate', e.target.value)}
              className={clsx(
                'w-full px-3 py-2 border rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-colors duration-200',
                errors.startDate ? 'border-error-500' : 'border-neutral-300'
              )}
              aria-invalid={errors.startDate ? 'true' : 'false'}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            />
            {errors.startDate && (
              <p id="startDate-error" className="mt-1.5 text-sm text-error-500" role="alert">
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
              End <span className="text-error-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formatDateTimeValue(formData.endDate)}
              onChange={(e) => handleDateTimeChange('endDate', e.target.value)}
              className={clsx(
                'w-full px-3 py-2 border rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'transition-colors duration-200',
                errors.endDate ? 'border-error-500' : 'border-neutral-300'
              )}
              aria-invalid={errors.endDate ? 'true' : 'false'}
              aria-describedby={errors.endDate ? 'endDate-error' : undefined}
            />
            {errors.endDate && (
              <p id="endDate-error" className="mt-1.5 text-sm text-error-500" role="alert">
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map((colorOption) => (
              <button
                key={colorOption.value}
                type="button"
                onClick={() => handleColorChange(colorOption.value)}
                className={clsx(
                  'w-10 h-10 rounded-lg border-2 transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  formData.color === colorOption.value
                    ? 'border-neutral-900 scale-110'
                    : 'border-neutral-300 hover:scale-105'
                )}
                style={{ backgroundColor: colorOption.value }}
                aria-label={`Select ${colorOption.name} color`}
                aria-pressed={formData.color === colorOption.value}
              />
            ))}
          </div>
        </div>

        {/* Category */}
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          options={EVENT_CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
          fullWidth
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            {event && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                aria-label="Delete event"
              >
                Delete
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
