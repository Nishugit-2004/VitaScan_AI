"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewScan() {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');
        setError('');
        setResult(null);
        setProgress(0);
        
        try {
            const formData = new FormData();
            formData.append('file', file as Blob);
            formData.append('disease_type', category);

            const res = await api.post('/medical/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setProgress(percentCompleted);
                }
            });
            
            setMsg('File uploaded and analyzed successfully!');
            setResult(res.data.prediction_result);
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Upload failed due to an error.');
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <UploadCloud className="text-blue-600" /> New AI Scan
            </h1>
            
            {msg && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"><CheckCircle size={20}/> {msg}</div>}
            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"><AlertCircle size={20}/> {error}</div>}
            
            {result && (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
                    <h3 className="font-bold text-lg text-blue-900 mb-2">Analysis Result</h3>
                    <p className="text-blue-800"><strong>Classification:</strong> {result.result_class}</p>
                    <p className="text-blue-800"><strong>Confidence:</strong> {(result.confidence_score * 100).toFixed(2)}%</p>
                </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Diagnostic Category</label>
                    <select required value={category} onChange={e=>setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white transition-colors">
                        <option value="">-- Choose Category --</option>
                        <option value="dementia">Dementia (MRI Image)</option>
                        <option value="breast_cancer">Breast Cancer (Histopathology Image)</option>
                        <option value="malaria">Malaria (Blood Smear Image)</option>
                        <option value="anemia">Anemia (Clinical Data / Image)</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File</label>
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer relative"
                    >
                        <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <UploadCloud size={48} className="mx-auto text-gray-400 mb-4" />
                        {file ? (
                            <p className="text-blue-600 font-medium">{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</p>
                        ) : (
                            <div>
                                <p className="text-gray-700 font-medium text-lg">Drag & drop your file here</p>
                                <p className="text-gray-500 mt-2 text-sm">Supported formats: JPG, PNG, PDF, CSV (Max 50MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                {loading && progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <button type="submit" disabled={loading || !file || !category} className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg">
                    {loading ? 'Processing Analysis...' : 'Submit for AI Prediction'}
                </button>
            </form>
        </div>
    );
}
