import React from "react";
import { Dropdown } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { Layout, Menu } from "antd";
import { DesktopOutlined, FileOutlined, UserOutlined } from "@ant-design/icons";

const { Sider, Content, Footer, Header } = Layout;
class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { authenticated, cart, loading } = this.props;
    return (
      <Layout>
        <Header
          className="header"
          style={{ position: "fixed", zIndex: 1, width: "100%" }}
        >
          {/* <div className="logo" /> */}
          <Menu theme="dark" mode="horizontal" style={{ float: "left" }}>
            <Menu.Item key="1">MyDryCleaningApp</Menu.Item>
          </Menu>

          {authenticated ? (
            <React.Fragment>
              <Menu
                theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={["2"]}
                style={{ float: "right" }}
              >
                {/* <Menu.Item key="1">
                  <Link to="/profile">Profile</Link>
                </Menu.Item> */}
                <Menu.Item>
                  <Dropdown
                    icon="cart"
                    loading={loading}
                    text={`${cart !== null ? cart.order_items.length : 0}`}
                    pointing
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {cart !== null ? (
                        <React.Fragment>
                          {cart.order_items.map((order_item) => {
                            return (
                              <Dropdown.Item key={order_item.id}>
                                {order_item.quantity} x {order_item.item.title}
                              </Dropdown.Item>
                            );
                          })}
                          {cart.order_items.length < 1 ? (
                            <Dropdown.Item>No items in your cart</Dropdown.Item>
                          ) : null}
                          <Dropdown.Divider />

                          <Dropdown.Item
                            icon="arrow right"
                            text="Checkout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </React.Fragment>
                      ) : (
                        <Dropdown.Item>No items in your cart</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item onClick={() => this.props.logout()} key="2">
                  Logout
                </Menu.Item>
              </Menu>
            </React.Fragment>
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              //defaultSelectedKeys={["2"]}
              style={{ float: "right" }}
            >
              <Menu.Item key="1">
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/signup">Signup</Link>
              </Menu.Item>
            </Menu>
          )}
        </Header>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            style={{
              paddingTop: 60,
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item
                key="1"
                icon={<DesktopOutlined />}
                // style={{ height: 50 }}
              >
                <Link to="/" style={{ fontSize: 18 }}>
                  Home
                </Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<FileOutlined />}>
                <Link to="/products" style={{ fontSize: 18 }}>
                  Products
                </Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<UserOutlined />}>
                <Link to="/profile" style={{ fontSize: 18 }}>
                  Profile
                </Link>
              </Menu.Item>
              {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="9">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu> */}
              {/* <Menu.Item key="9" icon={<FileOutlined />} /> */}
            </Menu>
          </Sider>
          <Layout
            className="site-layout"
            style={{ marginLeft: 200, padding: 0 }}
          >
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              {/* <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ padding: 40, minHeight: 360, paddingBottom: 50 }}
              >
                {this.props.children}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
//         {this.props.children}

//         <Segment
//           inverted
//           vertical
//           style={{ margin: "5em 0em 0em", padding: "5em 0em" }}
//         >
//           <Container textAlign="center">
//             <Grid divided inverted stackable>
//               <Grid.Column width={3}>
//                 <Header inverted as="h4" content="Group 1" />
//                 <List link inverted>
//                   <List.Item as="a">Link One</List.Item>
//                   <List.Item as="a">Link Two</List.Item>
//                   <List.Item as="a">Link Three</List.Item>
//                   <List.Item as="a">Link Four</List.Item>
//                 </List>
//               </Grid.Column>
//               <Grid.Column width={3}>
//                 <Header inverted as="h4" content="Group 2" />
//                 <List link inverted>
//                   <List.Item as="a">Link One</List.Item>
//                   <List.Item as="a">Link Two</List.Item>
//                   <List.Item as="a">Link Three</List.Item>
//                   <List.Item as="a">Link Four</List.Item>
//                 </List>
//               </Grid.Column>
//               <Grid.Column width={3}>
//                 <Header inverted as="h4" content="Group 3" />
//                 <List link inverted>
//                   <List.Item as="a">Link One</List.Item>
//                   <List.Item as="a">Link Two</List.Item>
//                   <List.Item as="a">Link Three</List.Item>
//                   <List.Item as="a">Link Four</List.Item>
//                 </List>
//               </Grid.Column>
//               <Grid.Column width={7}>
//                 <Header inverted as="h4" content="Footer Header" />
//                 <p>
//                   Extra space for a call to action inside the footer that could
//                   help re-engage users.
//                 </p>
//               </Grid.Column>
//             </Grid>

//             <Divider inverted section />
//             <Image centered size="mini" src="/logo.png" />
//             <List horizontal inverted divided link size="small">
//               <List.Item as="a" href="#">
//                 Site Map
//               </List.Item>
//               <List.Item as="a" href="#">
//                 Contact Us
//               </List.Item>
//               <List.Item as="a" href="#">
//                 Terms and Conditions
//               </List.Item>
//               <List.Item as="a" href="#">
//                 Privacy Policy
//               </List.Item>
//             </List>
//           </Container>
//         </Segment>
//       </div>
//     );
//   }
// }
