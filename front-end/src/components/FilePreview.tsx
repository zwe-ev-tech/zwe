import clsx from "clsx";
import {IFileRes} from 'common';

export interface FilePreviewProps {
  data: IFileRes
  onRemove: (uuid: string) => void;
  onExtract: (uuid: string) => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = props => {
  const { className, data, onRemove, onExtract } = props;

  const classes = clsx({
    'flex flex-col items-center justify-center space-y-6': true,
    [`${className}`]: !!className,
  });

  return (
    <div className={classes}>
      <div className="flex items-center justify-between border border-gray-300 rounded-lg p-4 w-[460px] shadow-sm bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="text-4xl text-gray-400">📄</div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">{data.name}</p>
            <p className="text-xs text-gray-500">Uploaded by User</p>
            <p className="text-xs text-gray-500">Uploaded on {new Date(data.createdAt).toLocaleString('en-US')}</p>
          </div>
        </div>
        <button
          className="text-gray-500 hover:text-red-500 text-xl font-bold px-2"
          onClick={() => onRemove(data.uuid)}
        >
          ×
        </button>
      </div>

      <div>
        <button
          onClick={() => onExtract(data.uuid)}
          className="border border-black mt-6 text-black font-medium py-1.5 px-4 rounded-md hover:shadow-md transition"
        >
          Extract Receipts Contents
        </button>

      </div>
    </div>
  )
}
