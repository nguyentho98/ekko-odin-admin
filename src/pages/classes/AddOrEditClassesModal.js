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
import {
  actionAddClasses,
  actionEditClasses,
  getClassesList,
} from "./ClassesAction";
import { selectThemeColors } from "@utils";
import { getCenterList } from "../center/CenterAction";
import Select from "react-select";
import { getCourseList } from "../course/CourseAction";
import { getTeachersList } from "../teachers/TeachersAction";
import { getClassRoomList } from "../classRoom/ClassRoomAction";
import Flatpickr from "react-flatpickr";

import "@styles/react/libs/flatpickr/flatpickr.scss";
import moment from "moment";
import { getStudentList } from "../student/StudentAction";
function AddOrEditClassesModal(props) {
  const { visible, onCancel, item = {} } = props;
  const isAddNew = isEmpty(item);
  const [centerData, setCenterData] = useState([]);
  const [center, setCenter] = useState(item?.center);
  const [courseData, setCourseData] = useState([]);
  const [course, setCourse] = useState(item?.course);
  const [classRoomData, setClassRoomData] = useState([]);
  const [classRoom, setClassRoom] = useState(item?.classroom);
  const [studentData, setStudentData] = useState([]);
  const [student, setStudent] = useState(item?.students || []);
  const [teacherData, setTeacherData] = useState([]);
  const [teacher, setTeacher] = useState(item?.teachers || []);
  const [object, setObject] = useState({
    name: "",
    status_classes: "1",
    available: "",
    capacity: "",
    start_date: null,
    schedule: "1",
    time: "1",
    center: 0,
    course: 0,
    classroom: 0,
  });
  const [picker, setPicker] = useState(new Date());
  useEffect(() => {
    if (item && item.id) {
      setObject(item);
    }
  }, [item]);
  useEffect(async () => {
    await handleFetchCenterData();
    await handleFetchCourseData();
    await handleFetchClassRoomData();
    await handleFetchStudentData();
    await handleFetchTeacherData();
  }, [item]);

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

  const handleFetchCourseData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getCourseList(rqParams);
      setCourseData(data?.results || []);
    } catch (error) {}
  };

  const handleFetchClassRoomData = async (field, value) => {
    try {
      let rqParams = { page: 0, size: 50, query: "" };
      if (field && value) {
        rqParams.query = isNaN(value)
          ? `${field}=="*${value}*"`
          : `${field}==${value}`;
      }

      const { data } = await getClassRoomList(rqParams);
      setClassRoomData(data?.results || []);
    } catch (error) {}
  };
  const onChangePicker = (date) => {
    setPicker(date);
  };
  const hanldChange = (e) => {
    const { name, value } = e.target;
    setObject({ ...object, [name]: value });
  };
  const onSummit = async () => {
    const idTeachers = teacher.length > 0 ? teacher.map((item) => item.id) : [];
    const idStudents = student.length > 0 ? student.map((item) => item.id) : [];
    const data = {
      ...object,
      students: idStudents,
      teachers: idTeachers,
      center: center?.id,
      course: course?.id,
      classroom: classRoom?.id,
      start_date: moment(new Date(picker)).format("YYYY-MM-DD[T]HH:mm:ss"),
    };
    if (isAddNew) {
      await actionAddClasses(data);
      toastSuccess("Th??m m???i l???p h???c th??nh c??ng");
    } else {
      await actionEditClasses(data, item?.id);
      toastSuccess("C???p nh???t l???p h???c th??nh c??ng");
    }
    onCancel(true);
  };

  const onChangeStudent = (item) => {
    setStudent(item);
  };
  const handleFetchStudentData = async () => {
    try {
      const { data } = await getStudentList();
      setStudentData(data?.results || []);
    } catch (error) {}
  };
  const onChangeTeacher = (item) => {
    setTeacher(item);
  };
  const handleFetchTeacherData = async () => {
    try {
      const { data } = await getTeachersList();
      setTeacherData(data?.results || []);
    } catch (error) {}
  };

  const renderSchedule = () => {
    if (object.schedule === "Th??? 3-6") {
      return 2;
    }
    if (object.schedule === "Th??? 4-5") {
      return 3;
    }
    return 1;
  };
  const renderTime = () => {
    if (object.time === "Ca 2 (14h-15h30)") {
      return 2;
    }
    if (object.time === "Ca 3 (18h-19h30)") {
      return 3;
    }
    if (object.time === "Ca 4 (19h30-21h)") {
      return 3;
    }
    return 1;
  };

  const renderStatusClasses = () => {
    if (object.status_classes === "??ang di???n ra") {
      return 2;
    }
    if (object.status_classes === "???? k???t th??c") {
      return 3;
    }
    return 1;
  };

  return (
    <div>
      <Modal size="lg" isOpen={visible} toggle={() => onCancel(true)}>
        <ModalHeader toggle={() => onCancel(true)}>
          {!isAddNew ? "C???p nh???t" : "Th??m m???i"} l???p h???c
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="nameVertical">T??n l???p h???c</Label>
                  <Input
                    type="text"
                    name="name"
                    value={object?.name}
                    onChange={hanldChange}
                    placeholder="T??n l???p h???c"
                  />
                </FormGroup>
              </Col>
              {/* <Col sm="6">
                <FormGroup>
                  <Label for="EmailVertical">Tr???ng th??i l???p h???c</Label>
                  <Input
                    type="select"
                    name="status_classes"
                    value={object.status_classes}
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Comming Soon</option>
                    <option value="2">??ang di???n ra</option>
                    <option value="3">???? k???t th??c</option>
                  </Input>
                </FormGroup>
              </Col> */}
              <Col sm="6">
                <FormGroup>
                  <Label for="EmailVertical">S??? bu???i h???c</Label>
                  <Input
                    type="number"
                    name="available"
                    value={object?.available}
                    onChange={hanldChange}
                    placeholder="S??? bu???i h???c"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="EmailVertical">S??? h???c vi??n</Label>
                  <Input
                    type="number"
                    name="capacity"
                    value={object?.capacity}
                    onChange={hanldChange}
                    placeholder="S??? h???c vi??n"
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="default-picker">Th???i gian b???t ?????u</Label>
                  <Flatpickr
                    className="form-control"
                    value={picker}
                    onChange={(date) => onChangePicker(date)}
                    id="default-picker"
                    options={{
                      dateFormat: "Y-m-d h:m:i",
                    }}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="select-basic">L???ch h???c</Label>
                  <Input
                    type="select"
                    value={object.schedule}
                    name="schedule"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Th??? 2-5</option>
                    <option value="2">Th??? 3-6</option>
                    <option value="3">Th??? 4-7</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="select-basic">Th???i gian</Label>
                  <Input
                    type="select"
                    value={object.time}
                    name="time"
                    id="select-basic"
                    onChange={hanldChange}
                  >
                    <option value="1">Ca 1 (9h-10h30)</option>
                    <option value="2">Ca 2 (14h-15h30)</option>
                    <option value="3">Ca 3 (18h-19h30)</option>
                    <option value="4">Ca 4 (19h30-21h)</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label>Trung t??m</Label>
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
              <Col sm="12">
                <FormGroup>
                  <Label>Kh??a h???c</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={courseData}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n kh??a h???c"
                    value={course}
                    onChange={(item) => setCourse(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>L???p h???c</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={classRoomData}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n l???p h???c"
                    value={classRoom}
                    onChange={(item) => setClassRoom(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>H???c vi??n</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={studentData}
                    getOptionLabel={(option) => option.username}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n h???c vi??n"
                    value={student}
                    isMulti
                    onChange={(item) => onChangeStudent(item)}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label>Gi??o vi??n</Label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    name="colors"
                    options={teacherData}
                    getOptionLabel={(option) => option.username}
                    getOptionValue={(option) => option.id}
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Ch???n gi??o vi??n"
                    value={teacher}
                    isMulti
                    onChange={(item) => onChangeTeacher(item)}
                  />
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

export default AddOrEditClassesModal;
