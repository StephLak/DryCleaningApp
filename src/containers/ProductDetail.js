import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Container,
  Dimmer,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Select,
} from "semantic-ui-react";
import { productDetailURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { Card, Divider, Spin, Alert, Row, Col } from "antd";

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    axios
      .get(productDetailURL(params.productID))
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFormatData = (formData) => {
    // convert {colour: 1, size: 2} to [1,2] - they're all variations
    return Object.keys(formData).map((key) => {
      return formData[key];
    });
  };

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);
    authAxios
      .post(addToCartURL, { slug, variations })
      .then((res) => {
        console.log(res.data);
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, formData, formVisible, loading } = this.state;
    const item = data;
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
                message="Product Loading!"
                description="Wait for few moments. It's coming up!"
                type="info"
              />
            </Spin>
          </div>
        )}
        {/* <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                image={item.image}
                header={item.title}
                meta={
                  <React.Fragment>
                    {item.category}
                    {item.discount_price && (
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )}
                  </React.Fragment>
                }
                description={item.description}
                extra={
                  <React.Fragment>
                    <Button
                      fluid
                      color="yellow"
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={this.handleToggleForm}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button>
                  </React.Fragment>
                }
              />
              {formVisible && (
                <React.Fragment>
                  <Divider />
                  <Form onSubmit={() => this.handleAddToCart(item.slug)}>
                    {data.variations.map((v) => {
                      const name = v.name.toLowerCase();
                      return (
                        <Form.Field key={v.id}>
                          <Select
                            name={name}
                            onChange={this.handleChange}
                            placeholder={`Select a ${name}`}
                            fluid
                            selection
                            options={v.item_variations.map((item) => {
                              return {
                                key: item.id,
                                text: item.value,
                                value: item.id,
                              };
                            })}
                            value={formData[name]}
                          />
                        </Form.Field>
                      );
                    })}
                    <Form.Button primary>Add</Form.Button>
                  </Form>
                </React.Fragment>
              )}
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Try different variations</Header>
              {data.variations &&
                data.variations.map((v) => {
                  return (
                    <React.Fragment key={v.id}>
                      <Header as="h3">{v.name}</Header>
                      <Item.Group divided>
                        {v.item_variations.map((iv) => {
                          return (
                            <Item key={iv.id}>
                              {iv.attachment && (
                                <Item.Image
                                  size="tiny"
                                  src={`http://127.0.0.1:8000${iv.attachment}`}
                                />
                              )}
                              <Item.Content verticalAlign="middle">
                                {iv.value}
                              </Item.Content>
                            </Item>
                          );
                        })}
                      </Item.Group>
                    </React.Fragment>
                  );
                })}
            </Grid.Column>
          </Grid.Row>
        </Grid> */}

        <div className="site-card-wrapper">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={12}>
              <Card
                style={{
                  maxWidth: 500,
                  marginTop: 10,
                  minWidth: 200,
                  textAlign: "center",
                }}
                hoverable
                cover={
                  <img
                    src={item.image}
                    style={{ height: 300, maxWidth: 500, minWidth: 200 }}
                    alt=""
                  />
                }
              >
                <Divider
                  orientation="left"
                  style={{ color: "Red", fontWeight: "bold" }}
                >
                  <h3 style={{ color: "Black", fontSize: 20 }}>
                    {item.category}
                  </h3>
                </Divider>
                <Meta title={item.title} description={item.description} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                style={{
                  maxWidth: 500,
                  marginTop: 10,
                  minWidth: 200,
                  textAlign: "center",
                }}
                hoverable
                title="Card title"
                bordered={true}
              >
                Card content
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
