import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import MentorRequestList from './mentor-request/MentorRequest'
import MentorRequestDetail from './mentor-request/MentorRequestDetail';
import MentorList from "./mentor-list/MentorList";
import MentorDetail from './mentor-list/MentorDetail'
import CommunityNotice from "../community/CommunityNotice";
import MentorSettlement from "./mentor-settlement/MentorSettlement";
import MentorSettlementList from "./mentor-settlement/MentorSettlementList";

const AdminRoutes = () => {
  return (
      <AdminLayout>
        <Switch>
          <Route exact path="/admin/mentor-request" component={MentorRequestList} />
          <Route exact path="/admin/mentor-request/:mentorId" component={MentorRequestDetail} />
          <Route exact path="/admin/mentor-list" component={MentorList} />
          <Route exact path="/admin/mentor-list/:mentorId" component={MentorDetail} />
          <Route exact path="/admin/notice" component={CommunityNotice} />
          <Route exact path="/admin/settlement" component={MentorSettlement} />
          <Route exact path="/admin/settlement/:mentorId" component={MentorSettlementList} />
          <Redirect to="/admin/mentor-request" />
        </Switch>
      </AdminLayout>
  );
};

export default AdminRoutes;
