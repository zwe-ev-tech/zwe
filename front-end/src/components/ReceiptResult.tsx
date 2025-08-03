import { IReceiptRes } from "common";
import clsx from "clsx";

export interface ReceiptResultProps {
  data: IReceiptRes;
  onBack: () => void;
  className?: string;
}

export const ReceiptResult: React.FC<ReceiptResultProps> = props => {
  const { className, data, onBack } = props;

  const classes = clsx({
    'mb-2 bg-white px-10 py-8': true,
    [`${className}`]: !!className,
  })

  return (
    <div className={classes}>
      <div className="flex flex-row gap-8 justify-center items-start">
        {/* Receipt Image */}
        <div className="w-full flex justify-center">
          <img
            src={data.fileUrl}
            alt="Receipt"
            className="max-h-[800px] border border-dashed border-gray-400 rounded-md object-contain"
          />
        </div>

        {/* Receipt Details */}
        <div className="w-full max-h-[500px] overflow-y-auto border border-gray-200 p-6 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold">{data.vendorName}</h2>
          <p className="text-sm text-gray-600">{new Date(data.creationDate).toLocaleDateString("en-SG")}</p>
          <p className="text-sm text-gray-600 mb-2">{data.currency}</p>

          <hr className="my-3" />

          {data.items.map(item => (
            <div key={item.uuid} className="flex justify-between py-1 text-sm">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between py-2 mt-2 border-t text-sm">
            <span>GST/Tax</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end w-full mt-4">
        <button className="bg-white border border-gray-400 px-4 py-2 rounded shadow text-sm hover:bg-gray-50" onClick={onBack}>
          <div className="inline-flex items-center gap-2">
            <div className="text-xl">{'<-'}</div>
            Upload new image
          </div>
        </button>
      </div>
    </div>
  )
}
