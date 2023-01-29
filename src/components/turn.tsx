import { Box, Spinner, PointerBox, Avatar, StyledOcticon } from "@primer/react";
import { CopilotIcon, HubotIcon } from "@primer/octicons-react";
import { Turn, Customer } from "@types";

type Props = {
  turn: Turn;
  customer: Customer;
};

const TurnBubble = ({ turn, customer }: Props) => {
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

  const getContent = (turn: Turn) => {
    if (turn.status === "waiting") {
      return <Spinner size="small" />;
    } else {
      return <span>{turn.message}</span>;
    }
  };

  if (turn.type === "user") {
    return (
      <Box className="user">
        <PointerBox caret="right-bottom" sx={getStyles(turn.type)}>
          {getContent(turn)}
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
