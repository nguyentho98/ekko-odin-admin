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
import { toastSuccess } from "../../utility/common/toastify";
import { isEmpty } from "../../utility/Utils";
import { actionAddComment, actionEditComment } from "./CommentAction";
import { selectThemeColors } from "@utils";
import { getCenterList } from "../center/CenterAction";
import Select from "react-select";
import { getUserList } from "../users/UsersAction";
import { getClassRoomList } from "../classRoom/ClassRoomAction";
import { getClassesList } from "../classes/ClassesAction";
function AddOrEditCommentModal(props) {
  const { visible, onCancel, item = {} } = props;

  const isAddNew = isEmpty(item);
  const [object, setObject] = useState({
    title: "",
    content: "",
    category: 1,
    state: 1
  });
  const [centerData, setCenterData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (item && item.id) {
      setObject(item);
    }
  }, [item]);
  useEffect(() => {
    handleFetchCenterData();
    handleFetchClassesData();
    handleFetchUserData();
  }, [item]);
  const handleFetchClassesData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getClassesList(rqParams);
      setClassesData(data?.results || []);
    } catch (error) {}
  };
  const handleFetchCenterData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCenterList(rqParams);
      setCenterData(data?.results || []);
    } catch (error) {}
  };
  const handleFetchUserData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getUserList(rqParams);
      setUserData(data?.results || []);
    } catch (error) {}
  };
  const hanldChange = (e) => {
    const { name, value } = e.target;
    setObject({ ...object, [name]: value });
  };
  console.log("object", object);
  const onSummit = async () => {
    if (isAddNew) {
      await actionAddComment(object);
      toastSuccess("Th??m m???i b??nh lu???n th??nh c??ng");
    } else {
      await actionEditComment(object, item?.id);
      toastSuccess("C???p nh???t b??nh lu???n th??nh c??ng");
    }
    onCancel(true);
  };
  const renderCategory = () => {
    if (object.time === "B???o l??u") {
      return 2;
    }
    if (object.time === "H??? tr??? h???c t???p") {
      return 3;
    }
    if (object.time === "R??t quy???n l???i") {
      return 4;
    }
    if (object.time === "Khi???u n???i") {
      return 5;
    }
    if (object.time === "Kh??c") {
      return 6;
    }
    return 1;
  };

  const renderState = () => {
    if (object.time === "??ang x??? l??") {
      return 2;
    }
    if (object.time === "Ho??n th??nh") {
      return 3;
    }
    if (object.time === "H???y") {
      return 4;
    }

    return 1;
  };
  return (
    <div>
      <Modal isOpen={visible} toggle={() => onCancel(true)}>
        <ModalHeader toggle={() => onCancel(true)}>
          {!isAddNew ? "C???p nh???t" : "Th??m m???i"} b??nh lu???n
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameVertical">Ti??u ?????</Label>
                  <Input
                    type="text"
                    name="title"
                    value={object?.title}
                    onChange={hanldChange}
                    placeholder="Ti??u ?????"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="EmailVertical">N???i dung</Label>
                  <Input
                    type="textarea"
                    name="content"
                    value={object?.content}
                    onChange={hanldChange}
                    placeholder="N???i dung"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="select-basic">Ph??n lo???i</Label>
                  <Input
                    type="select"
                    value={renderCategory()}
                    name="category"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">B???o h??nh</option>
                    <option value="2">B???o l??u</option>
                    <option value="3">H??? tr??? h???c t???p </option>
                    <option value="4">Khi???u n???i</option>
                    <option value="5">R??t quy???n l???i</option>
                    <option value="6">Kh??c</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="select-basic">Ph??n lo???i</Label>
                  <Input
                    type="select"
                    value={renderState()}
                    name="state"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Ch??? x??? l?? </option>
                    <option value="2">??ang x??? l??</option>
                    <option value="3">Ho??n th??nh </option>
                    <option value="4">H???y</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>Ng?????i d??ng</Label>
                  <Input
                    type="select"
                    name="users"
                    id="select-basic"
                    onChange={hanldChange}
                    value={object?.users}
                  >
                    <option value={0}>Ch???n ng?????i d??ng</option>
                    {userData.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.username}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>Trung t??m</Label>
                  <Input
                    type="select"
                    name="centre"
                    id="select-basic"
                    onChange={hanldChange}
                    value={object?.center}
                  >
                    <option value={0}>Ch???n trung t??m</option>
                    {centerData.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>L???p h???c</Label>
                  <Input
                    type="select"
                    name="classes"
                    id="select-basic"
                    onChange={hanldChange}
                    value={object?.classes}
                  >
                    <option value={0}>Ch???n l???p h???c</option>
                    {classesData.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup className="d-flex mb-0 justify-content-end">
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

export default AddOrEditCommentModal;
