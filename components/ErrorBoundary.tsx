import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize } from '@/constants/Theme';
import { logger } from '@/utils/logger';

/**
 * Props for the ErrorBoundary component
 */
interface Props {
  /** Child components to render */
  children: ReactNode;
  /** Optional custom fallback UI to show when an error occurs */
  fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component
 */
interface State {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught, if any */
  error: Error | null;
}

/**
 * ErrorBoundary component to catch React errors and prevent app crashes
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    // Future: Send to error tracking service
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Wormhole Destabilized</Text>
            <Text style={styles.message}>
              Something went wrong. The gate has been shut down for safety.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>Reset Gate</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.accent.orange,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  errorBox: {
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.status.error,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: Colors.accent.gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: FontSize.md,
    fontWeight: 'bold',
    color: Colors.background.tertiary,
  },
});
