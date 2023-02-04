import dynamic from "next/dynamic";
import { Box, Label, Textarea, FormControl, Autocomplete } from "@primer/react";
import { ShareIcon } from "@primer/octicons-react";
import { PageHeader } from "@primer/react/drafts";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect, ChangeEventHandler } from "react";
import ReactDOMServer from "react-dom/server";
import { currentDocument, setDocument } from "@services/documentSlice";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { currentCustomer } from "@services/customerSlice";
import { currentPrompt, setCurrentPrompt } from "@services/promptSlice";

// dynamic loader to force client-side only
const MarkdownEditor = dynamic(
  () => import("@primer/react/drafts").then((mod) => mod.MarkdownEditor),
  {
    ssr: false,
  }
);

const Sources = () => {
  const dispatch = useAppDispatch();
  const document = useAppSelector(currentDocument);
  const selectedDoc = useAppSelector((state) => state.documents.current)
  const customer = useAppSelector(currentCustomer);
  const basePrompt = useAppSelector(currentPrompt);

  const [productMd, setProductMd] = useRemark({
    //@ts-ignore
    remarkPlugins: [remarkGemoji],
    remarkToRehypeOptions: { allowDangerousHtml: true },
    rehypeReactOptions: {
      components: {
        a: (props: any) => <a target="_blank" {...props} />,
      },
    },
  });

  const renderMarkdown = async (markdown: string) =>
    new Promise<string>((resolve, _) => {
      resolve(ReactDOMServer.renderToString(productMd || <></>));
    });

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    dispatch(setCurrentPrompt(event.target.value));
  };

  useEffect(() => {
    setProductMd(document);
  }, [document, setProductMd]);

  const sx = { flexDirection: "row" };
  
  return (
    <Box className="source">
      <PageHeader sx={sx}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Prompt Template</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.TrailingVisual>
          <Label>{basePrompt.name}</Label>
        </PageHeader.TrailingVisual>
      </PageHeader>
      <Textarea
        placeholder="Enter a description"
        onChange={handleChange}
        value={basePrompt.template}
        rows={8}
      />
      <PageHeader sx={sx}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Customer Context</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.TrailingVisual>
          <Label>{customer.name}</Label>
        </PageHeader.TrailingVisual>
      </PageHeader>
      <Box
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={5}
        boxShadow="shadow.small"
        marginLeft={2}
        p={3}
      >
        <code>{JSON.stringify(customer, null, 2)}</code>
      </Box>
      <PageHeader sx={sx}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Company Context</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.TrailingVisual>
          <Label>{selectedDoc.length == 0 ? "None Selected" : selectedDoc}</Label>
        </PageHeader.TrailingVisual>
      </PageHeader>
      <MarkdownEditor
        viewMode={"edit"}
        fullHeight={true}
        value={document}
        onChange={(md) => dispatch(setDocument(md))}
        onRenderPreview={renderMarkdown}
      >
        <></>
      </MarkdownEditor>
    </Box>
  );
};

export default Sources;
