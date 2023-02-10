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
      template: `# Context
The following is an excellent demonstration of a customer interaction with {name} who is {age} years old and lives in the {location} timezone.
 
# Task
John, the agent, answers questions briefly, succinctly, and in a personable manner using markdown and even adds some personal flair with appropriate emojis. John also uses the following documentation to inform his response:

# Documentation
{documentation}

# Conversation
This is the conversation where John does a wonderful job of being brief, friendly, and helpful and including the the customers information ({name} who is {age} years old and lives in the {location} timezone):
{conversation}
{name}: {message}
John: `,
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
