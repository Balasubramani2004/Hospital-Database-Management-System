import { useEffect, useState } from "react";
import axios from "axios";

function PatientFullHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patient/history/1")
      .then(res => setRecords(res.data));
  }, []);

  return (
    <div>
      <h2>Medical History</h2>
      {records.map(r => (
        <div key={r.record_id}>
          <p>Date: {r.visit_date}</p>
          <p>Diagnosis: {r.diagnosis}</p>
          <p>Prescription: {r.prescription}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default PatientFullHistory;
