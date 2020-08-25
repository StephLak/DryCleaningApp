import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Container, Message, Label } from "semantic-ui-react";
import { dashboardURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import _ from "lodash";
import { List, Card, Spin, Alert } from "antd";

class MyDashboard extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    authAxios
      .get(dashboardURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    const { Meta } = Card;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <div className="example">
            <Spin size="large" tip="Loading...">
              <Alert
                message="Products Loading!"
                description="Wait for few moments. It's coming up!"
                type="info"
              />
            </Spin>
          </div>
        )}
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3 }}
          dataSource={data}
          pagination={{ pageSize: 6 }}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card
                onClick={() => this.props.history.push(`/products/${item.id}`)}
                style={{ minHeight: 300 }}
                title={_.toUpper(item.category)}
                hoverable
                cover={<img src={item.image} style={{ height: 400 }} alt="" />}
                actions={[<h4>Date Brought</h4>, <h4>{item.publish}</h4>]}
              >
                <Meta title={item.title} description={item.description} />
                <div style={{ float: "right", marginTop: 5 }}>
                  <Label color="teal" tag size="large">
                    #{item.price}
                  </Label>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDashboard);
