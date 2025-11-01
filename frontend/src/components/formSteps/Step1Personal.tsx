import React, { useState, useEffect } from 'react';
import type { FormPayload } from '../../types/form';

interface Props {
    data: Partial<FormPayload>;
    update: (patch: Partial<FormPayload>) => void;
}

export const Step1Personal: React.FC<Props> = ({ data, update }) => {
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    // validation logic
    const validate = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'firstName':
                if (!value.trim()) error = 'First name is required.';
                break;
            case 'lastName':
                if (!value.trim()) error = 'Last name is required.';
                break;
            case 'email':
                if (!value.trim()) error = 'Email is required.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    error = 'Invalid email format.';
                break;
            case 'phone':
                if (!value.trim()) error = 'Phone number is required.';
                else if (!/^\d{10}$/.test(value))
                    error = 'Phone number must be 10 digits.';
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    // validate on every change
    useEffect(() => {
        if (data.firstName) validate('firstName', data.firstName);
        if (data.lastName) validate('lastName', data.lastName);
        if (data.email) validate('email', data.email);
        if (data.phone) validate('phone', data.phone);
    }, [data]);

    return (
        <div className="step">
            <label>
                First name
                <input
                    type="text"
                    value={data.firstName ?? ''}
                    onChange={(e) => {
                        update({ firstName: e.target.value });
                        validate('firstName', e.target.value);
                    }}
                    required
                />
                {errors.firstName && <span className="error">{errors.firstName}</span>}
            </label>

            <label>
                Last name
                <input
                    type="text"
                    value={data.lastName ?? ''}
                    onChange={(e) => {
                        update({ lastName: e.target.value });
                        validate('lastName', e.target.value);
                    }}
                    required
                />
                {errors.lastName && <span className="error">{errors.lastName}</span>}
            </label>

            <label>
                Email
                <input
                    type="email"
                    value={data.email ?? ''}
                    onChange={(e) => {
                        update({ email: e.target.value });
                        validate('email', e.target.value);
                    }}
                    required
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label>
                Phone
                <input
                    type="tel"
                    value={data.phone ?? ''}
                    onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, '');
                        update({ phone: onlyNums });
                        validate('phone', onlyNums);
                    }}
                    maxLength={10}
                    placeholder="Enter phone number"
                    required
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
            </label>

            <style>{`
        .error {
          color: red;
          font-size: 0.85rem;
          margin-top: 4px;
        }
        label {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }
        input {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        input:invalid {
          border-color: red;
        }
      `}</style>
        </div>
    );
};
