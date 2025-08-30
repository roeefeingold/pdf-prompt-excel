import { create } from 'zustand';

export type FileStatus = 'uploading' | 'processing' | 'success' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  status: FileStatus;
  fileId?: string;
  error?: string;
}

interface FilesState {
  files: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  updateFileStatus: (id: string, status: FileStatus, fileId?: string, error?: string) => void;
  getSuccessfulFiles: () => UploadedFile[];
  clearFiles: () => void;
}

export const useFilesStore = create<FilesState>((set, get) => ({
  files: [],
  
  addFile: (file: UploadedFile) => {
    set((state) => ({
      files: [...state.files, file],
    }));
  },
  
  updateFileStatus: (id: string, status: FileStatus, fileId?: string, error?: string) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id
          ? { ...file, status, fileId: fileId || file.fileId, error }
          : file
      ),
    }));
  },
  
  getSuccessfulFiles: () => {
    return get().files.filter((file) => file.status === 'success');
  },
  
  clearFiles: () => {
    set({ files: [] });
  },
}));