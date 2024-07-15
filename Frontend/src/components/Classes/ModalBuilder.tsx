import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { UseFormReturn } from "react-hook-form";

type ModalBuilderProps<T> = {
  show: boolean;
  onHide: () => void;
  title: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  fields: {
    name: keyof T;
    label: string;
    type?: string;
    options?: Array<{ value: string; label: string }>;
    validation?: any;
  }[];
  submitButtonLabel?: string;
};

export class ModalBuilder<T> extends React.Component<ModalBuilderProps<T>> {
  render() {
    const { show, onHide, title, form, onSubmit, fields, submitButtonLabel } = this.props;
    const { register, handleSubmit, formState: { errors } } = form;

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <Form.Group controlId={`form${field.name}`} key={index}>
                <Form.Label>{field.label}</Form.Label>
                {field.type === "select" ? (
                  <Form.Control as="select" {...register(field.name, field.validation)}>
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Control>
                ) : (
                  <Form.Control
                    type={field.type || "text"}
                    {...register(field.name, field.validation)}
                    isInvalid={!!errors[field.name]}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors[field.name]?.message}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Button variant="primary" type="submit">
              {submitButtonLabel || "Submit"}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
