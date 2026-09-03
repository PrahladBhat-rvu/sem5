import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const [status, setStatus] = useState("Checking Supabase...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

      if (error) {
        setStatus(`Supabase connected, but database test failed: ${error.message}`);
      } else {
        setStatus("Supabase connection works.");
      }
    }

    testConnection();
  }, []);

  return (
    <div>
      <h1>Vouch</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;