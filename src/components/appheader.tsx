import { Customer } from "@types";
import {
  Header,
  StyledOcticon,
  Avatar,
  ActionMenu,
  ActionList,
} from "@primer/react";
import { PackageIcon, SyncIcon } from "@primer/octicons-react";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { clearTurns } from "@services/chatSlice";
import {
  setSelectedCustomer,
  selectCustomers,
  selectCurrentCustomer,
} from "@services/customerSlice";


const AppHeader = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const selectedCustomer = useAppSelector(selectCurrentCustomer);

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
              src={customers[selectedCustomer].image}
              size={32}
              alt={customers[selectedCustomer].name}
            />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Group title="Switch User">
                {customers.map(
                  (c, i) =>
                    i !== selectedCustomer && (
                      <ActionList.Item key={i} onSelect={() => dispatch(setSelectedCustomer(i))}>
                        <ActionList.LeadingVisual>
                          <Avatar src={c.image} />
                        </ActionList.LeadingVisual>
                        {c.name}
                      </ActionList.Item>
                    )
                )}
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => dispatch(clearTurns())}>
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
