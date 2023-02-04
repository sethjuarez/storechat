import { Box } from "@primer/react";
import { PageHeader } from "@primer/react/drafts";

type Props = {
  prompt: string;
};

const Prompt = ({ prompt }: Props) => {

  return (
    <Box className={"promptContainer"}>
      <PageHeader>
        <PageHeader.TitleArea>
          <PageHeader.Title>Generated Prompt</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <code className={"promptText"}>{prompt}</code>
    </Box>
  );
};

export default Prompt;
