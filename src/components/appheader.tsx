import { Customer } from "@types";
import {
  Header,
  StyledOcticon,
  Avatar,
  ActionMenu,
  ActionList,
} from "@primer/react";
import { PackageIcon, SyncIcon } from "@primer/octicons-react";

type Props = {
  customers: Customer[];
  selected: number;
  setSelected: (index: number) => void;
};

const AppHeader = ({ customers, selected, setSelected }: Props) => {
  return (
    <Header>
      <Header.Item full>
        <Header.Link href="#">
          <StyledOcticon icon={PackageIcon} size={32} sx={{ mr: 2 }} />
          <span>Contoso Market Chat</span>
        </Header.Link>
      </Header.Item>
      <Header.Item>
        <ActionMenu>
          <ActionMenu.Anchor>
            <Avatar
              src={customers[selected].image}
              size={32}
              alt={customers[selected].name}
            />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Group title="Switch User">
                {customers.map(
                  (c, i) =>
                    i !== selected && (
                      <ActionList.Item key={i} onSelect={() => setSelected(i)}>
                        <ActionList.LeadingVisual>
                          <Avatar src={c.image} />
                        </ActionList.LeadingVisual>
                        {c.name}
                      </ActionList.Item>
                    )
                )}
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger">
                <ActionList.LeadingVisual>
                  <SyncIcon />
                </ActionList.LeadingVisual>
                Reset Chat
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Header.Item>
    </Header>
  );
};

export default AppHeader;
