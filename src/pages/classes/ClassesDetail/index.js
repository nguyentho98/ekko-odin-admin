import React, { useState, useEffect } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import "./styles.scss";
import PointList from "./PointList/PointList";
import { useParams, useHistory } from "react-router-dom";
import { actionDetailClasses } from "../ClassesAction";
import ClassesDetail from "./Detail/ClassesDetail";
import Summary from "./Summary/Summary";
import { ChevronLeft } from "react-feather";
function Classes(props) {
  const { id } = useParams();
  let history = useHistory();
  const [classesDetail, setClassesDetail] = useState({});
  useEffect(() => {
    if (id) {
      actionDetailClasses(id).then((res) => {
        setClassesDetail(res.data);
      });
    }
  }, []);

  const [active, setActive] = useState("1");

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  const onGoBack = () => {
    history.goBack();
  };
  return (
    <React.Fragment>
      <div
        className="d-flex align-items-center mb-1 go-back"
        style={{ cursor: "pointer" }}
        onClick={onGoBack}
      >
        <ChevronLeft /> Quay lại
      </div>
      <Breadcrumbs breadCrumbTitle="Chi tiết phòng học" />
      <div className="classes-wrapper">
        <Nav tabs>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
              }}
            >
              Chi tiết
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              Điểm danh
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "3"}
              onClick={() => {
                toggle("3");
              }}
            >
              Tổng kết
            </NavLink>
          </NavItem>
        </Nav>
        <Card className="class-wrapper-content">
          <TabContent className="py-50" activeTab={active}>
            <TabPane tabId="1">
              <ClassesDetail classesDetail={classesDetail} />
            </TabPane>
            <TabPane tabId="2">
              <PointList classesDetail={classesDetail}/>
            </TabPane>
            <TabPane tabId="3">
              <Summary></Summary>
            </TabPane>
          </TabContent>
        </Card>
      </div>
    </React.Fragment>
  );
}

export default Classes;
