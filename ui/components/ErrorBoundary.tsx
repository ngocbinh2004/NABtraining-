//nextjs.org/docs/advanced-features/error-handling

import { Component } from 'react'

interface IProps {
  children?: React.ReactNode
  [key: string]: any
}

interface IState {
  hasError?: boolean
}

class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError(_error: any) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            aria-label="retry"
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error
    return this.props.children
  }
}

export default ErrorBoundary
