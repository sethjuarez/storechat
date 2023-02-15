import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Prompt, PromptState, User } from "@types";
import { RootState } from "./store";

const initialPrompt: Prompt = {
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
};

const initialState: PromptState & {
  status: "idle" | "loading" | "succeeded" | "failed";
} = {
  status: "idle",
  selected: 0,
  prompts: [initialPrompt],
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromptState.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPromptState.fulfilled, (state, action) => {
        const { selected, prompts } = action.payload;
        if (prompts.length > 0) {
          state.selected = selected;
          state.prompts = prompts;
        } else {
          // load some default state?
        }

        state.status = "succeeded";
      })
      .addCase(fetchPromptState.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const fetchPromptState = createAsyncThunk(
  "prompt/fetchPromptState",
  async () => {
    const result = await fetch("/api/prompt");
    const json = await result.json();
    return JSON.parse(json);
  }
);

export const savePromptState = createAsyncThunk(
  "prompt/savePromptState",
  async (_, { getState }) => {
    const { status, ...prompts } = (getState() as RootState).prompts;
    const result = await fetch("/api/prompt", {
      method: "POST",
      body: JSON.stringify(prompts),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json: PromptState = await result.json();
    return json;
  }
);

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
