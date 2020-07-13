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
import {
  Card,
  Divider,
  Spin,
  Alert,
  Row,
  Col,
  Steps,
  message,
  Progress,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
const { Step } = Steps;

class ProductDetail extends React.Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
    current: 0,
    percent: 0,
    status: "",
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
        console.log(res.data.washed);
        console.log(res.data.ironed);
        console.log(res.data.packed);
        console.log(res.data.ready);
        if (
          res.data.washed === true &&
          res.data.ironed === false &&
          res.data.packed === false &&
          res.data.ready === false
        ) {
          this.setState({ current: 1 });
          this.setState({ percent: 25 });
          this.setState({ status: "active" });
        } else if (
          res.data.washed === true &&
          res.data.ironed === true &&
          res.data.packed === false &&
          res.data.ready === false
        ) {
          this.setState({ current: 2 });
          this.setState({ percent: 50 });
          this.setState({ status: "active" });
        } else if (
          res.data.washed === true &&
          res.data.ironed === true &&
          res.data.packed === true &&
          res.data.ready === false
        ) {
          this.setState({ current: 3 });
          this.setState({ percent: 75 });
          this.setState({ status: "active" });
        } else if (
          res.data.washed === true &&
          res.data.ironed === true &&
          res.data.packed === true &&
          res.data.ready === true
        ) {
          this.setState({ current: 4 });
          this.setState({ percent: 100 });
          this.setState({ status: "success" });
          message.success("Your cloth is ready for checkout");
        } else {
          this.setState({ current: 0 });
          this.setState({ percent: 0 });
          this.setState({ status: "exception" });
        }

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
    const {
      data,
      error,
      formData,
      formVisible,
      loading,
      current,
      percent,
      status,
    } = this.state;
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

        <div style={{ paddingBottom: 100 }}>
          <Row>
            <Col xs={24} sm={24} md={20} lg={12} xl={12}>
              <Card
                style={{
                  margin: 10,
                  textAlign: "center",
                }}
                hoverable
                cover={
                  <img
                    src={item.image}
                    style={{ height: 300, minWidth: 50 }}
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
                  <h3 style={{ color: "Black", fontSize: 20 }}>
                    {item.publish}
                  </h3>
                </Divider>
                <Meta title={item.title} description={item.description} />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={20} lg={12} xl={12}>
              <Card
                style={{
                  margin: 10,
                  textAlign: "center",
                }}
                hoverable
                title="Product Processing Details"
                bordered={true}
              >
                <Row gutter={16}>
                  <Col style={{ background: "#0092ff" }} span={8}>
                    <h3>Wash Status</h3>
                  </Col>
                  <Col span={16}>
                    {item.washed === true ? (
                      <h3 style={{ background: "#0092ff" }}>Washed</h3>
                    ) : (
                      <h3 style={{ background: "#0092ff" }}>Washing</h3>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col style={{ background: "#0092ff" }} span={8}>
                    <h3>Ironing Status</h3>
                  </Col>
                  <Col span={16}>
                    {item.ironed === true ? (
                      <h3 style={{ background: "#0092ff" }}>Ironed</h3>
                    ) : (
                      <h3 style={{ background: "#0092ff" }}>Ironing</h3>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col style={{ background: "#0092ff" }} span={8}>
                    <h3>Packing Status</h3>
                  </Col>
                  <Col span={16}>
                    {item.packed === true ? (
                      <h3 style={{ background: "#0092ff" }}>Packed</h3>
                    ) : (
                      <h3 style={{ background: "#0092ff" }}>Packing</h3>
                    )}
                  </Col>
                </Row>
                <Divider />
                <Row gutter={16}>
                  <Col style={{ background: "#0092ff" }} span={8}>
                    <h3>Complete Status</h3>
                  </Col>
                  <Col span={16}>
                    {item.ready === true ? (
                      <h3 style={{ background: "#0092ff" }}>
                        Ready for checkout
                      </h3>
                    ) : (
                      <h3 style={{ background: "#0092ff" }}>
                        Not ready for checkout
                      </h3>
                    )}
                  </Col>
                </Row>
                {/* <Steps current={current}>
                  {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div> */}
                <Steps
                  type="navigation"
                  current={current}
                  className="site-navigation-steps"
                >
                  <Step status="wait" title="Just In" />
                  <Step status="process" title="Washed" />
                  <Step status="process" title="Ironed" />
                  <Step status="process" title="Packed" />
                  <Step status="finish" title="Ready" />
                </Steps>
                <Progress
                  type="circle"
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  percent={percent}
                  status={status}
                />
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
