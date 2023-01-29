import { Customer } from "@types";
import { Box, Pagehead, ActionMenu, ActionList } from "@primer/react";
import { PackageIcon, SyncIcon } from "@primer/octicons-react";
import { useState } from "react";
import { MarkdownEditor } from "@primer/react/drafts";

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
        <MarkdownEditor.Toolbar>
          <MarkdownEditor.DefaultToolbarButtons />
        </MarkdownEditor.Toolbar>
      </MarkdownEditor>
    </Box>
  );
};

export default Sources;
