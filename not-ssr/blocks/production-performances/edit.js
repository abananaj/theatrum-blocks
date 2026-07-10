import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

export default function Edit({ context }) {
  const blockProps = useBlockProps({ className: 'performances-list-editor' });
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const postId = context?.postId;

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    apiFetch({ path: `/chance/v1/production-performances/${postId}` })
      .then((data) => {
        setPerformances(data.performances || []);
        setIsLoading(false);
      })
      .catch(() => {
        setPerformances([]);
        setIsLoading(false);
      });
  }, [postId]);

  if (isLoading) {
    return (
      <div {...blockProps}>
        <Spinner />
      </div>
    );
  }

  if (performances.length === 0) {
    return (
      <div {...blockProps}>
        <div className="performances-list-placeholder">
          <span className="dashicons dashicons-calendar-alt" />
          <p>{__('No upcoming performances', 'performances-list')}</p>
          <p className="description">
            {__(
              'Add upcoming performances to the performances repeater field.',
              'performances-list'
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div {...blockProps}>
      {performances.map((perf, index) => (
        <div key={index} className="performance-row">
          <p className="show">
            <span className="date">{perf.date}</span>
            {perf.time && <span className="time">{perf.time}</span>}
          </p>
          {perf.note && (
            <p className="note">
              <span className="note">{perf.note}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
