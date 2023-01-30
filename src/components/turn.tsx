import { Box, Spinner, PointerBox, Avatar, StyledOcticon } from "@primer/react";
import { HubotIcon } from "@primer/octicons-react";
import { Turn, Customer } from "@types";
import { useRemark } from "react-remark";
import remarkGemoji from "remark-gemoji";
import { useEffect } from "react";

type Props = {
  turn: Turn;
  customer: Customer;
};

const TurnBubble = ({ turn, customer }: Props) => {
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
  const getStyles = (type: string) => {
    const base = { m: 2, p: 2, marginTop: 1, marginBottom: 1 };
    if (type === "user") {
      return {
        ...base,
        ml: 10,
        bg: "success.subtle",
        borderColor: "success.emphasis",
      };
    } else {
      return {
        ...base,
        mr: 10,
        bg: "accent.subtle",
        borderColor: "accent.emphasis",
      };
    }
  };

  useEffect(() => {
    setMarkdownSource(turn.message);
  }, [turn, setMarkdownSource]);

  const getContent = (turn: Turn) => {
    if (turn.status === "waiting") {
      return <Spinner size="small" />;
    } else {
      return <span>{reactContent}</span>;
    }
  };

  if (turn.type === "user") {
    return (
      <Box className="user">
        <PointerBox caret="right-bottom" sx={getStyles(turn.type)}>
          {turn.message}
        </PointerBox>
        <div>
          <Avatar
            sx={{ mb: 1, ml: 2, mr: 3 }}
            src={customer.image}
            size={24}
            alt={customer.name}
          />
        </div>
      </Box>
    );
  } else {
    return (
      <Box className="bot">
        <div>
          <StyledOcticon icon={HubotIcon} size={24} sx={{ mb: 1, mr: 2 }} />
        </div>
        <PointerBox caret="left-bottom" sx={getStyles(turn.type)}>
          {getContent(turn)}
        </PointerBox>
      </Box>
    );
  }
};

export default TurnBubble;
