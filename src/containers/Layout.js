import React from "react";
import { Dropdown, Menu as SeMenu } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { Layout, Menu } from "antd";
import {
  FileOutlined,
  UserOutlined,
  HomeOutlined,
  DashboardOutlined,
  ChromeOutlined,
} from "@ant-design/icons";

const { Sider, Content, Footer, Header } = Layout;
class CustomLayout extends React.Component {
  componentDidMount() {
    this.props.fetchCart();
  }
  state = {
    collapsed: false,
    activeItem: "bio",
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { authenticated, cart, loading } = this.props;
    const { activeItem } = this.state;
    return (
      // <Layout>
      // <Header
      //   className="header"
      //   style={{ position: "fixed", zIndex: 1, width: "100%" }}
      // >
      //   {/* <div className="logo" /> */}
      //   <Menu theme="dark" mode="horizontal" style={{ float: "left" }}>
      //     <Menu.Item key="1">MyDryCleaningApp</Menu.Item>
      //   </Menu>

      //   {authenticated ? (
      //     <React.Fragment>
      //       <Menu
      //         theme="dark"
      //         mode="horizontal"
      //         // defaultSelectedKeys={["2"]}
      //         style={{ float: "right" }}
      //       >
      //         <Menu.Item>
      //           <Dropdown
      //             icon="cart"
      //             loading={loading}
      //             text={`${cart !== null ? cart.order_items.length : 0}`}
      //             pointing
      //             className="link item"
      //           >
      //             <Dropdown.Menu>
      //               {cart !== null ? (
      //                 <React.Fragment>
      //                   {cart.order_items.map((order_item) => {
      //                     return (
      //                       <Dropdown.Item key={order_item.id}>
      //                         {order_item.quantity} x {order_item.item.title}
      //                       </Dropdown.Item>
      //                     );
      //                   })}
      //                   {cart.order_items.length < 1 ? (
      //                     <Dropdown.Item>No items in your cart</Dropdown.Item>
      //                   ) : null}
      //                   <Dropdown.Divider />

      //                   <Dropdown.Item
      //                     icon="arrow right"
      //                     text="Checkout"
      //                     onClick={() =>
      //                       this.props.history.push("/order-summary")
      //                     }
      //                   />
      //                 </React.Fragment>
      //               ) : (
      //                 <Dropdown.Item>No items in your cart</Dropdown.Item>
      //               )}
      //             </Dropdown.Menu>
      //           </Dropdown>
      //         </Menu.Item>
      //         <Menu.Item onClick={() => this.props.logout()} key="2">
      //           Logout
      //         </Menu.Item>
      //       </Menu>
      //     </React.Fragment>
      //   ) : (
      //     <Menu
      //       theme="dark"
      //       mode="horizontal"
      //       //defaultSelectedKeys={["2"]}
      //       style={{ float: "right" }}
      //     >
      //       <Menu.Item key="1">
      //         <Link to="/login">Login</Link>
      //       </Menu.Item>
      //       <Menu.Item key="2">
      //         <Link to="/signup">Signup</Link>
      //       </Menu.Item>
      //     </Menu>
      //   )}
      // </Header>
      //   <Layout style={{ minHeight: "100vh" }}>
      //     <Sider
      //       collapsible
      //       collapsed={this.state.collapsed}
      //       onCollapse={this.onCollapse}
      //       style={{
      //         paddingTop: 60,
      //         overflow: "auto",
      //         height: "100vh",
      //         position: "fixed",
      //         left: 0,
      //       }}
      //     >
      //       <div className="logo" />
      // <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
      //   <Menu.Item
      //     key="1"
      //     icon={<DesktopOutlined />}
      //     // style={{ height: 50 }}
      //   >
      //     <Link to="/" style={{ fontSize: 18 }}>
      //       Home
      //     </Link>
      //   </Menu.Item>
      //   <Menu.Item key="2" icon={<FileOutlined />}>
      //     <Link to="/products" style={{ fontSize: 18 }}>
      //       Products
      //     </Link>
      //   </Menu.Item>
      //   <Menu.Item key="3" icon={<UserOutlined />}>
      //     <Link to="/profile" style={{ fontSize: 18 }}>
      //       Profile
      //     </Link>
      //   </Menu.Item>
      //   <Menu.Item key="4" icon={<UserOutlined />}>
      //     <Link to="/dashboard" style={{ fontSize: 18 }}>
      //       MyDashboard
      //     </Link>
      //   </Menu.Item>
      // </Menu>
      //     </Sider>
      //     <Layout
      //       className="site-layout"
      //       style={{ marginLeft: 200, padding: 0 }}
      //     >
      //       <Header className="site-layout-background" style={{ padding: 0 }} />
      //       <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
      //         {/* <Breadcrumb style={{ margin: "16px 0" }}>
      //           <Breadcrumb.Item>User</Breadcrumb.Item>
      //           <Breadcrumb.Item>Bill</Breadcrumb.Item>
      //         </Breadcrumb> */}
      //         <div
      //           className="site-layout-background"
      //           style={{ padding: 40, minHeight: 360, paddingBottom: 50 }}
      //         >
      //           {this.props.children}
      //         </div>
      //       </Content>
      //       <Footer style={{ textAlign: "center" }}>
      //         Ant Design ©2018 Created by Ant UED
      //       </Footer>
      //     </Layout>
      //   </Layout>
      // </Layout>

      <Layout>
        <Header
          className="header"
          style={{ position: "fixed", zIndex: 1, width: "100%" }}
        >
          {/* <div className="logo" /> */}
          <Menu theme="dark" mode="horizontal" style={{ float: "left" }}>
            <Menu.Item key="1">
              <ChromeOutlined />
              MyDryCleaningApp
            </Menu.Item>
          </Menu>

          {authenticated ? (
            <React.Fragment>
              <Menu
                theme="dark"
                mode="horizontal"
                // defaultSelectedKeys={["2"]}
                style={{ float: "right" }}
              >
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
            breakpoint="xl"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
            style={{
              paddingTop: 60,
            }}
          >
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
              <Menu.Item key="1" icon={<HomeOutlined />}>
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
              <Menu.Item key="4" icon={<DashboardOutlined />}>
                <Link to="/dashboard" style={{ fontSize: 18 }}>
                  MyDashboard
                </Link>
              </Menu.Item>
            </Menu>
            {/* <SeMenu fluid vertical tabular>
              <SeMenu.Item
                name="bio"
                active={activeItem === "bio"}
                onClick={this.handleItemClick}
              />
              <SeMenu.Item
                name="pics"
                active={activeItem === "pics"}
                onClick={this.handleItemClick}
              />
              <SeMenu.Item
                name="companies"
                active={activeItem === "companies"}
                onClick={this.handleItemClick}
              />
              <SeMenu.Item
                name="links"
                active={activeItem === "links"}
                onClick={this.handleItemClick}
              />
            </SeMenu> */}
          </Sider>
          <Layout>
            <Content style={{ margin: "24px 16px 0", marginTop: 80 }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 360 }}
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
