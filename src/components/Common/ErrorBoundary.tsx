import type { ReactNode } from 'react';
import { Component } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // noop
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }}>
          <h2>Ocorreu um erro inesperado.</h2>
          <p>Recarregue a página e tente novamente.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
