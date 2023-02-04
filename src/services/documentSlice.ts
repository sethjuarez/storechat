import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface Document {
  file: string;
  keywords: string[];
  isDefault: boolean;
}

interface DocumentState {
  documents1: { [id: string]: string };
  document: string;
  current: string;
}

const initialState: DocumentState = {
  document: "",
  documents1: {
    default: "/data/GreenLife.txt",
    food: "/data/NaturesNourishment.txt",
    clean: "/data/EcoClean.txt",
    nature: "/data/NaturesNourishment.txt",
    eco: "/data/EcoClean.txt",
    nourish: "/data/NaturesNourishment.txt",
  },
  current: "",
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocument: (state, action: PayloadAction<string>) => {
      state.document = action.payload;
    },
    resetDocument: state => {
      state.current = "";
      state.document = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocument.fulfilled, (state, action) => {
        if (
          action.payload.file !== state.current &&
          action.payload.contents !== state.document
        ) {
          state.document = action.payload.contents;
          state.current = action.payload.file;
        }
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const fetchDocument = createAsyncThunk(
  "document/fetchDocument",
  async (message: string, { getState }) => {
    const docs = documents(getState() as RootState);
    const file = currentFile(getState() as RootState);
    let doc = "";
    Object.entries(docs).forEach(([key, value]) => {
      if (message.toLowerCase().includes(key.toLowerCase())) doc = value;
    });

    // if nothing's been set, lets add
    // generic company context as a default
    if (doc.length === 0 && file.length === 0) {
      doc = docs["default"];
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

export const { setDocument, resetDocument } = documentSlice.actions;
export const currentDocument = (state: RootState) => state.documents.document;
export const documents = (state: RootState) => state.documents.documents1;
export const currentFile = (state: RootState) => state.documents.current;
export default documentSlice.reducer;
