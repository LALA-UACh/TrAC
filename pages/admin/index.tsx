import { NextPage } from "next";
import { Grid } from "semantic-ui-react";

import AdminProvider, { AdminContext } from "@Components/Admin/Context";
import Menu from "@Components/Admin/Menu";
import Programs from "@Components/Admin/Programs";
import Users from "@Components/Admin/Users";
import Auth from "@Context/Auth";

const Admin: NextPage = () => {
  return (
    <Auth admin>
      <AdminProvider>
        <Grid centered>
          <Grid.Row>
            <Menu />
          </Grid.Row>

          <Grid.Row>
            <AdminContext.Consumer>
              {({ active }) => {
                switch (active) {
                  case "users":
                    return <Users />;
                  case "programs":
                    return <Programs />;
                  default:
                    return null;
                }
              }}
            </AdminContext.Consumer>
          </Grid.Row>
        </Grid>
      </AdminProvider>
    </Auth>
  );
};

export default Admin;
