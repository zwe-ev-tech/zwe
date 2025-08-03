import clsx from 'clsx';
import { useRef } from "react";
import { ALLOWED_MINETYPE } from 'common/constants';

export interface FileUploadProps {
  className?: string;
  disabled: boolean;
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = props => {
  const { className, onFileSelect, disabled } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allowedMineType = Object.values(ALLOWED_MINETYPE).toString();

  const classes = clsx({
    'flex flex-col items-center justify-center w-full max-w-md border-2 border-dashed border-gray-400 rounded-md bg-gray-100 p-8 cursor-pointer space-y-4': true,
    [`${className}`]: !!className
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if(!disabled) {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    }
  };

  return (
    <div
      className={classes}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="text-7xl mb-2">📂</div>
      <input
        type="file"
        accept={allowedMineType || ''}
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <button disabled={disabled} className="bg-white border border-gray-400 px-4 py-2 rounded shadow text-sm hover:bg-gray-50">
        Choose file to Upload
      </button>
      <p className="mt-2 text-sm text-gray-600">or</p>
      <p className="text-sm text-gray-600">drag and drop file here</p>
    </div>
  )
}
