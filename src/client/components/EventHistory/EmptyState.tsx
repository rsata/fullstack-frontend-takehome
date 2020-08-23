import { Pane, Heading, Paragraph } from 'evergreen-ui'

const styling = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '30px'
  },
  body: {
    display: 'flex',
    flexDirection: 'column'
  }
}

const EmptyState = () => (
  <Pane {...styling.container}>
    <Pane {...styling.body}>
      <Heading>No events sent</Heading>
      <Paragraph>Use the editor on the left to send events!</Paragraph>
    </Pane>
  </Pane>
)

export default EmptyState