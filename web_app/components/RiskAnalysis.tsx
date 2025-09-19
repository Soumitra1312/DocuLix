import React from 'react';
import { Card, Badge, ProgressBar, Alert } from 'react-bootstrap';

interface RiskAnalysisProps {
  riskAnalysis: any;
  show: boolean;
  onClose: () => void;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskAnalysis, show, onClose }) => {
  if (!show || !riskAnalysis) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning'; 
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  const getRiskProgressColor = (score: number) => {
    if (score >= 70) return 'danger';
    if (score >= 40) return 'warning';
    return 'success';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <Card style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto', margin: '20px' }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">🔍 Legal Risk Assessment</h5>
          <button 
            className="btn btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </Card.Header>
        
        <Card.Body>
          {/* Overall Risk Score */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>Overall Risk Level</h6>
              <Badge bg={getRiskColor(riskAnalysis.risk_level)} className="fs-6">
                {riskAnalysis.risk_level}
              </Badge>
            </div>
            <ProgressBar 
              now={riskAnalysis.overall_risk_score} 
              variant={getRiskProgressColor(riskAnalysis.overall_risk_score)}
              label={`${riskAnalysis.overall_risk_score}%`}
              style={{ height: '25px' }}
            />
          </div>

          {/* High Risk Terms */}
          {riskAnalysis.high_risk_terms?.detected_risks && 
           Object.keys(riskAnalysis.high_risk_terms.detected_risks).length > 0 && (
            <div className="mb-4">
              <h6>⚠️ Detected Risk Terms</h6>
              <div className="row">
                {Object.entries(riskAnalysis.high_risk_terms.detected_risks).map(([category, details]: [string, any]) => (
                  <div key={category} className="col-md-6 mb-3">
                    <Card>
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>{category.replace(/_/g, ' ').toUpperCase()}</strong>
                          <Badge bg={details.severity === 'HIGH' ? 'danger' : details.severity === 'MEDIUM' ? 'warning' : 'info'}>
                            {details.severity}
                          </Badge>
                        </div>
                        <small className="text-muted">
                          Found: {details.terms_found.join(', ')}
                        </small>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {riskAnalysis.sentiment_analysis && (
            <div className="mb-4">
              <h6>📊 Sentiment Analysis</h6>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted d-block">Sentiment Score</small>
                  <strong className={riskAnalysis.sentiment_analysis.sentiment_score < 0 ? 'text-danger' : 'text-success'}>
                    {riskAnalysis.sentiment_analysis.sentiment_score.toFixed(2)}
                  </strong>
                </div>
                <div className="col-md-4">
                  <small className="text-muted d-block">Subjectivity</small>
                  <strong>{riskAnalysis.sentiment_analysis.subjectivity.toFixed(2)}</strong>
                </div>
                <div className="col-md-4">
                  <small className="text-muted d-block">Sentiment Risk</small>
                  <strong className="text-warning">
                    {riskAnalysis.sentiment_analysis.sentiment_risk}%
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* Obligations Balance */}
          {riskAnalysis.obligations_balance && (
            <div className="mb-4">
              <h6>⚖️ Obligations Balance</h6>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted d-block">Client Obligations</small>
                  <strong>{riskAnalysis.obligations_balance.client_obligations}</strong>
                </div>
                <div className="col-md-4">
                  <small className="text-muted d-block">Provider Obligations</small>
                  <strong>{riskAnalysis.obligations_balance.provider_obligations}</strong>
                </div>
                <div className="col-md-4">
                  <small className="text-muted d-block">Balance Risk</small>
                  <strong className={riskAnalysis.obligations_balance.balance_risk > 15 ? 'text-danger' : 'text-success'}>
                    {riskAnalysis.obligations_balance.balance_risk}%
                  </strong>
                </div>
              </div>
              {!riskAnalysis.obligations_balance.is_balanced && (
                <Alert variant="warning" className="mt-2">
                  ⚠️ Obligations appear imbalanced between parties
                </Alert>
              )}
            </div>
          )}

          {/* AI Analysis */}
          {riskAnalysis.ai_analysis && riskAnalysis.ai_analysis.specific_concerns && (
            <div className="mb-4">
              <h6>🤖 AI-Powered Analysis</h6>
              {riskAnalysis.ai_analysis.specific_concerns.length > 0 && (
                <div className="mb-3">
                  <strong className="d-block mb-2">Specific Concerns:</strong>
                  <ul className="list-unstyled">
                    {riskAnalysis.ai_analysis.specific_concerns.map((concern: string, index: number) => (
                      <li key={index} className="mb-1">
                        <span className="text-danger">•</span> {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
            <div className="mb-4">
              <h6>💡 Recommendations</h6>
              <div className="list-group">
                {riskAnalysis.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="list-group-item border-0 px-0">
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default RiskAnalysis;