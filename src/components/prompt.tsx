import { Box } from "@primer/react";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect } from "react";

type Props = {
  prompt: string;
};

const Prompt = ({ prompt }: Props) => {
  const [reactContent, setMarkdownSource] = useRemark({
    //@ts-ignore
    remarkPlugins: [remarkGemoji],
    remarkToRehypeOptions: { allowDangerousHtml: true },
    rehypeReactOptions: {
      components: {
        a: (props: any) => <a target="_blank" {...props} />,
      },
    },
  });

  useEffect(() => {
    setMarkdownSource(prompt);
  }, [prompt, setMarkdownSource]);

  return (
    <Box className={"promptContainer"}>
      <code className={"promptText"}>{prompt}</code>
    </Box>
  );
};

export default Prompt;
