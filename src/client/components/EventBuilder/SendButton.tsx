import React from 'react'
import { Button, majorScale } from 'evergreen-ui'

interface SendButtonProps {
  disabled: boolean
  onClick: () => void
}

const styles = {
  button: {
    marginTop: majorScale(5),
    appearance: 'primary',
    intent: 'success'
  }
}

const SendButton = (props: SendButtonProps) => {
  return (
    <Button {...styles.button} disabled={props.disabled} onClick={props.onClick}>
      Send Event
    </Button>
  )
}

export default SendButton
