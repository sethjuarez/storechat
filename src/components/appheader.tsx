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
import { resetDocument } from "@services/documentSlice";
import {
  setSelectedCustomer,
  selectCustomers,
  selectCurrentCustomer,
} from "@services/customerSlice";

const AppHeader = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const selectedCustomer = useAppSelector(selectCurrentCustomer);

  const reset = () => {
    dispatch(clearTurns());
    dispatch(resetDocument());
  };

  const selectCustomer = (i: number) => {
    dispatch(setSelectedCustomer(i));
    dispatch(clearTurns());
    dispatch(resetDocument());
  };

  return (
    <Header>
      <Header.Item full>
        <Header.Link href="#">
          <svg
            width="24px"
            height="24px"
            version="1.1"
            viewBox="0 0 128 128"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m96.078 59.418c1.6562-1.9922 2.332-4.625 1.8438-7.168-2.0664-10.574-8.9414-19.582-18.598-24.359-9.6602-4.7734-20.988-4.7734-30.648 0-9.6562 4.7773-16.531 13.785-18.598 24.359-0.48828 2.543 0.1875 5.1758 1.8438 7.168 1.7227 2.0938 4.293 3.3086 7.0039 3.3008h10.547c-0.70312 4.25-2.1875 11.148-4.1719 19.289-1.2695 5.2266-0.070312 10.746 3.2539 14.973 3.3242 4.2305 8.4023 6.6992 13.781 6.6992h3.3281c4.6484-0.007813 9.1055-1.8555 12.391-5.1445 3.2891-3.2852 5.1367-7.7422 5.1445-12.391v-0.30859c0-1.1562-0.11719-2.3086-0.34375-3.4414l-3.9297-19.676h10.152-0.003906c2.7109 0.007812 5.2812-1.207 7.0039-3.3008zm-58.23-4.8906c-0.19922-0.22266-0.28516-0.52344-0.22656-0.82031 1.5977-8.2305 6.9453-15.246 14.461-18.965s16.336-3.7188 23.852 0c7.5117 3.7188 12.863 10.734 14.461 18.965 0.054688 0.29688-0.03125 0.59766-0.23047 0.82031-0.26562 0.32031-0.66016 0.50781-1.0742 0.51172h-50.164c-0.41797-0.003906-0.8125-0.19141-1.0781-0.51172zm37.48 29.375c0.12891 0.63672 0.19141 1.2852 0.19141 1.9336v0.30859c-0.007812 5.4414-4.4141 9.8477-9.8555 9.8555h-3.3281c-3.0234 0.003906-5.8789-1.3828-7.75-3.7578-1.8711-2.375-2.5469-5.4766-1.8359-8.4141 1.4336-5.8633 3.5703-15.234 4.4805-21.109h13.859z"
              fill="#fff"
            />
          </svg>
          &nbsp;
          <span>Best For You Organics - Chat</span>
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
                      <ActionList.Item
                        key={i}
                        onSelect={() => selectCustomer(i)}
                      >
                        <ActionList.LeadingVisual>
                          <Avatar src={c.image} />
                        </ActionList.LeadingVisual>
                        {c.name}
                      </ActionList.Item>
                    )
                )}
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={reset}>
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
