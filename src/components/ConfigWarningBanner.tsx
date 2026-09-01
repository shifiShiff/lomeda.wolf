import './ConfigWarningBanner.css';

const ConfigWarningBanner = () => {
  return (
    <div className="config-warning" role="alert">
      <div className="container config-warning__inner">
        <strong>שימו לב:</strong> טרם הוזנו פרטי חיבור אמיתיים ל-Google Sheets. יש להגדיר את
        ה-API Key וה-Spreadsheet ID בקובץ <code>src/config.ts</code> (או ב-<code>.env.local</code>) כדי
        לטעון נתונים אמיתיים.
      </div>
    </div>
  );
};

export default ConfigWarningBanner;
