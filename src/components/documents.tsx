import {
  Box,
  TextInput,
  Checkbox,
  Text,
  Label,
  IconButton,
} from "@primer/react";
import { PageHeader, Dialog } from "@primer/react/drafts";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { PlusIcon, XIcon } from "@primer/octicons-react";
import {
  selectDocuments,
  addKeyword,
  removeKeyword,
  setDefault,
} from "@services/documentSlice";
import { useTheme } from "@primer/react";
import { MouseEventHandler, ReactNode, useState } from "react";

const Documents = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const documents = useAppSelector(selectDocuments);
  const [keyword, setKeyword] = useState<string[]>(
    new Array(documents.length).fill("")
  );

  const updateKeyword = (index: number, value: string) => {
    setKeyword([
      ...keyword.slice(0, index),
      value,
      ...keyword.slice(index + 1, keyword.length),
    ]);
  };

  //console.log(theme);
  const addKey = (index: number) => {
    dispatch(addKeyword({ index, keyword: keyword[index].trim() }));
    updateKeyword(index, "");
  };

  const defaultChecked: (
    index: number
  ) => MouseEventHandler<HTMLInputElement> = (index) => (event) => {
    dispatch(setDefault(index));
  };

  const [isOpen, setIsOpen] = useState(false);
  const ActionDialog = (props: { title: string; children?: ReactNode }) => (
    <Dialog
      title={props.title}
      footerButtons={[{ content: "Ok", onClick: () => setIsOpen(false) }]}
      onClose={() => setIsOpen(false)}
    >
      {props.children}
    </Dialog>
  );

  return (
    <Box>
      <PageHeader sx={{ flexDirection: "row" }}>
        <PageHeader.TitleArea>
          <PageHeader.Title>Documents</PageHeader.Title>
        </PageHeader.TitleArea>
      </PageHeader>
      <Box>
        <table className="documentList">
          <thead>
            <tr>
              <th>Current Keywords</th>
              <th>New Keyword</th>
              <th>Document</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document, index) => (
              <tr key={index}>
                <td>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {document.keywords.map((keyword, ki) => (
                      <Label
                        size="large"
                        key={ki}
                        variant="default"
                        sx={{
                          bg: "#fff",
                          cursor: "pointer",
                          m: 1,
                          display: "flex",
                          alignContent: "center",
                        }}
                        onClick={() =>
                          dispatch(removeKeyword({ index: index, keyword: ki }))
                        }
                      >
                        <Box>{keyword}</Box>
                        <Box>
                          <XIcon size={12} />
                        </Box>
                      </Label>
                    ))}
                  </Box>
                </td>
                <td align="center">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <TextInput
                      sx={{
                        width: "75px",
                      }}
                      value={keyword[index]}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      onKeyUp={(e) =>
                        e.code === "Enter" ? addKey(index) : null
                      }
                    />
                    <IconButton
                      icon={PlusIcon}
                      aria-label="Add"
                      onClick={() => addKey(index)}
                    />
                  </Box>
                </td>
                <td>
                  <Text>{document.file}</Text>
                </td>
                <td align="center">
                  <Checkbox
                    checked={document.isDefault}
                    onClick={defaultChecked(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default Documents;
