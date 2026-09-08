'use client';

import { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

export default function FeedbackModal({ participant, isOpen, onClose }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [liked, setLiked] = useState('');
  const [improve, setImprove] = useState('');
  const [attendAgain, setAttendAgain] = useState('Yes');
  const [recommend, setRecommend] = useState('Yes');
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !participant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          participantId: participant.participantId,
          fullName: participant.fullName,
          email: participant.email,
          event: participant.eventName,
          rating,
          liked,
          improve,
          attendAgain,
          recommend,
          comments,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Error submitting feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Event Feedback & Review
            </h3>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--status-present-bg)',
              color: 'var(--status-present)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={28} />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Feedback Received
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '6px', marginBottom: '24px' }}>
              Thank you for sharing your experience. Your review will be processed into the executive AI feedback report!
            </p>

            <button onClick={handleClose} className="btn-primary" style={{ width: '100%' }}>
              Return to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Star Rating */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Overall Event Rating
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: star <= (hoverRating || rating) ? '#F59E0B' : '#CBD5E1',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      <Star size={24} fill={star <= (hoverRating || rating) ? '#F59E0B' : 'none'} />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', alignSelf: 'center', marginLeft: '6px' }}>
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  What did you like most about the event?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Hands-on AI labs, mentorship, curriculum quality..."
                  className="input-field"
                  value={liked}
                  onChange={(e) => setLiked(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                  What can we improve for the next edition?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Workshop pacing, Q&A duration..."
                  className="input-field"
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Attend Future Events?
                  </label>
                  <select
                    className="input-field"
                    value={attendAgain}
                    onChange={(e) => setAttendAgain(e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="Maybe">Maybe</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                    Recommend to Peers?
                  </label>
                  <select
                    className="input-field"
                    value={recommend}
                    onChange={(e) => setRecommend(e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="Maybe">Maybe</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', gap: '8px' }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Submitting Review...' : 'Submit Feedback'}
                </button>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
}
