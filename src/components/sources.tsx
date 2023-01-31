import dynamic from "next/dynamic";
import { Customer } from "@types";
import { Box, Pagehead, Textarea } from "@primer/react";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect, ChangeEventHandler } from "react";
import ReactDOMServer from "react-dom/server";

// dynamic loader to force client-side only
const MarkdownEditor = dynamic(
  () => import("@primer/react/drafts").then((mod) => mod.MarkdownEditor),
  {
    ssr: false,
  }
);

type Props = {
  customer: Customer;
  product: string;
  setProduct: (text: string) => void;
  basePrompt: string;
  setBasePrompt: (text: string) => void;
};

const Sources = ({
  customer,
  product,
  setProduct,
  basePrompt,
  setBasePrompt,
}: Props) => {
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
    setBasePrompt(event.target.value);
  };

  const pageHeadSx = { fontSize: 20, padding: 1, fontWeight: 600, margin: 0 };

  useEffect(() => {
    setProductMd(product);
  }, [product, setProductMd]);

  return (
    <Box className="source">
      <Pagehead sx={pageHeadSx}>Prompt Template</Pagehead>
      <Textarea
        placeholder="Enter a description"
        onChange={handleChange}
        value={basePrompt}
        rows={5}
      />
      <Pagehead sx={pageHeadSx}>Customer Context</Pagehead>
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

      <Pagehead sx={pageHeadSx}>Company Context (Products)</Pagehead>

      <MarkdownEditor
        viewMode={"edit"}
        fullHeight={true}
        value={product}
        onChange={setProduct}
        onRenderPreview={renderMarkdown}
      >
        <></>
      </MarkdownEditor>
    </Box>
  );
};

export default Sources;
