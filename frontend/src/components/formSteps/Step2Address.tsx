import React, { useState } from 'react';
import type { FormPayload, Address } from '../../types/form';

interface Props {
    data: Partial<FormPayload>;
    update: (patch: Partial<FormPayload>) => void;
}

export const Step2Address: React.FC<Props> = ({ data, update }) => {
    // ensure we always treat `current` as a fully-populated Address
    const current: Address = {
        line1: data.address?.line1 ?? '',
        line2: data.address?.line2 ?? '',
        city: data.address?.city ?? '',
        state: data.address?.state ?? '',
        country: data.address?.country ?? '',
        zip: data.address?.zip ?? '',
    };

    const [errors, setErrors] = useState({
        line1: '',
        city: '',
        state: '',
        country: '',
        zip: '',
    });

    const validateField = (field: keyof Address, value: string) => {
        let error = '';

        switch (field) {
            case 'line1':
                if (!value.trim()) error = 'Address line 1 is required';
                break;
            case 'city':
                if (!value.trim()) error = 'City is required';
                break;
            case 'state':
                if (!value.trim()) error = 'State is required';
                break;
            case 'country':
                if (!value.trim()) error = 'Country is required';
                break;
            case 'zip':
                if (!value.trim()) error = 'ZIP is required';
                else if (!/^\d{6}$/.test(value)) error = 'ZIP must be a 6-digit number';
                break;
            // line2 has no validation
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    // Always build a full Address object before calling update
    const handleChange = (field: keyof Address, rawValue: string) => {
        let value = rawValue;

        if (field === 'zip') {
            value = value.replace(/\D/g, ''); // allow only digits
        }

        // Use current (complete Address) and override only the changed field
        const next: Address = {
            ...current,
            [field]: value,
        };

        update({ address: next });
        validateField(field, value);
    };

    return (
        <div className="step">
            <label>
                Address line 1
                <input
                    type="text"
                    value={current.line1}
                    onChange={(e) => handleChange('line1', e.target.value)}
                    required
                />
                {errors.line1 && <p className="error">{errors.line1}</p>}
            </label>

            <label>
                Address line 2
                <input
                    type="text"
                    value={current.line2 ?? ''}
                    onChange={(e) => handleChange('line2', e.target.value)}
                />
            </label>

            <label>
                City
                <input
                    type="text"
                    value={current.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    required
                />
                {errors.city && <p className="error">{errors.city}</p>}
            </label>

            <label>
                State
                <input
                    type="text"
                    value={current.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    required
                />
                {errors.state && <p className="error">{errors.state}</p>}
            </label>

            <label>
                Country
                <input
                    type="text"
                    value={current.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    required
                />
                {errors.country && <p className="error">{errors.country}</p>}
            </label>

            <label>
                ZIP
                <input
                    type="text"
                    value={current.zip}
                    maxLength={6}
                    onChange={(e) => handleChange('zip', e.target.value)}
                    required
                />
                {errors.zip && <p className="error">{errors.zip}</p>}
            </label>

            <style>{`
        .error {
          color: #d9534f;
          font-size: 0.85rem;
          margin-top: 4px;
        }
      `}</style>
        </div>
    );
};
