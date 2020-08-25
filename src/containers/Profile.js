import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import _ from "lodash";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Menu,
  Message,
  Segment,
} from "semantic-ui-react";
import {
  countryListURL,
  addressListURL,
  addressDeleteURL,
  userIDURL,
  profileDetailURL,
  profileUpdateURL,
} from "../constants";
import { authAxios } from "../utils";
import AddressForm from "./AddressForm";
import PaymentHistory from "./PaymentHistory";
import {
  Avatar,
  Row as AntRow,
  Col as AntCol,
  Descriptions,
  Upload,
  message,
  Modal,
  Button as AntButton,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { fetchProfile } from "../store/actions/profile";
import logo from "../media/DryCleaning1.jpeg";

const UPDATE_FORM = "UPDATE_FORM";
const CREATE_FORM = "CREATE_FORM";

class Profile extends React.Component {
  state = {
    activeItem: "billingAddress",
    addresses: [],
    countries: [],
    userID: null,
    selectedAddress: null,
    profile: [],
    loading: false,
    previewVisible: false,
    previewImage: "",
    fileList: [],
    visible: false,
    Data: {
      photo: null,
      surname: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      id: "",
      user: 1,
      email: "",
    },
    success: false,
  };

  componentDidMount() {
    this.handleFetchAddresses();
    this.handleFetchCountries();
    this.handleFetchUserID();
    this.handleFetchProfile();
  }

  handleItemClick = (name) => {
    this.setState({ activeItem: name }, () => {
      this.handleFetchAddresses();
    });
  };

  handleGetActiveItem = () => {
    const { activeItem } = this.state;
    if (activeItem === "billingAddress") {
      return "Billing Address";
    } else if (activeItem === "shippingAddress") {
      return "Shipping Address";
    }
    return "Payment History";
  };

  handleFormatCountries = (countries) => {
    const keys = Object.keys(countries);
    return keys.map((k) => {
      return {
        key: k,
        text: countries[k],
        value: k,
      };
    });
  };

  handleDeleteAddress = (addressID) => {
    authAxios
      .delete(addressDeleteURL(addressID))
      .then((res) => {
        this.handleCallback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleSelectAddress = (address) => {
    this.setState({ selectedAddress: address });
  };

  handleFetchUserID = () => {
    authAxios
      .get(userIDURL)
      .then((res) => {
        console.log(res.data);
        this.setState({ userID: res.data.userID });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchCountries = () => {
    authAxios
      .get(countryListURL)
      .then((res) => {
        this.setState({ countries: this.handleFormatCountries(res.data) });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleFetchAddresses = () => {
    this.setState({ loading: true });
    const { activeItem } = this.state;
    authAxios
      .get(addressListURL(activeItem === "billingAddress" ? "B" : "S"))
      .then((res) => {
        this.setState({ addresses: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleCallback = () => {
    this.handleFetchAddresses();
    this.setState({ selectedAddress: null });
  };

  handleFetchProfile = (profileID) => {
    this.setState({ loading: true });
    authAxios
      .get(profileDetailURL(profileID))
      .then((res) => {
        this.setState({ profile: res.data, loading: false });
        this.setState({ Data: res.data, loading: false });
        console.log(res.data);
        console.log(res.data.filename);
        // const split = res.data.photo.split("/");
        // console.log(split);
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  showPhotoModal = () => {
    this.setState({
      previewVisible: true,
    });
  };
  handlePhotoCancel = () => this.setState({ previewVisible: false });

  handlePreview = (photo) => {
    this.setState({
      previewImage: photo.thumbUrl,
      previewVisible: true,
    });
  };

  handleUpload = ({ fileList }) => {
    this.setState({ fileList });
    console.log("fileList", fileList);
  };

  // handleUploadSubmit = (event) => {
  //   const { profile } = this.state;
  //   event.preventDefault();

  //   let formData = new FormData();
  //   // add one or more of your files in FormData
  //   // again, the original file is located at the `originFileObj` key
  //   formData.append(
  //     "photo",
  //     this.state.fileList[0].originFileObj,
  //     this.state.fileList[0].originFileObj.name
  //   );
  //   console.log(this.state.fileList[0].originFileObj.name);
  //   authAxios
  //     .put(profileUpdateURL(profile.id), formData)
  //     .then((res) => {
  //       console.log("res", res);
  //       message.success("Your profile image is successfully updated");
  //       this.handleFetchProfile();
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       message.error("An error occurred while uploading");
  //     });
  // };

  handleChange = (e) => {
    const { Data } = this.state;
    const updatedFormdata = {
      ...Data,
      [e.target.name]: e.target.value,
    };
    this.setState({
      Data: updatedFormdata,
    });
  };

  handlePhotoChange = (e) => {
    const { Data } = this.state;
    const updatedFormdata = {
      ...Data,
      [e.target.name]: e.target.fileList[0],
    };
    this.setState({
      Data: updatedFormdata,
    });
  };

  handleUpdateProfile = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { Data } = this.state;
    // console.log(Data);
    // console.log(Data.photo);
    // console.log(JSON.stringify(Data.photo));
    // console.log(Data.filename);
    // console.log(this.state.fileList[0]);
    // console.log(this.state.fileList[0].name);
    const formData = new FormData();
    // const Imageconfig = {
    //   headers: { "content-type": "multipart/form-data" },
    // };
    // const config = {
    //   headers: { "content-type": "text/plain" },
    // };
    {
      this.state.fileList[0]
        ? formData.append(
            "photo",
            this.state.fileList[0],
            this.state.fileList[0].name
          )
        : formData.append("photo", logo);
    }
    // formData.append(
    //   "photo",
    //   this.state.fileList[0],
    //   this.state.fileList[0].name
    // );
    // console.log(this.state.files[0].name);
    formData.set("surname", Data.surname);
    formData.set("first_name", Data.first_name);
    formData.set("last_name", Data.last_name);
    formData.set("phone_number", Data.phone_number);

    authAxios
      .put(profileUpdateURL(Data.id), formData)
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          visible: false,
        });
        message.success("Your profile is successfully updated");
        console.log(res.data);
        this.handleCancel();
        this.handleFetchProfile();
      })
      .catch((err) => {
        this.setState({ error: err });
        message.error("There is an error");
        message.error("Image field is required");
      });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  renderAddresses = () => {
    const {
      activeItem,
      addresses,
      countries,
      selectedAddress,
      userID,
    } = this.state;
    return (
      <React.Fragment>
        <Card.Group>
          {addresses.map((a) => {
            return (
              <Card key={a.id}>
                <Card.Content>
                  {a.default && (
                    <Label as="a" color="blue" ribbon="right">
                      Default
                    </Label>
                  )}
                  <Card.Header>
                    {a.street_address}, {a.apartment_address}
                  </Card.Header>
                  <Card.Meta>{a.country}</Card.Meta>
                  <Card.Description>{a.zip}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    color="yellow"
                    onClick={() => this.handleSelectAddress(a)}
                  >
                    Update
                  </Button>
                  <Button
                    color="red"
                    onClick={() => this.handleDeleteAddress(a.id)}
                  >
                    Delete
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
        {addresses.length > 0 ? <Divider /> : null}
        {selectedAddress === null ? (
          <AddressForm
            activeItem={activeItem}
            countries={countries}
            formType={CREATE_FORM}
            userID={userID}
            callback={this.handleCallback}
          />
        ) : null}
        {selectedAddress && (
          <AddressForm
            activeItem={activeItem}
            userID={userID}
            countries={countries}
            address={selectedAddress}
            formType={UPDATE_FORM}
            callback={this.handleCallback}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      activeItem,
      error,
      loading,
      profile,
      previewVisible,
      previewImage,
      fileList,
      Data,
      success,
      visible,
    } = this.state;
    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div style={{ paddingBottom: 50 }}>
        <Container>
          {error && (
            <Message
              error
              header="There was an error"
              content={JSON.stringify(error)}
            />
          )}
          {loading && (
            <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
              <Image src="/images/wireframe/short-paragraph.png" />
            </Segment>
          )}
          <AntRow
            justify="start"
            align="middle"
            style={{ backgroundColor: "white" }}
          >
            <AntCol
              style={{ paddingBottom: 10 }}
              xs={24}
              sm={14}
              md={14}
              lg={8}
              xl={8}
            >
              <Avatar
                size={250}
                src={profile.photo}
                onClick={this.showPhotoModal}
              />
              <Modal
                visible={this.state.previewVisible}
                footer={null}
                onCancel={this.handlePhotoCancel}
              >
                <img alt="" style={{ width: "100%" }} src={profile.photo} />
              </Modal>
            </AntCol>
            <AntCol xs={24} sm={6} md={6} lg={6} xl={6}>
              <Label size="large">
                <Icon name="user" />
                {_.capitalize(profile.user)}
              </Label>
              <Label size="large">
                <Icon name="phone" />
                {profile.phone_number}
              </Label>
              <Label size="large">
                <Icon name="mail" />
                {profile.email}
              </Label>
              <AntButton type="primary" onClick={this.showModal}>
                Update profile
              </AntButton>
              <Modal
                visible={visible}
                title="Title"
                onOk={this.handleUpdateProfile}
                onCancel={this.handleCancel}
                footer={[
                  <AntButton key="back" onClick={this.handleCancel}>
                    Return
                  </AntButton>,
                  <AntButton
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={this.handleUpdateProfile}
                  >
                    Submit
                  </AntButton>,
                ]}
              >
                <Form success={success} onSubmit={this.handleUpdateProfile}>
                  <Form.Input
                    name="surname"
                    placeholder="Surname"
                    onChange={this.handleChange}
                    value={Data.surname}
                  />
                  <Form.Input
                    name="first_name"
                    placeholder="First name"
                    onChange={this.handleChange}
                    value={Data.first_name}
                  />
                  <Form.Input
                    name="last_name"
                    placeholder="Last name"
                    onChange={this.handleChange}
                    value={Data.last_name}
                  />
                  <Form.Input
                    name="phone_number"
                    placeholder="Phone number"
                    onChange={this.handleChange}
                    value={Data.phone_number}
                  />
                  {/* <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleUpload}
                    beforeUpload={() => false}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <AntButton onClick={this.handleUploadSubmit}>
                    Submit
                  </AntButton>
                  <Modal
                    closable
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handlePhotoCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: "100%" }}
                      src={previewImage}
                    />
                  </Modal> */}
                  <Upload
                    name="photo"
                    multiple={false}
                    // showUploadList={showDownloadIcon:false}
                    onRemove={(photo) => {
                      this.setState((state) => {
                        return { fileList: [] };
                      });
                    }}
                    beforeUpload={(photo) => {
                      this.setState((state) => ({
                        fileList: [photo],
                      }));
                      return false;
                    }}
                    style={{ width: "100%" }}
                  >
                    <Avatar src={profile.photo} alt="Profile picture" />
                    <AntButton>
                      <UploadOutlined />
                      {this.state.fileList &&
                      this.state.fileList[0] &&
                      this.state.fileList[0].name
                        ? this.state.fileList[0].name
                        : "Click to upload"}
                    </AntButton>
                  </Upload>
                </Form>
              </Modal>
            </AntCol>
            <AntCol xs={22} sm={22} md={22} lg={8} xl={8} style={{ margin: 5 }}>
              <Descriptions bordered size="small">
                <Descriptions.Item label="Surname" span={3}>
                  {profile.surname}
                </Descriptions.Item>
                <Descriptions.Item label="First Name" span={3}>
                  {profile.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name" span={3}>
                  {profile.last_name}
                </Descriptions.Item>
              </Descriptions>
            </AntCol>
          </AntRow>
        </Container>
        <Grid container columns={2} divided>
          <Grid.Row columns={1}></Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Menu pointing vertical fluid>
                <Menu.Item
                  name="Billing Address"
                  active={activeItem === "billingAddress"}
                  onClick={() => this.handleItemClick("billingAddress")}
                />
                <Menu.Item
                  name="Shipping Address"
                  active={activeItem === "shippingAddress"}
                  onClick={() => this.handleItemClick("shippingAddress")}
                />
                <Menu.Item
                  name="Payment history"
                  active={activeItem === "paymentHistory"}
                  onClick={() => this.handleItemClick("paymentHistory")}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header>{this.handleGetActiveItem()}</Header>
              <Divider />
              {activeItem === "paymentHistory" ? (
                <PaymentHistory />
              ) : (
                this.renderAddresses()
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    profile: state.profile,
    // loading: state.profile.loading,
  };
};

// const mapStateToProps = (state) => {
//   return {
//     authenticated: state.auth.token !== null,
//     cart: state.cart.shoppingCart,
//     loading: state.cart.loading,
//   };
// };

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProfile: () => dispatch(fetchProfile()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
