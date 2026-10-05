import { test } from "@playwright/test";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { RegisterPage } from "../pages/RegisterPage";
import {
  authFile,
  MAX_RETRIES,
  registerFormData,
  registerPassword,
} from "../test-data/registerPageTestData";

test.beforeEach(async () => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  fs.writeFileSync(authFile, "{}", "utf-8");
  console.log("🧹 Cleared authentication file before test.");
});

test("Register at Parabank", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const username =
      attempt === 1
        ? registerFormData.username
        : `${registerFormData.username}${randomBytes(4).toString("hex")}`;

    console.log(
      `Registration attempt ${attempt}/${MAX_RETRIES} for "${username}"`,
    );
    await registerPage.goTo();
    await registerPage.fillForm(registerFormData);
    await registerPage.fillCredentials(username, registerPassword);
    await registerPage.submitForm();
    await page.waitForLoadState("networkidle");
    if (await registerPage.isUsernameAlreadyExists()) {
      console.log(`Username "${username}" already exists.`);
      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Registration failed: username "${username}" already exists after ${MAX_RETRIES} attempts.`,
        );
      }
      console.log(
        `Retrying registration... Attempt ${attempt + 1}/${MAX_RETRIES}`,
      );
      continue;
    }
    await registerPage.verifyAccountCreation(username);
    await page.context().storageState({ path: authFile });
    console.log(`Registration successful for "${username}".`);
    return;
  }
  throw new Error(`Registration failed after ${MAX_RETRIES} attempts.`);
});
