import { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from '../../ui';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Отправка ошибки в сервис логирования (опционально)
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.handleReset);
            }

            return (
                <div className="container mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <Alert type="danger">
                                <h4 className="alert-heading">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Что-то пошло не так
                                </h4>
                                <p>Произошла ошибка при отображении этой части приложения.</p>

                                {process.env.NODE_ENV === 'development' && this.state.error && (
                                    <details className="mt-3">
                                        <summary style={{ cursor: 'pointer' }}>
                                            Детали ошибки (только для разработки)
                                        </summary>
                                        <pre className="mt-2 p-2 bg-light rounded" style={{ fontSize: '0.85rem' }}>
                                            {this.state.error.toString()}
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </details>
                                )}

                                <hr />

                                <div className="d-flex gap-2">
                                    <Button variant="primary" onClick={this.handleReset}>
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Попробовать снова
                                    </Button>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => window.location.href = '/'}
                                    >
                                        <i className="bi bi-house me-2"></i>
                                        На главную
                                    </Button>
                                </div>
                            </Alert>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.func,
    onError: PropTypes.func,
    onReset: PropTypes.func,
};