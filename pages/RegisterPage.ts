import { Locator, Page, expect } from '@playwright/test';

import type { RegisterFormData } from '../test-data/registerPageTestData';

import {
  registerFormData,
  registerPassword,
  registerUrl,
} from '../test-data/registerPageTestData';

export class RegisterPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatedPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly userAlreadyExistError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('#customer\\.firstName');
    this.lastNameInput = page.locator('#customer\\.lastName');
    this.streetInput = page.locator('#customer\\.address\\.street');
    this.cityInput = page.locator('#customer\\.address\\.city');
    this.stateInput = page.locator('#customer\\.address\\.state');
    this.zipCodeInput = page.locator('#customer\\.address\\.zipCode');
    this.phoneNumberInput = page.locator('#customer\\.phoneNumber');
    this.ssnInput = page.locator('#customer\\.ssn');

    this.usernameInput = page.locator('#customer\\.username');

    this.passwordInput = page.locator('#customer\\.password');

    this.repeatedPasswordInput =
      page.locator('#repeatedPassword');

    this.registerButton = page.getByRole('button', {
      name: 'Register',
    });

    this.userAlreadyExistError = page.locator(
      '#customer\\.username\\.errors'
    );
  }

  async goTo(): Promise<void> {
    await this.page.goto(registerUrl);
  }

  async fillForm(
    formData: RegisterFormData = registerFormData
  ): Promise<void> {
    await this.firstNameInput.fill(formData.firstName);

    await this.lastNameInput.fill(formData.lastName);

    await this.streetInput.fill(formData.street);

    await this.cityInput.fill(formData.city);

    await this.stateInput.fill(formData.state);

    await this.zipCodeInput.fill(formData.zipCode);

    await this.phoneNumberInput.fill(formData.phoneNumber);

    await this.ssnInput.fill(formData.ssn);

    await this.usernameInput.fill(formData.username);
  }

  async fillCredentials(
    username: string = registerFormData.username,
    password: string = registerPassword
  ): Promise<void> {
    await this.usernameInput.fill(username);

    await this.passwordInput.fill(password);

    await this.repeatedPasswordInput.fill(password);
  }

  async submitForm(): Promise<void> {
    await this.registerButton.click();
  }

  async getUsernameError(): Promise<string> {
    if (!(await this.userAlreadyExistError.isVisible())) {
      return '';
    }

    const text =
      await this.userAlreadyExistError.textContent();

    return text?.trim() ?? '';
  }

  async isUsernameAlreadyExists(): Promise<boolean> {
    const errorText = await this.getUsernameError();

    return errorText
      .toLowerCase()
      .includes('already exists');
  }

  async verifyAccountCreation(
    username: string
  ): Promise<void> {
    const header = this.page.locator('h1');

    const rightPanel =
      this.page.locator('#rightPanel');

    await expect(header).toContainText(
      `Welcome ${username}`
    );

    await expect(rightPanel).toContainText(
      'Your account was created successfully. You are now logged in.'
    );
  }
}
3.