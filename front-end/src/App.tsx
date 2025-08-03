import { FilePreview, FileUpload, ReceiptResult } from "./components";
import { apiService } from './api';

import './index.css';
import { useState } from "react";
import { IFileErrorRes, IFileRes, IReceiptRes } from "common";

interface IFileUploadProcess {
  isLoading: boolean;
  data?: IFileRes;
  extractedData?: IReceiptRes;
  error?: IFileErrorRes;
}

function App() {
  const [processState, setProcessState] = useState<'initial' | 'preview' | 'extracted'>('initial');
  const [fileProcess, setFileProcess] = useState<IFileUploadProcess>({ isLoading: false });

  // Upload selected file
  const onFileSelect = async (file: File) => {
    setFileProcess(prev => ({ ...prev, isLoading: true }));
    try {
      const fileRes = await apiService.uploadFile(file);
      setFileProcess({ data: fileRes, error: undefined, isLoading: false });
      setProcessState('preview');
    } catch (e: any) {
      setFileProcess(prev => ({ ...prev, error: { code: e?.data?.code, message: e?.message  }, isUploading: false }));
      console.error(e);
    }
  }

  // Remove uploaded file
  const onFileRemove = async (uuid: string) => {
    try {
      await apiService.deleteFile(uuid);
      setFileProcess({ isLoading: false });
      setProcessState('initial');
    } catch (e: any) {
      setFileProcess(prev => ({ ...prev, error: { code: e?.data?.code, message: e?.message  }, isUploading: false }));
      console.error(e);
    }
  }

  // Extract Image data
  const onFileExtract = async (uuid: string) => {
    setFileProcess({ isLoading: true });
    setProcessState('extracted');
    try {
      const extractedData = await apiService.processReceiptImage(uuid);
      setFileProcess(prev => ({ ...prev, extractedData, isLoading: false }));
    } catch (e: any) {
      setFileProcess(prev => ({ ...prev, error: { code: e?.data?.code, message: e?.message  }, isUploading: false }));
      setFileProcess(prev => ({ ...prev, isLoading: false }));
      console.error(e);
    }
  }

  // Upload new image
  const onBack = () => {
    setFileProcess({ isLoading: true });
    setProcessState('initial');
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col items-center w-full max-w-md px-4">
        <h1 className="text-3xl text-center">Receipt Extractor</h1>
        <div className="mt-6" />
          {processState === 'initial' && (<FileUpload disabled={fileProcess.isLoading} onFileSelect={onFileSelect} />)}
          {processState === 'preview' && fileProcess.data && (<FilePreview data={fileProcess.data} onRemove={onFileRemove} onExtract={onFileExtract} />)}
          {processState === 'extracted' && fileProcess.isLoading && (
            <div className="flex flex-col items-center bg-white">
              <div className="text-center">
                <p className="text-lg font-medium">Extracting receipt contents...</p>
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 animate-pulse rounded-full w-2/3" />
                </div>
              </div>
            </div>
          )}
          {processState === 'extracted' && !fileProcess.isLoading && fileProcess.extractedData && (
            <ReceiptResult onBack={onBack} data={fileProcess.extractedData} />)}
          {fileProcess?.error?.message && (<label className="text-sm text-red-500">{fileProcess.error?.message}</label>)}
        </div>
      </div>
  );
}

export default App;
