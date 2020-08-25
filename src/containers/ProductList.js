import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Container, Message, Label } from "semantic-ui-react";
import { productListURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import _ from "lodash";
import { List, Card, Avatar, Spin, Alert } from "antd";

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: [],
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  render() {
    const { data, error, loading } = this.state;
    const { Meta } = Card;
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
                style={{ minHeight: 300 }}
                title={_.toUpper(item.category)}
                extra={<h4>{item.user}</h4>}
                hoverable
                cover={<img src={item.image} style={{ height: 400 }} alt="" />}
                actions={[<h4>Date Brought</h4>, <h4>{item.publish}</h4>]}
              >
                <Meta
                  avatar={<Avatar size={50} src={item.profile.photo} />}
                  title={item.title}
                  description={item.description}
                />
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

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ProductList);
