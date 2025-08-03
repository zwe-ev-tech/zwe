import api from './axios';

export const uploadFile = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteFile = async (uuid: string): Promise<void> => {
  await api.delete(`/file/${uuid}`);
};

export const processReceiptImage = async (fileId: string): Promise<any> => {
  const response = await api.get(`/receipt/ai/extract-receipt-details/${fileId}`);
  return response.data;
};
