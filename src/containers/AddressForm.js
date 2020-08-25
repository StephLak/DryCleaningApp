import React, { Component } from "react";
import { Form, Message, Select } from "semantic-ui-react";
import { addressCreateURL, addressUpdateURL } from "../constants";
import { authAxios } from "../utils";

const UPDATE_FORM = "UPDATE_FORM";

class AddressForm extends Component {
  state = {
    error: null,
    loading: false,
    formData: {
      address_type: "",
      apartment_address: "",
      country: "",
      default: false,
      id: "",
      street_address: "",
      user: 1,
      zip: "",
    },
    saving: false,
    success: false,
  };

  componentDidMount() {
    const { address, formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.setState({ formData: address });
    }
  }

  handleToggleDefault = () => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      default: !formData.default,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleChange = (e) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSelectChange = (e, { name, value }) => {
    const { formData } = this.state;
    const updatedFormdata = {
      ...formData,
      [name]: value,
    };
    this.setState({
      formData: updatedFormdata,
    });
  };

  handleSubmit = (e) => {
    this.setState({ saving: true });
    e.preventDefault();
    const { formType } = this.props;
    if (formType === UPDATE_FORM) {
      this.handleUpdateAddress();
    } else {
      this.handleCreateAddress();
    }
  };

  handleCreateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .post(addressCreateURL, {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false },
        });
        console.log(res.data);
        this.props.callback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleUpdateAddress = () => {
    const { userID, activeItem } = this.props;
    const { formData } = this.state;
    authAxios
      .put(addressUpdateURL(formData.id), {
        ...formData,
        user: userID,
        address_type: activeItem === "billingAddress" ? "B" : "S",
      })
      .then((res) => {
        this.setState({
          saving: false,
          success: true,
          formData: { default: false },
        });
        console.log(res.data);
        this.props.callback();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  render() {
    const { countries } = this.props;
    const { error, formData, success, saving } = this.state;
    return (
      <Form onSubmit={this.handleSubmit} success={success} error={error}>
        <Form.Input
          required
          name="street_address"
          placeholder="Street address"
          onChange={this.handleChange}
          value={formData.street_address}
        />
        <Form.Input
          required
          name="apartment_address"
          placeholder="Apartment address"
          onChange={this.handleChange}
          value={formData.apartment_address}
        />
        <Form.Field required>
          <Select
            loading={countries.length < 1}
            fluid
            clearable
            search
            options={countries}
            name="country"
            placeholder="Country"
            onChange={this.handleSelectChange}
            value={formData.country}
          />
        </Form.Field>
        <Form.Input
          required
          name="zip"
          placeholder="Zip code"
          onChange={this.handleChange}
          value={formData.zip}
        />
        <Form.Checkbox
          name="default"
          label="Make this the default address?"
          onChange={this.handleToggleDefault}
          checked={formData.default}
        />
        {success && (
          <Message success header="Success!" content="Your address was saved" />
        )}
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        <Form.Button disabled={saving} loading={saving} primary>
          Save
        </Form.Button>
      </Form>
    );
  }
}

export default AddressForm;
