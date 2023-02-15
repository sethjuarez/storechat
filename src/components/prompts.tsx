import {
  Box,
  TextInput,
  Textarea,
  IconButton,
  Tooltip,
  UnderlineNav,
  Label,
} from "@primer/react";
import { PageHeader, Dialog } from "@primer/react/drafts";
import {
  useState,
  ChangeEventHandler,
  MouseEventHandler,
  ReactNode,
  useEffect,
} from "react";
import {
  CheckCircleIcon,
  TrashIcon,
  ShareIcon,
  PlusCircleIcon,
} from "@primer/octicons-react";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import {
  currentIndex,
  setIndex,
  selectPrompts,
  setPromptName,
  setPromptTemplate,
  addItem,
  deleteItem,
  savePromptState,
  fetchPromptState
} from "@services/promptSlice";

const Prompts = () => {
  const dispatch = useAppDispatch();
  const prompts = useAppSelector(selectPrompts);
  const selected = useAppSelector(currentIndex);
  const user = useAppSelector((state) => state.user);
  const [tabIndex, setTabIndex] = useState(0);

  const editTemplate: (
    index: number
  ) => ChangeEventHandler<HTMLTextAreaElement> = (index) => (event) => {
    dispatch(setPromptTemplate({ index: index, template: event.target.value }));
  };

  const editTitle: (index: number) => ChangeEventHandler<HTMLInputElement> =
    (index) => (event) => {
      dispatch(setPromptName({ index: index, name: event.target.value }));
    };

  const changeSelected: (index: number) => () => void = (index) => () => {
    dispatch(setIndex(index));
  };

  const deletePrompt: (index: number) => MouseEventHandler<HTMLButtonElement> =
    (index) => () => {
      if (selected == index) dispatch(setIndex(index - 1));
      setTabIndex(index - 1);
      dispatch(deleteItem(index));
      setIsOpen(false);
    };

  const addPrompt = () => {
    if (prompts.length < 4) {
      dispatch(addItem("[New Prompt]"));
      setTabIndex(prompts.length);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const savePrompts = () => {
    dispatch(savePromptState());
  };

  const [isOpen, setIsOpen] = useState(false);

  const ActionDialog = (props: { title: string; children?: ReactNode }) => (
    <Dialog
      title={props.title}
      subtitle={
        <div className="fg.danger">
          Are you sure you want to remove this prompt?
        </div>
      }
      footerButtons={[
        { content: "Ok", onClick: deletePrompt(tabIndex) },
        { content: "Cancel", onClick: () => setIsOpen(false) },
      ]}
      onClose={closeDialog}
    >
      {props.children}
    </Dialog>
  );

  return (
    <Box>
      {isOpen && (
        <ActionDialog title="Delete Prompt">
          <Box
            sx={{ marginBottom: "5px", fontWeight: 800, color: "fg.subtle" }}
          >
            {prompts[tabIndex].name}
          </Box>
          <code className="promptText">{prompts[tabIndex].template}</code>
        </ActionDialog>
      )}
      <PageHeader sx={{ flexDirection: "row" }}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Prompts</PageHeader.Title>
          <PageHeader.Actions>
            <Tooltip aria-label={`Save Changes (only for ${user.name})`}>
              <IconButton
                aria-label="share"
                size="small"
                icon={ShareIcon}
                onClick={savePrompts}
              />
            </Tooltip>
            <Tooltip
              aria-label={
                prompts.length >= 4 ? "Can only have 4 prompts" : "Add Prompt"
              }
            >
              <IconButton
                aria-label="new"
                size="small"
                icon={PlusCircleIcon}
                onClick={addPrompt}
                disabled={prompts.length >= 4}
              />
            </Tooltip>
            <Tooltip
              aria-label={
                prompts.length === 1
                  ? "Cannot remove last prompt"
                  : "Delete Prompt"
              }
            >
              <IconButton
                aria-label="Default"
                icon={TrashIcon}
                size="small"
                onClick={
                  prompts[tabIndex].template.trim().length == 0
                    ? deletePrompt(tabIndex)
                    : () => setIsOpen(true)
                }
                disabled={prompts.length === 1}
              />
            </Tooltip>
          </PageHeader.Actions>
        </PageHeader.TitleArea>
      </PageHeader>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 1,
        }}
      >
        <UnderlineNav aria-label="prompts">
          {prompts.map((prompt, i) => (
            <UnderlineNav.Link
              as="a"
              key={"name" + i + "tab"}
              aria-current={tabIndex === i}
              onSelect={() => setTabIndex(i)}
              onClick={(e) => {
                e.preventDefault();
                setTabIndex(i);
              }}
              selected={i === tabIndex}
              className={"promptTabs"}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {selected == i && <CheckCircleIcon />}
                <div>{prompt.name}</div>
              </Box>
            </UnderlineNav.Link>
          ))}
        </UnderlineNav>
        <Box className="promptEditor">
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              placeItems: "center",
            }}
          >
            <TextInput
              aria-label="name"
              name="name"
              placeholder="name"
              value={prompts[tabIndex].name}
              onChange={editTitle(tabIndex)}
            />

            {selected === tabIndex ? (
              <CheckCircleIcon size="small" fill="green" />
            ) : (
              <Tooltip aria-label="Set default">
                <IconButton
                  aria-label="Default"
                  icon={CheckCircleIcon}
                  size="small"
                  onClick={changeSelected(tabIndex)}
                />
              </Tooltip>
            )}
          </Box>
          <Box>
            <Textarea
              placeholder="Enter template!"
              value={prompts[tabIndex].template}
              onChange={editTemplate(tabIndex)}
              rows={9}
              sx={{
                width: "100%",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Prompts;
