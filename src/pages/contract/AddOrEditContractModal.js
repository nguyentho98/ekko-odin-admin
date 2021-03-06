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
import { actionAddContract, actionEditContract } from "./ContractAction";
import { getCenterList } from "../center/CenterAction";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { getRewardList } from "../reward/RewardAction";
import { getUserList } from "../users/UsersAction";
import moment from "moment";
import { getPaymentList } from "../payment/PaymentAction";
import { getCourseList } from "../course/CourseAction";
import { getClassesList } from "../classes/ClassesAction";
function AddOrEditContractModal(props) {
  const { visible, onCancel, item = {} } = props;
  const [contract_date, setContract_date] = useState(new Date());
  const [plan_date, setPlan_date] = useState(new Date());
  const isAddNew = isEmpty(item);
  const [object, setObject] = useState({
    title: "",
  });
  const [classesData, setClassesData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [centerData, setCenterData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [course, setCourse] = useState([]);
  const [payment, setPayment] = useState(item?.payment || {});
  const [center, setCenter] = useState(item?.center || {});
  const [customer, setCustomers] = useState(item?.customers || {});
  const [saler, setSaler] = useState(item?.saler || {});
  const [consultant, setConsultant] = useState(item?.consultant || {});
  useEffect(() => {
    if (item && item.id) {
      setObject(item);
    }
  }, [item]);

  useEffect(() => {
    handleFetchUsersData();
    handleFetchCenterData();
    handleFetchPaymentData();
    handleFetchClassesData();
    handleFetchCourseData();
  }, [item]);

  const onChangeMulCourse = (value) => {
    let tmp = null;
    if (value && value.length > 0) {
     tmp = value.map((item) => item.id);
    }
    setCourse(tmp);
  }

  const onChangeMulClasses = (value) => {
    let tmp = null;
    if (value && value.length > 0) {
     tmp = value.map((item) => item.id);
    }
    setClasses(tmp);
  }
  const handleFetchCourseData = async () => {
    try {
      const { data } = await getCourseList();
      setCourseData(data?.results || []);
    } catch (error) {}
  };


  const handleFetchCenterData = async () => {
    try {
      const { data } = await getCenterList();
      setCenterData(data?.results || []);
    } catch (error) {}
  };

  const handleFetchClassesData = async () => {
    try {
      const { data } = await getClassesList();
      setClassesData(data?.results || []);
    } catch (error) {}
  };

  const handleFetchPaymentData = async () => {
    try {
      const { data } = await getPaymentList();
      setPaymentData(data?.results || []);
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
  console.log("object", object);
  const onSummit = async () => {
    const data = {
      ...object,
      payer: payer?.id,
      reward: reward?.id,
      cashier: cashier?.id,
      contract_date: moment(new Date(contract_date)).format("YYYY-MM-DD"),
      plan_date: moment(new Date(plan_date)).format("YYYY-MM-DD"),
    };
    if (isAddNew) {
      await actionAddContract(data);
      toastSuccess("Th??m m???i h???p ?????ng th??nh c??ng");
    } else {
      await actionEditContract(object, item?.id);
      toastSuccess("C???p nh???t h???p ?????ng th??nh c??ng");
    }
    onCancel(true);
  };
  return (
    <div>
      <Modal size="lg" isOpen={visible} toggle={() => onCancel(true)}>
        <ModalHeader toggle={() => onCancel(true)}>
          {!isAddNew ? "C???p nh???t" : "Th??m m???i"} h???p ?????ng
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">N???i dung</Label>
                  <Input
                    type="text"
                    name="title"
                    value={object?.title}
                    onChange={hanldChange}
                    placeholder="N???i dung"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">S??? l???n ????ng ti???n</Label>
                  <Input
                    type="number"
                    name="times"
                    value={object?.times}
                    onChange={hanldChange}
                    placeholder="S??? l???n ????ng ti???n"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="select-basic">T??nh tr???ng h???p ?????ng</Label>
                  <Input
                    type="select"
                    value={object.state}
                    name="state"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Cam k???t</option>
                    <option value="2">M???t cam k???t</option>
                    <option value="3">C???nh c??o</option>
                    <option value="4">Thanh l?? h???p ?????ng</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">Kh??ch h??ng</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={usersData}
                    getOptionLabel={(option) => option.full_name}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n kh??ch h??ng"
                    value={customer}
                    onChange={(item) => setCustomers(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">Trung t??m</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={centerData}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n trung t??m"
                    value={center}
                    onChange={(item) => setCenter(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">H??a ????n</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={paymentData}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n h??a ????n"
                    value={payment}
                    onChange={(item) => setPayment(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <Label for="nameVertical">T?? v???n vi??n</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  name="colors"
                  options={usersData}
                  getOptionLabel={(option) => option.full_name}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Ch???n t?? v???n vi??n"
                  value={consultant}
                  onChange={(item) => setConsultant(item)}
                />
              </Col>
              <Col sm="12">
                <Label for="nameVertical">L???p h???c</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  name="colors"
                  options={classesData}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  placeholder="Ch???n l???p h???c"
                  value={classes}
                  onChange={(item) => onChangeMulClasses(item)}
                />
              </Col>
              <Col sm="12">
                <Label for="nameVertical">Kh??a h???c</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  name="colors"
                  options={courseData}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  isMulti
                  classNamePrefix="select"
                  placeholder="Ch???n kh??a h???c"
                  value={course}
                  onChange={(item) => onChangeMulCourse(item)}
                />
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

export default AddOrEditContractModal;
