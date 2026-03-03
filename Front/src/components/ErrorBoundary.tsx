import React, { Component, ReactNode } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="flex flex-col gap-1 items-center justify-center">
              <div className="text-6xl mb-2">⚠️</div>
              <h1 className="text-xl font-bold text-danger">
                Algo salió mal
              </h1>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <p className="text-center text-gray-600">
                Se produjo un error inesperado. Por favor, intenta nuevamente.
              </p>
              {this.state.error && (
                <div className="bg-danger-50 p-3 rounded-lg">
                  <p className="text-sm text-danger font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <Button
                  color="primary"
                  onPress={this.handleReload}
                >
                  Recargar página
                </Button>
                <Button
                  variant="bordered"
                  onPress={this.handleGoHome}
                >
                  Ir al inicio
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
