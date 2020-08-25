import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import { paymentListURL } from "../constants";
import { authAxios } from "../utils";

class PaymentHistory extends Component {
  state = {
    payments: [],
  };

  componentDidMount() {
    this.handleFetchPayments();
  }

  handleFetchPayments = () => {
    this.setState({ loading: true });
    authAxios
      .get(paymentListURL)
      .then((res) => {
        this.setState({
          loading: false,
          payments: res.data,
        });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { payments } = this.state;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {payments.map((p) => {
            return (
              <Table.Row key={p.id}>
                <Table.Cell>{p.id}</Table.Cell>
                <Table.Cell>${p.amount}</Table.Cell>
                <Table.Cell>{new Date(p.timestamp).toUTCString()}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default PaymentHistory;
