import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold">draft</h1>
      <button onClick={() => setCount(count + 1)}>click me {count}</button>
    </div>
  );
}

export default App;
