import React, { Component } from "react";
import CourseDataService from "../service/CourseDataService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const INSTRUCTOR = "in28minutes";
const COURSE_API_URL = "http://localhost:8080";
const INSTRUCTOR_API_URL = `${COURSE_API_URL}/instructors/${INSTRUCTOR}`;
const service = CourseDataService;

class CourseComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      description: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }
  componentDidMount() {
    if (this.state.id == -1) {
      return;
    }

    CourseDataService.retrieveCourse(INSTRUCTOR, this.state.id).then(response =>
      this.setState({
        description: response.data.description
      })
    );
  }

  onSubmit(values) {
    let course = {
      id: this.state.id,
      description: values.description,
      targetDate: values.targetDate
    };
    if (this.state.id == -1) {
      /*CourseDataService.retrieveCourse(INSTRUCTOR, this.state.id).then(
        response => this.props.history.push("/courses")
      );*/

      axios
        .post(`${INSTRUCTOR_API_URL}/courses/`, course)
        .then(() => this.props.history.push("/courses"));
    } else {
      axios
        .put(`${INSTRUCTOR_API_URL}/courses/${course.id}`, course)
        .then(() => this.props.history.push("/courses"));
    }
  }
  validate(values) {
    let errors = {};
    if (!values.description) {
      errors.description = "Enter a Description";
    } else if (values.description.length < 5) {
      errors.description = "Enter at least 5 Characters in Description";
    }
    console.log("errors", errors);
    return errors;
  }

  render() {
    let { description, id } = this.state;
    return (
      <div>
        <h3>Course</h3>
        <div className="container">
          <Formik
            enableReinitialize
            initialValues={{ id: id, description: description }}
            onSubmit={this.onSubmit}
            validate={values => {
              let errors = {};
              if (!values.description) {
                errors.description = "Enter a Description";
              } else if (values.description.length < 5) {
                errors.description =
                  "Enter at least 5 Characters in Description";
              }
              return errors;
            }}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {props => (
              <Form>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="alert alert-warning"
                />
                <fieldset className="form-group">
                  <label>Id</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="id"
                    disabled
                  />
                </fieldset>
                <fieldset className="form-group">
                  <label>Description</label>
                  <Field
                    className="form-control"
                    type="text"
                    name="description"
                  />
                </fieldset>
                <button className="btn btn-success" type="submit">
                  Save
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}

export default CourseComponent;
