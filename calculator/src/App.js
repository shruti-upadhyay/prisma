import React, { useState } from 'react';
import { evaluate } from 'mathjs';

function App() {
  const [input, setInput] = useState('');

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const clearInput = () => {
    setInput('');
  };

  const calculateResult = () => {
    try {
      setInput(evaluate(input).toString());
    } catch {
      setInput('Error');
    }
  };

  const removeLastCharacter = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <div style={styles.container}>
      <h2>React Calculator</h2>
      <input type="text" value={input} readOnly style={styles.input} />
      <div style={styles.buttons}>
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '%', '+'].map((char) =>
          <button key={char} onClick={() => handleClick(char)} style={styles.button}>
            {char}
          </button>
        )}
        <div style={styles.bottomRow}>
          <button onClick={removeLastCharacter} style={styles.button}>
            Remove
          </button>
          <button onClick={calculateResult} style={styles.button}>
            =
          </button>
          <button onClick={clearInput} style={styles.clearButton}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    maxWidth: '300px',
    margin: '50px auto',
    padding: '10px',
    border: '2px solid #000',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
  },
  input: {
    width: '100%',
    height: '50px',
    fontSize: '20px',
    textAlign: 'right',
    marginBottom: '5px',
  },
  buttons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0', // No space between any buttons
  },
  bottomRow: {
    gridColumn: 'span 4',
    display: 'flex',
    justifyContent: 'flex-start', // Keep buttons side by side without space
  },
  button: {
    padding: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    margin: '0', // No margin for buttons
    width: '100%', // Ensure buttons stretch to fill their space
  },
  clearButton: {
    padding: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    backgroundColor: 'red', // Restore red color for 'Clear'
    color: 'white',
    margin: '0',
    width: '100%', // Ensure button fills its space
  },
};

export default App;
