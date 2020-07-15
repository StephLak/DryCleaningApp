import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Container, Message } from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { List, Card, Avatar, Spin, Alert, Tag } from "antd";
import { DollarOutlined } from "@ant-design/icons";
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
          grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 3 }}
          dataSource={data}
          pagination={{ pageSize: 6 }}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Card
                style={{ minHeight: 300 }}
                title={item.category}
                extra={<h6>by {item.user}</h6>}
                hoverable
                cover={<img src={item.image} style={{ height: 400 }} alt="" />}
                actions={[
                  <h4>{item.price}</h4>,
                  <h6>{item.publish}</h6>,
                  <h4>by {item.user}</h4>,
                ]}
              >
                <Meta
                  avatar={<Avatar size={50} src={item.profile.photo} />}
                  title={item.title}
                  description={item.description}
                />
                <div style={{ float: "right", marginTop: 5 }}>
                  <Tag icon={<DollarOutlined />} color="#2db7f5">
                    {item.price}
                  </Tag>
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
