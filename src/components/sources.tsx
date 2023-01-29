import dynamic from "next/dynamic";
import { Customer } from "@types";
import { Box, Pagehead, Textarea } from "@primer/react";
import { useState, useEffect, ChangeEventHandler } from "react";
import showdown from "showdown";
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
};

const Sources = ({ customer, product, setProduct }: Props) => {
  const [customerMd, setCustomerMd] = useState("");
  const [value, setValue] = useState("");

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setValue(event.target.value);
  };

  const pageHeadSx = { fontSize: 20, padding: 1, fontWeight: 600, margin: 0 };

  const renderMarkdown = async (markdown: string) =>
    new Promise<string>((resolve, _) => {
      const converter = new showdown.Converter({
        headerLevelStart: 3,
        openLinksInNewWindow: true,
        simplifiedAutoLink: false,
        emoji: true,
      });
      resolve(converter.makeHtml(markdown));
    });

  useEffect(() => {
    const getMarkdown = async () => {
      const md = await renderMarkdown(
        "`" + JSON.stringify(customer, null, 2) + "`"
      );
      setCustomerMd(md);
    };
    getMarkdown();
  }, [customer]);

  return (
    <Box className="source">
      <Pagehead sx={pageHeadSx}>Base Prompt</Pagehead>
      <Textarea
        placeholder="Enter a description"
        onChange={handleChange}
        value={value}
        rows={3}
      />
      <Pagehead sx={pageHeadSx}>Customer Context</Pagehead>
      <Box
        dangerouslySetInnerHTML={{ __html: customerMd }}
        borderColor="border.default"
        borderWidth={1}
        borderStyle="solid"
        borderRadius={5}
        boxShadow="shadow.small"
        marginLeft={2}
        p={3}
      />

      <Pagehead sx={pageHeadSx}>Company Context (Products)</Pagehead>

      <MarkdownEditor
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
