import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { EditorState } from "lexical";
import { Text } from "./Text";

const initialConfig: InitialConfigType = {
  namespace: "EvoluMe",
  onError(error) {
    // eslint-disable-next-line no-console
    console.log(error);
  },
  theme: {
    root: "outline-none",
  },
};

export const Editor = () => {
  const handleChange = (state: EditorState) => {
    state.read(() => {
      // // Read the contents of the EditorState here.
      // const root = $getRoot();
      // const selection = $getSelection();
      // console.log(root, selection);
    });
  };

  return (
    <Text className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-900">
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </Text>
  );
};
