import { useState, useEffect } from 'react';

const DateFilter = ({ onDateChange, loading, currentDates }) => {
  const [dates, setDates] = useState({
    from: currentDates?.from || '',
    to: currentDates?.to || ''
  });

  useEffect(() => {
    setDates({
      from: currentDates?.from || '',
      to: currentDates?.to || ''
    });
  }, [currentDates]);

  const handleDateChange = (type, value) => {
    const newDates = {
      ...dates,
      [type]: value
    };
    setDates(newDates);

    if ((newDates.from && newDates.to) || (!newDates.from && !newDates.to)) {
      onDateChange(newDates.from, newDates.to);
    }
  };

  const clearDates = () => {
    setDates({ from: '', to: '' });
    onDateChange('', '');
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="date-filter">
      <div className="date-filter-header">
        <h3>📅 Filter by Date</h3>
        {(dates.from || dates.to) && (
          <button 
            onClick={clearDates} 
            className="clear-dates-button"
            disabled={loading}
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="from-date">From Date:</label>
          <input
            id="from-date"
            type="date"
            value={dates.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            disabled={loading}
            max={dates.to || getMaxDate()}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="to-date">To Date:</label>
          <input
            id="to-date"
            type="date"
            value={dates.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            disabled={loading}
            min={dates.from}
            max={getMaxDate()}
          />
        </div>
      </div>
      {(dates.from && dates.to) && (
        <div className="date-range-info">
          Showing articles from {new Date(dates.from).toLocaleDateString()} to {new Date(dates.to).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default DateFilter;