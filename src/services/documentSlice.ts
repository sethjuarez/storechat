import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface Document {
  file: string;
  keywords: string[];
  isDefault: boolean;
}

interface DocumentState {
  document: string;
  current: string;
  documents: Document[];
}

const initialState: DocumentState = {
  document: "",
  documents: [
    { file: "/data/BestForYou.txt", keywords: [], isDefault: true },
    {
      file: "/data/NaturesNourishment.txt",
      keywords: ["food", "nature", "nourish"],
      isDefault: false,
    },
    {
      file: "/data/EcoClean.txt",
      keywords: ["clean", "eco"],
      isDefault: false,
    },
  ],
  current: "",
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocument: (state, action: PayloadAction<string>) => {
      state.document = action.payload;
    },
    resetDocument: (state) => {
      state.current = "";
      state.document = "";
    },
    addKeyword: (
      state,
      action: PayloadAction<{ index: number; keyword: string }>
    ) => {
      const i = action.payload.index;
      const k = action.payload.keyword.trim();
      if (!state.documents[i].keywords.includes(k) && k.length > 0)
        state.documents[i].keywords.push(k);
    },
    removeKeyword: (
      state,
      action: PayloadAction<{ index: number; keyword: number }>
    ) => {
      const i = action.payload.index;
      const k = action.payload.keyword;
      state.documents[i].keywords.splice(k, 1);
    },
    setDefault: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.documents.forEach((d) => (d.isDefault = false));
      state.documents[i].isDefault = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentByMessage.fulfilled, (state, action) => {
        if (
          action.payload.file !== state.current &&
          action.payload.contents !== state.document
        ) {
          state.document = action.payload.contents;
          state.current = action.payload.file;
        }
      })
      .addCase(fetchDocumentByMessage.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const fetchDocumentByMessage = createAsyncThunk(
  "document/fetchDocumentByMessage",
  async (message: string, { getState }) => {
    const docs = selectDocuments(getState() as RootState);
    const file = currentFile(getState() as RootState);

    let doc = "";
    docs
      .filter((d) => d.keywords.length > 0)
      .forEach((k) => {
        k.keywords.forEach((w) => {
          if (message.toLowerCase().includes(w.toLowerCase())) {
            doc = k.file;
          }
        });
      });

    // if nothing's been set, lets add
    // generic company context as a default
    if (doc.length === 0 && file.length === 0) {
      doc = docs.filter((d) => d.isDefault)[0].file;
    }

    // get appropriate file
    if (doc.length > 0 && doc != file) {
      const documentation = await fetch(doc, {
        method: "GET",
        headers: {
          "Content-Type": "application/text",
        },
      });

      const contents = await documentation.text();
      return { file: doc, contents: contents };
    } else {
      return { file: file, contents: "" };
    }
  }
);

export const fetchDocument = createAsyncThunk(
  "document/fetchDocument",
  async (file: string, { getState }) => {
    const documentation = await fetch(file, {
      method: "GET",
      headers: {
        "Content-Type": "application/text",
      },
    });

    const contents = await documentation.text();
    return { file: file, contents: contents };
  }
);

export const {
  setDocument,
  resetDocument,
  addKeyword,
  removeKeyword,
  setDefault,
} = documentSlice.actions;
export const currentDocument = (state: RootState) => state.documents.document;
export const selectDocuments = (state: RootState) => state.documents.documents;
export const currentFile = (state: RootState) => state.documents.current;
export default documentSlice.reducer;
