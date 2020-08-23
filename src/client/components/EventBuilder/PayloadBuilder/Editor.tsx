import React from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/github'
import { Pane, majorScale, defaultTheme } from 'evergreen-ui'

export interface Props {
  content: string
  onChange: (payload: string) => void
}

const styles = {
  wrapper: {
    height: `${majorScale(50)}px`
  },
  editor: {
    mode: 'json',
    theme: 'github',
    fontSize: 14,
    width: '100%',
    height: `${majorScale(50)}px`,
    showPrintMargin: false,
    showGutter: true,
    highlightActiveline: true,
    setOptions: {
      showLineNumbers: true,
      tabSize: 4
    },
    debounceChangePeriod: 200,
    wrapEnabled: true,
    style: {
      marginTop: majorScale(1),
      borderRadius: '3px',
      border: `1px solid ${defaultTheme.scales.neutral.N4A}`
    }
  }
}

const Editor = (props: Props) => {
  return (
    <Pane {...styles.wrapper}>
      <AceEditor {...styles.editor} onChange={props.onChange} value={props.content} />
    </Pane>
  )
}

export default Editor
