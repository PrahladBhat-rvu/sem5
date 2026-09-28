import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

const SERVER_URL = 'http://localhost:5000';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function testServer() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${SERVER_URL}/api/message`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult({ type: 'success', data });
    } catch (error) {
      setResult({
        type: 'error',
        message: `Could not connect to ${SERVER_URL}. Make sure the server is running.`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand className="fw-bold">
            React Bootstrap Demo
          </Navbar.Brand>
          <Badge bg="success">Client : 5173</Badge>
        </Container>
      </Navbar>

      <Container className="py-5">
        <div className="hero text-center mb-5">
          <Badge bg="primary" className="mb-3 px-3 py-2">
            Two-Port Full-Stack App
          </Badge>

          <h1 className="display-5 fw-bold">
            React Bootstrap Client + Express Server
          </h1>

          <p className="lead text-secondary mx-auto">
            A simple example showing a React client running on one port
            and an Express API server running on another.
          </p>
        </div>

        <Card className="shadow-sm border-0 mx-auto demo-card">
          <Card.Body className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <Card.Title className="h3 mb-1">Server Connection</Card.Title>
                <Card.Text className="text-secondary mb-0">
                  Call the Express API from the React frontend.
                </Card.Text>
              </div>
              <Badge bg="secondary">API : 5000</Badge>
            </div>

            <div className="connection-box mb-4">
              <div>
                <small className="text-secondary">Frontend</small>
                <div className="fw-semibold">http://localhost:5173</div>
              </div>

              <div className="arrow">→</div>

              <div>
                <small className="text-secondary">Backend API</small>
                <div className="fw-semibold">http://localhost:5000</div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={testServer}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Connecting...
                </>
              ) : (
                'Test Server Connection'
              )}
            </Button>

            {result?.type === 'success' && (
              <Alert variant="success" className="mt-4 mb-0">
                <Alert.Heading>Connection successful!</Alert.Heading>
                <p className="mb-2">{result.data.message}</p>
                <hr />
                <div className="small">
                  <strong>Server port:</strong> {result.data.serverPort}
                  <br />
                  <strong>Response time:</strong> {result.data.timestamp}
                </div>
              </Alert>
            )}

            {result?.type === 'error' && (
              <Alert variant="danger" className="mt-4 mb-0">
                {result.message}
              </Alert>
            )}
          </Card.Body>
        </Card>

        <div className="text-center text-secondary mt-5">
          Built with React, React-Bootstrap, Vite and Express.
        </div>
      </Container>
    </div>
  );
}

export default App;
