import dynamic from "next/dynamic";
import {
  Box,
  IconButton,
  Button,
  FormControl,
  Autocomplete,
} from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";
import { PageHeader } from "@primer/react/drafts";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect, ChangeEventHandler } from "react";
import ReactDOMServer from "react-dom/server";
import { currentDocument, setDocument } from "@services/documentSlice";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { currentCustomer } from "@services/customerSlice";
import { currentPrompt, setCurrentPrompt } from "@services/promptSlice";


const Content = () => {
  const dispatch = useAppDispatch();
  const sx = { flexDirection: "row"};

  return (
    <Box className="source">
      <PageHeader sx={sx}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Prompts</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.TrailingAction>
          <Button size="small">Save</Button>
        </PageHeader.TrailingAction>
      </PageHeader>
      <div>Prompts</div>
      <PageHeader sx={sx}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Files</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <div>Files</div>
    </Box>
  );
};

export default Content;
