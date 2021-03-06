import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  CustomInput,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { selectThemeColors } from "@utils";
import { toastSuccess } from "../../utility/common/toastify";
import { isEmpty } from "../../utility/Utils";
import { actionAddPayment, actionEditPayment } from "./PaymentAction";
import { getCenterList } from "../center/CenterAction";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { getRewardList } from "../reward/RewardAction";
import { getUserList } from "../users/UsersAction";
import moment from "moment";
function AddOrEditPaymentModal(props) {
  const { visible, onCancel, item = {} } = props;
  const [payment_date, setPayment_date] = useState(new Date());
  const [plan_date, setPlan_date] = useState(new Date());
  const isAddNew = isEmpty(item);
  const [object, setObject] = useState({
    title: "",
  });
  const [rewardData, setRewardData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [reward, setReward] = useState(item?.reward);
  const [payer, setPayer] = useState(item?.payer);
  const [cashier, setCashier] = useState(item?.cashier);
  useEffect(() => {
    if (item && item.id) {
      setObject(item);
    }
  }, [item]);


  useEffect(() => {
    handleFetchRewardData();
    handleFetchUsersData();
  }, [item]);

  const handleFetchRewardData = async () => {
    try {
      const { data } = await getRewardList();
      setRewardData(data?.results || []);
    } catch (error) {}
  };

  const handleFetchUsersData = async () => {
    try {
      const { data } = await getUserList();
      setUsersData(data?.results || []);
    } catch (error) {}
  };

  const hanldChange = (e) => {
    const { name, value } = e.target;
    setObject({ ...object, [name]: value });
  };
  const onSummit = async () => {
    const data = {
        ...object,
        payer: payer?.id,
        reward: reward?.id,
        cashier: cashier?.id,
        payment_date: moment(new Date(payment_date)).format("YYYY-MM-DD"),
        plan_date: moment(new Date(plan_date)).format("YYYY-MM-DD"),
      }
    if (isAddNew) {
      await actionAddPayment(data);
      toastSuccess("Th??m m???i h??a ????n th??nh c??ng");
    } else {
      await actionEditPayment(data, item?.id);
      toastSuccess("C???p nh???t h??a ????n th??nh c??ng");
    }
    onCancel(true);
  };
  const renderCategory = () => {
    if (object.method === "Chuy???n ti???n") {
      return 1;
    }
    return 0;
  };

  const renderState = () => {
    if (object.state === "Ch???") {
      return 2;
    }
    if (object.state === "T??? ch???i") {
      return 3;
    }
    return 1;
  };
  return (
    <div>
      <Modal size="lg" isOpen={visible} toggle={() => onCancel(true)}>
        <ModalHeader toggle={() => onCancel(true)}>
          {!isAddNew ? "C???p nh???t" : "Th??m m???i"} h??a ????n
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
             
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">S??? ti???n ????ng</Label>
                  <Input
                    type="number"
                    name="pay_amount"
                    value={object?.pay_amount}
                    onChange={hanldChange}
                    placeholder="S??? ti???n ????ng"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">S??? c??n n???</Label>
                  <Input
                    type="number"
                    name="rest_amount"
                    value={object?.rest_amount}
                    onChange={hanldChange}
                    placeholder="S??? c??n n???"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="default-picker">Ng??y n???p</Label>
                  <Flatpickr
                    className="form-control"
                    value={payment_date}
                    onChange={(date) => setPayment_date(date)}
                    id="default-picker"
                    options={{
                      dateFormat: "Y-m-d h:m:i",
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="default-picker">Ng??y h???n n???p ho??n th??nh</Label>
                  <Flatpickr
                    className="form-control"
                    value={plan_date}
                    onChange={(date) => setPlan_date(date)}
                    id="default-picker"
                    options={{
                      dateFormat: "Y-m-d h:m:i",
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="select-basic">H??nh th???c</Label>
                  <Input
                    type="select"
                    value={object.method}
                    name="method"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Ti???n m???t</option>
                    <option value="2">Chuy???n ti???n</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">T??n ng??n h??ng</Label>
                  <Input
                    type="text"
                    name="banks"
                    value={object?.banks}
                    onChange={hanldChange}
                    placeholder="T??n ng??n h??ng"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="select-basic">Tr???ng th??i</Label>
                  <Input
                    type="select"
                    value={object.state}
                    name="state"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Ho??n th??nh</option>
                    <option value="2">Ch???</option>
                    <option value="3">T??? ch???i</option>
                  </Input>
                </FormGroup>
              </Col>
             
              <Col sm="6">
                <Label for="nameVertical">Ng?????i n???p</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  name="colors"
                  options={usersData}
                  getOptionLabel={(option) => option.username}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Ch???n ng?????i n???p"
                  value={payer}
                  onChange={(item) => setPayer(item) }
                />
              </Col>
              <Col sm="6">
                <Label for="nameVertical">Ng?????i thu</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  name="colors"
                  options={usersData}
                  getOptionLabel={(option) => option.username}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Ch???n ng?????i thu"
                  value={cashier}
                  onChange={(item) => setCashier(item) }
                />
              </Col>
           
              <Col sm="12">
                <FormGroup>
                  <Label for="nameVertical">Ghi ch??</Label>
                  <Input
                    type="textarea"
                    name="note"
                    value={object?.note}
                    onChange={hanldChange}
                    placeholder="Ghi ch??"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup className="d-flex mt-2 mb-0 justify-content-end">
                  <Button.Ripple
                    outline
                    color="secondary"
                    onClick={() => onCancel(true)}
                    type="reset"
                    className="mr-1"
                  >
                    H???y
                  </Button.Ripple>
                  <Button.Ripple color="primary" onClick={onSummit}>
                    L??u
                  </Button.Ripple>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default AddOrEditPaymentModal;
