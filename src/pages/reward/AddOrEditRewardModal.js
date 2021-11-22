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
import { actionAddReward, actionEditReward } from "./RewardAction";
import { getCenterList } from "../center/CenterAction";
import Select, { components } from "react-select";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
function AddOrEditRewardModal(props) {
  const { visible, onCancel, item = {} } = props;
  const [picker, setPicker] = useState(new Date());
  const isAddNew = isEmpty(item);
  const [object, setObject] = useState({
    title: "",
    content: "",
    category: 1,
    state: 1,
  });
  const [centerData, setCenterData] = useState([]);

  useEffect(() => {
    if (item && item.id) {
      setObject(item);
    }
  }, [item]);

  const handleFetchCenterData = async () => {
    try {
      const { data } = await getCenterList();
      setCenterData(data?.results || []);
    } catch (error) {}
  };

  useEffect(() => {
    handleFetchCenterData();
  }, [item]);

  const hanldChange = (e) => {
    const { name, value } = e.target;
    setObject({ ...object, [name]: value });
  };
  console.log("object", object);
  const onSummit = async () => {
    if (isAddNew) {
      await actionAddReward(object);
      toastSuccess("Thêm mới ưu đãi thành công");
    } else {
      await actionEditReward(object, item?.id);
      toastSuccess("Cập nhật ưu đãi thành công");
    }
    onCancel(true);
  };
  const renderCategory = () => {
    if (object.time === "Bảo lưu") {
      return 2;
    }
    if (object.time === "Hộ trợ học tập") {
      return 3;
    }
    if (object.time === "Rút quyền lợi") {
      return 4;
    }
    if (object.time === "Khiếu nại") {
      return 5;
    }
    if (object.time === "Khác") {
      return 6;
    }
    return 1;
  };

  const renderState = () => {
    if (object.time === "Đang xử lý") {
      return 2;
    }
    if (object.time === "Hoàn thành") {
      return 3;
    }
    if (object.time === "Hủy") {
      return 4;
    }

    return 1;
  };
  console.log("picker", picker);
  return (
    <div>
      <Modal isOpen={visible} toggle={() => onCancel(true)}>
        <ModalHeader toggle={() => onCancel(true)}>
          {!isAddNew ? "Cập nhật" : "Thêm mới"} ưu đãi
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameVertical">Tiêu đề</Label>
                  <Input
                    type="text"
                    name="title"
                    value={object?.title}
                    onChange={hanldChange}
                    placeholder="Tiêu đề"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="select-basic">Loại ưu đãi</Label>
                  <Input
                    type="select"
                    value={renderCategory()}
                    name="type"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Giảm giá</option>
                    <option value="2">Quà tặng</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="EmailVertical">Số lượng</Label>
                  <Input
                    type="number"
                    name="content"
                    value={object?.content}
                    onChange={hanldChange}
                    placeholder="Số lượng"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="EmailVertical">Quà tặng</Label>
                  <Input
                    type="text"
                    name="content"
                    value={object?.content}
                    onChange={hanldChange}
                    placeholder="Quà tặng"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="EmailVertical">Giảm giá(%)</Label>
                  <Input
                    type="number"
                    name="content"
                    value={object?.content}
                    onChange={hanldChange}
                    placeholder="Giảm giá(%)"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="range-picker">Thời gian</Label>
                  <Flatpickr
                    value={picker}
                    id="range-picker"
                    className="form-control"
                    onChange={(date) => setPicker(date)}
                    options={{
                      mode: "range",
                      defaultDate: ["2020-02-01", "2020-02-15"],
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="nameVertical">Ghi chú</Label>
                  <Input
                    type="textarea"
                    name="note"
                    value={object?.note}
                    onChange={hanldChange}
                    placeholder="Ghi chú"
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <Label for="nameVertical">Trung tâm</Label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  isMulti
                  name="colors"
                  options={centerData}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Chọn trung tâm"
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
                    Hủy
                  </Button.Ripple>
                  <Button.Ripple color="primary" onClick={onSummit}>
                    Lưu
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

export default AddOrEditRewardModal;