import {
  Box,
  Header,
  StyledOcticon,
  Avatar,
  ActionMenu,
  ActionList,
  TextInput,
  IconButton,
} from "@primer/react";

import { PackageIcon, ArrowRightIcon } from "@primer/octicons-react";


const AppHeader = () => {
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
            <Avatar src="images/sethjuarez.jpg" size={32} alt="@sethjuarez" />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>Switch User</ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item variant="danger">Reset Chat</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </Header.Item>
    </Header>
  );
}

export default AppHeader;