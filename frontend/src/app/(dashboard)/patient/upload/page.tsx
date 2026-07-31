
"use client";
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/api';

export default function UploadCenter() {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        
        try {
            // Mocking the upload metadata to backend
            await api.post('/medical/medical-images', {
                patient_id: "patient-id-placeholder", // Ideally fetched from context
                disease_category_id: category || "default-cat",
                file_url: "s3://mock-url/" + (file?.name || "file"),
                metadata_json: { size: file?.size }
            });
            setMsg('File metadata uploaded successfully (AI Prediction pending).');
            setFile(null);
        } catch (error) {
            setMsg('Upload failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Center</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">{msg}</div>}
                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Disease Category</label>
                        <select required value={category} onChange={e=>setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3">
                            <option value="">-- Select Category --</option>
                            <option value="dementia">Dementia (MRI)</option>
                            <option value="breast_cancer">Breast Cancer (Histopathology)</option>
                            <option value="malaria">Malaria (Blood Smear)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
                            <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="mx-auto" />
                            <p className="text-gray-500 mt-2 text-sm">Drag and drop or click to select files</p>
                        </div>
                    </div>
                    <button type="submit" disabled={loading || !file} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Upload for Analysis'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
