import React from 'react';
import FormGroup from './FormGroup';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

const RegistrationForm = () => (
  <form className="registration-form">
    <FormGroup className="name-field">
      <TextInput placeholder="Họ và Tên" />
    </FormGroup>

    <FormGroup className="email-field">
      <TextInput placeholder="Email hoặc Số điện thoại" />
    </FormGroup>

    <FormGroup>
      <PasswordInput placeholder="Mật khẩu" />
    </FormGroup>

    <FormGroup>
      <PasswordInput placeholder="Nhập lại mật khẩu" />
    </FormGroup>

    <FormGroup>
      <SubmitButton />
    </FormGroup>
  </form>
);

export default RegistrationForm;
