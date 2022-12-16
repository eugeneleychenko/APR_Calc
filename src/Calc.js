import React from "react";
import { Form, Button, Radio } from "react-bootstrap";
import "./styles.css";

const APRForm = () => {
  const [amount, setAmount] = React.useState();
  const [payment, setPayment] = React.useState();
  const [payments, setPayments] = React.useState();
  const [ppy, setPpy] = React.useState(0);
  const [apr, setApr] = React.useState(0);
  const [frequency, setFrequency] = React.useState("daily");

  const handleCalculate = () => {
    const APRGuess = 0.22;
    const partial = 0;
    const full = 1;
    const result = findAPR(
      amount,
      payment,
      payments,
      ppy,
      APRGuess,
      partial,
      full
    );
    setApr(result.toFixed(2));
  };

  function findAPR(amount, payment, payments, ppy, APRGuess, partial, full) {
    let result = APRGuess;
    let tempguess = APRGuess;

    do {
      result = tempguess;
      //Step 1
      let i = tempguess / (100 * ppy);
      let A1 = generalEquation(payments, payment, full, partial, i);
      //Step 2
      let i2 = (tempguess + 0.1) / (100 * ppy);
      let A2 = generalEquation(payments, payment, full, partial, i2);
      //Step 3
      tempguess = tempguess + (0.1 * (amount - A1)) / (A2 - A1);
    } while (Math.abs(result * 10000 - tempguess * 10000) > 1);
    return result;
  }

  function generalEquation(period, payment, initialPeriods, fractions, rate) {
    let retval = 0;
    for (let x = 0; x < period; x++)
      retval +=
        payment /
        ((1.0 + fractions * rate) * Math.pow(1 + rate, initialPeriods + x));
    return retval;
  }

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    if (e.target.value === "daily") {
      setPpy(365);
    } else {
      setPpy(52);
    }
  };

  const handleReset = () => {
    setAmount("");
    setPayment("");
    setPayments("");
    setPpy(0);
    setApr(0);
    setFrequency("daily");
  };

  return (
    <Form>
      <Form.Group
        controlId="amount"
        style={{ padding: "10px", margin: "10px" }}
        placeholder="100,000"
      >
        <Form.Label>Funding Amount ($) </Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="ppy" style={{ padding: "10px", margin: "10px" }}>
        {/* <Form.Label># of Payments Per Year </Form.Label> */}
        <Form.Control
          type="number"
          value={ppy}
          onChange={(e) => setPpy(e.target.value)}
          style={{ display: "none" }}
        />

        <Form.Label>Frequency</Form.Label>
        <Form.Control as="select" onChange={handleFrequencyChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </Form.Control>
      </Form.Group>

      <Form.Group
        controlId="payments"
        style={{ padding: "10px", margin: "10px" }}
      >
        <Form.Label># of Total Payments </Form.Label>
        <Form.Control
          type="number"
          value={payments}
          onChange={(e) => setPayments(e.target.value)}
        />
      </Form.Group>

      <Form.Group
        controlId="payment"
        style={{ padding: "10px", margin: "10px" }}
      >
        <Form.Label>Payment ($)</Form.Label>
        <Form.Control
          type="number"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="full" className="checkbox">
        {/* <Form.Label>
          <Form.Check type="checkbox" onChange={() => toggleFull()} />
          Full
        </Form.Label> */}
      </Form.Group>
      <Button variant="primary" onClick={handleCalculate}>
        Calculate
      </Button>
      <Button variant="danger" onClick={handleReset}>
        Reset
      </Button>
      <br />
      <br />

      <Form.Group>
        <Form.Label>APR (%)</Form.Label>
        <Form.Control type="number" placeholder="APR" value={apr} readOnly />
      </Form.Group>
    </Form>
  );
};

export default APRForm;
