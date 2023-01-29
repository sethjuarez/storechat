import { Customer } from "@types";
import dynamic from "next/dynamic";
import { Box, Pagehead, ActionMenu, ActionList } from "@primer/react";
import { PackageIcon, SyncIcon } from "@primer/octicons-react";
import { useState } from "react";
//import { MarkdownEditor } from "@primer/react/drafts";

const MarkdownEditor = dynamic(
  () => import("@primer/react/drafts").then((mod) => mod.MarkdownEditor), {
    ssr: false
  }
);

type Props = {
  customer: Customer;
  product: string;
  setProduct: (text: string) => void;
};

const Sources = ({ customer, product, setProduct }: Props) => {
  const pageHeadSx = { fontSize: 20, padding: 1, fontWeight: 600, margin: 0 };
  const [value, setValue] = useState("");

  const renderMarkdown = async (markdown: string) =>
    "Rendered Markdown." + markdown;

  return (
    <Box className="source">
      <Pagehead sx={pageHeadSx}>Customer Details</Pagehead>

      <Pagehead sx={pageHeadSx}>Relevant Product Details</Pagehead>

        <MarkdownEditor
          fullHeight={true}
          value={product}
          onChange={setProduct}
          onRenderPreview={renderMarkdown}
        >

        </MarkdownEditor>
    </Box>
  );
};

export default Sources;
