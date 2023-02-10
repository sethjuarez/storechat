import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Prompt } from "@types";
import { RootState } from "./store";

interface PromptState {
  prompts: Prompt[];
  selected: number;
}

const initialState: PromptState = {
  selected: 0,
  prompts: [
    {
      name: "Default Prompt",
      template: `<Instructions>Please answer the question briefly, succinctly and in a personable manner using nice markdown as the Assistant. End your answer with a lot of fun emojis.
<Context>Use this context in the response: customer name: {name}, customer age: {age}, customer timezone: {location}.
<Documentation>{documentation}
<Conversation>{conversation}
{name}: {message}
Assistant:`,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
  ],
};

const promptSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    addPrompt: {
      reducer: (state, action: PayloadAction<Prompt>) => {
        state.prompts.push(action.payload);
      },
      prepare: (name: string, template: string) => {
        return {
          payload: {
            name: name,
            template: template,
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
          },
        };
      },
    },
    setCurrentPrompt: (state, action: PayloadAction<string>) => {
      state.prompts[state.selected].template = action.payload;
    },
    setIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.prompts.length)
        state.selected = action.payload;
    },
    setPrompt: (
      state,
      action: PayloadAction<{ index: number; name: string; template: string }>
    ) => {
      state.prompts[action.payload.index].name = action.payload.name;
      state.prompts[action.payload.index].template = action.payload.template;
    },
    setPromptName: (
      state,
      action: PayloadAction<{ index: number; name: string }>
    ) => {
      state.prompts[action.payload.index].name = action.payload.name;
    },
    setPromptTemplate: (
      state,
      action: PayloadAction<{ index: number; template: string }>
    ) => {
      state.prompts[action.payload.index].template = action.payload.template;
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.prompts.splice(action.payload, 1);
    },
    addItem: (state, action: PayloadAction<string>) => {
      state.prompts = [
        ...state.prompts,
        {
          name: action.payload,
          template: "",
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
        },
      ];
    },
  },
});

export const {
  addPrompt,
  setCurrentPrompt,
  setIndex,
  setPromptName,
  setPromptTemplate,
  addItem,
  deleteItem,
} = promptSlice.actions;
export const selectPrompts = (state: RootState) => state.prompts.prompts;
export const currentIndex = (state: RootState) => state.prompts.selected;
export const currentPrompt = (state: RootState) =>
  state.prompts.prompts[state.prompts.selected];
export default promptSlice.reducer;
