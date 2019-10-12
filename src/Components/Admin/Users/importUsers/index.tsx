import classNames from "classnames";
import csv from "csvtojson";
import _ from "lodash";
import { FC, useContext } from "react";
import Dropzone from "react-dropzone";
import { Button, Form, Grid, Icon, Modal, TextArea } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import { isJSON } from "validator";

import { AdminContext } from "@Components/Admin/Context";

const ImportUsers: FC = () => {
  const [data, setData] = useRememberState("AdminImportUsersData", "email\n");
  const [open, setOpen] = useRememberState("AdminImportUsersOpen", false);
  const { importUsers } = useContext(AdminContext);

  const handleSubmit = () => {
    try {
      if (isJSON(data) && _.isArray(JSON.parse(data))) {
        importUsers(JSON.parse(data));
        setOpen(false);
        setData("email\n");
      } else {
        csv({
          ignoreEmpty: true,
        })
          .fromString(data)
          .then(
            json => {
              importUsers(json);
              setOpen(false);
              setData("email\n");
            },
            error => {
              console.error(error);
            }
          );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      open={open}
      trigger={
        <Button primary icon labelPosition="left">
          <Icon name="add user" />
          Upsert Usuarios
        </Button>
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Modal.Header>Upsert Usuarios</Modal.Header>
      <Modal.Content>
        <Grid centered>
          <Grid.Row>
            <Dropzone
              accept=".json,.csv"
              onDrop={(acceptedFiles, _rejectedFiles) => {
                acceptedFiles.forEach(async (file, _key) => {
                  fetch(URL.createObjectURL(file))
                    .then(response => response.text())
                    .then(text => {
                      setData(data + text);
                    });
                });
              }}
            >
              {({ getRootProps, getInputProps, isDragActive }) => {
                return (
                  <div
                    {...getRootProps()}
                    className={classNames("dropzone", {
                      "dropzone--isActive": isDragActive,
                    })}
                  >
                    <Button
                      icon
                      labelPosition="left"
                      circular
                      size="huge"
                      color="brown"
                    >
                      <Icon name="upload" />
                      Subir archivo
                    </Button>
                    <input {...getInputProps()} />
                  </div>
                );
              }}
            </Dropzone>
          </Grid.Row>
          <Grid.Row>
            <Form>
              <Form.Button
                icon
                labelPosition="left"
                size="big"
                color="blue"
                onClick={() => handleSubmit()}
              >
                <Icon name="plus circle" />
                Upsert
              </Form.Button>

              <TextArea
                ref={ref => {
                  if (ref) ref.focus();
                }}
                onChange={(_event, { value }) => {
                  setData(_.toString(value));
                }}
                rows={(data.match(/\n/g) || []).length + 3}
                style={{ width: "45em" }}
                placeholder=".json o .csv"
                value={data}
              />
            </Form>
          </Grid.Row>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default ImportUsers;
