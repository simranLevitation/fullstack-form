import React from 'react';
import type { FormPayload } from '../../types/form';

interface Props {
    data: Partial<FormPayload>;
}

export const Step4Review: React.FC<Props> = ({ data }) => {
    const { firstName, lastName, email, phone, address, files } = data;

    return (
        <div className="step">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
                Review Your Details
            </h3>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    backgroundColor: '#fafafa',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                }}
            >
                <section>
                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Personal Info</h4>
                    <p><strong>First Name:</strong> {firstName || '-'}</p>
                    <p><strong>Last Name:</strong> {lastName || '-'}</p>
                    <p><strong>Email:</strong> {email || '-'}</p>
                    <p><strong>Phone:</strong> {phone || '-'}</p>
                </section>

                <section>
                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Address</h4>
                    {address ? (
                        <div>
                            <p><strong>Line 1:</strong> {address.line1}</p>
                            {address.line2 && <p><strong>Line 2:</strong> {address.line2}</p>}
                            <p><strong>City:</strong> {address.city}</p>
                            <p><strong>State:</strong> {address.state}</p>
                            <p><strong>Country:</strong> {address.country}</p>
                            <p><strong>Zip:</strong> {address.zip}</p>
                        </div>
                    ) : (
                        <p>No address provided</p>
                    )}
                </section>

                <section>
                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Uploaded Files</h4>
                    {files && files.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="file-row"
                                    style={{
                                        border: '1px solid #ddd',
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <p><strong>File Name:</strong> {file.originalname}</p>
                                    <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                                    {file.path && (
                                        <a
                                            href={file.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#007bff', textDecoration: 'underline' }}
                                        >
                                            View File
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No files uploaded</p>
                    )}
                </section>
            </div>
        </div>
    );
};
