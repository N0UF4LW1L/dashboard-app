'use client';

import { useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadFileProps {
    form: any;
    name: string;
    lastPath?: string;
    initialData?: any;
}

export default function UploadFile({ form, name, initialData }: UploadFileProps) {
    const [isUploaded, setIsUploaded] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const currentUrl = isUploaded || initialData?.transactionProofUrl || form.getValues(name);

    const handleFakeUpload = () => {
        setIsUploading(true);
        // Simulate network delay
        setTimeout(() => {
            // Fake absolute URL that clearly indicates it's a test image 
            const fakeUploadedUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60';
            setIsUploaded(fakeUploadedUrl);
            form.setValue(name, fakeUploadedUrl);
            setIsUploading(false);
        }, 2000);
    };

    return (
        <div
            onClick={!currentUrl && !isUploading ? handleFakeUpload : undefined}
            className={`relative cursor-pointer border-opacity-25 w-full border-gray-800 border-2 border-dashed gap-2 md:h-[200px] md:w-[300px] h-[300px] flex flex-col justify-center items-center rounded-xl transition-all ${!currentUrl && !isUploading ? 'hover:bg-gray-50' : ''}`}
        >
            {!currentUrl && (
                <div className="flex flex-col items-center">
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                            <span className="text-sm text-gray-600 mt-2 font-medium">Mengunggah bukti transaksi...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <ImageIcon className="text-gray-600 h-8 w-8" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Klik untuk mengunggah bukti bayar</span>
                            <span className="text-xs text-gray-400">JPG, PNG (Maks 2MB)</span>
                        </div>
                    )}
                </div>
            )}

            {currentUrl && (
                <div className="relative w-full h-full p-2 group">
                    <Image
                        src={currentUrl}
                        alt="Uploaded receipt"
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsUploaded('');
                                form.setValue(name, '');
                            }}
                            className="opacity-0 group-hover:opacity-100 bg-white text-red-600 font-semibold px-4 py-2 rounded-md shadow-md transform scale-95 transition-all"
                        >
                            Hapus / Ganti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
