import moment from "moment-timezone";
import { buyUrl } from "./config";

import {
  fetchSims,
  activateSlot,
  fetchMessages,
  fetchSlotCooldowns,
} from "./basicSmsServices";
import { log } from '@misc/window/bot/utils';

// interface PuppeteerData {
//   concurrency: number;
//   runHeadless: boolean;
//   buyUrl: string;
//   maxRetries: number;
//   useProxy: boolean;
//   file: File;
// }

async function simulateHumanTyping(page: any, selector: any, value: any) {
  const randomTime = Number(Math.floor(Math.random() * 30));
  await page.type(selector, value, { delay: Number(30 + randomTime) });
  // await page.focus(selector);
  // for (let i = 0; i < value.length; i++) {
  //   const char = value[i];
  //   await page.keyboard.type(char);
  // }
}

function bot(page: any, row: any, index: number, user: any) {
  console.log('row in bot', row);
  // eslint-disable-next-line no-async-promise-executor
  return new Promise( async (resolve, reject) => {
    try {
      const { email, password, fname, lname, zip, phone, proxyInfo } = row;

      await page.route(/(png|jpeg|jpg|svg)$/, (route: any) => route.abort());
      // route ending with /notfound, reject with not found error
      await page.route(/\/notfound$/, (route: any) =>
        reject("redirected to not found page")
      );
      await page.goto(buyUrl);
      await page.waitForLoadState();

      console.log("waiting for login button on VerifiedFans");
      await page.waitForSelector('button[data-bdd="tm-login-button"]');
      await page.click('button[data-bdd="tm-login-button"]');
      console.log("clicked on login button on VerifiedFans");

      await page.waitForLoadState();

      let loginPage;
      try {
        // there are 2 cases, either it takes to ticketmaster login url or just opens an iframe with login form
        // if it takes to ticketmaster login url, then we need to fill in the form and submit
        // if it opens an iframe, then we need to fill in the form and submit
        if (page.url().includes("auth.ticketmaster")) {
          loginPage = page;
          console.log("Logging in to Ticketmaster using URL");
          await page.waitForSelector('input[name="email"]');
          await simulateHumanTyping(page, 'input[name="email"]', email);
          // await page.locator('input[name="email"]').fill(row.email);

          await page.waitForSelector('input[name="password"]');
          // await page.locator('input[name="password"]').fill(row.password);
          await simulateHumanTyping(page, 'input[name="password"]', password);

          await page.waitForSelector('button[name="sign-in"]');
          await page.click('button[name="sign-in"]');
        } else {
          console.log("Logging in to Ticketmaster using iframe");
          const loginIframe = await page.waitForSelector(
            'iframe[title="secure_accounts_widget"]'
          );
          const loginFrameContent = await loginIframe.contentFrame();

          loginPage = loginFrameContent;
          await loginFrameContent.waitForSelector('input[name="email"]');
          // await loginFrameContent.locator('input[name="email"]').fill(email);
          await simulateHumanTyping(
            loginFrameContent,
            'input[name="email"]',
            email
          );

          await loginFrameContent.waitForSelector('input[name="password"]');
          // await loginFrameContent
          // .locator('input[name="password"]')
          // .fill(password);
          await simulateHumanTyping(
            loginFrameContent,
            'input[name="password"]',
            password
          );

          await loginFrameContent.waitForSelector('button[type="submit"]');
          await loginFrameContent.click('button[type="submit"]');
        }
      } catch (error) {
        console.log("error clicking on login button on VerifiedFans");
      }
      console.log("Continuing to VerifiedFans");
      await page.waitForLoadState();

      // check for wrong password
      try {
        console.log("checking for wrong password");

        const pageContent = await loginPage.textContent(
          'div[data-bdd="error-banner"]'
        );
        if (pageContent.includes("We’re Unable to Sign You In"))
          return reject(
            `${email}: ❌ ===> Error with signing in, most likely wrong password.`
          );
      } catch (error) {
        console.log("error checking for wrong password");
      }

      await page.waitForTimeout(3000);
      // await page.waitForNavigation({ waitUntil: "networkidle" });

      // check if already bought, url should end with /entry
      try {
        console.log("checking if already bought");
        if (
          page.url().endsWith("/entry") ||
          (await page.$('button[data-bdd="edit-entry-link"]:visible')) !== null
        ) {
          console.log("Already bought");
          return resolve("already bought");
        }
      } catch (error) {
        console.log("error checking if already bought");
      }

      try {
        console.log("checking if phone number is already verified");
        if ((await page.$("div:visible #ppc-widget")) === null) {
          console.log("filling in phone number");
          await page.waitForSelector('input[id="intl-phone-number"]');
          // focus on the phone number input
          await page.focus('input[id="intl-phone-number"]');
          // select all the text in the input and press backspace
          await page.keyboard.down("Control");
          await page.keyboard.press("KeyA");
          await page.keyboard.up("Control");
          await page.keyboard.press("Backspace");
          await page.locator('input[id="intl-phone-number"]').fill("");
          // add +1 to the phone number if it doesn't have it
          if (!phone.startsWith("+1")) {
            await page.locator('input[id="intl-phone-number"]').fill("+1");
          }
          // await page.locator('input[id="intl-phone-number"]').fill(phone);
          await simulateHumanTyping(
            page,
            'input[id="intl-phone-number"]',
            phone
          );

          console.log("filling in zip code");
          await page.waitForSelector('input[name="zip"]');
          await page.locator('input[name="zip"]').fill("");
          // await page.locator('input[name="zip"]').fill(zip);
          await simulateHumanTyping(page, 'input[name="zip"]', zip);

          // check all the checkboxes
          console.log("checking all the checkboxes");
          const checkboxes = await page.locator(
            'input[type="checkbox"]:visible'
          );
          if (checkboxes) {
            for (let i = 0; i < (await checkboxes.count()); i++) {
              await checkboxes.nth(i).check();
            }
          }

          // select first option in all the required dropdowns
          console.log("selecting first option in all the dropdowns");
          const selects = await page.locator("select:visible");
          if (selects) {
            for (let i = 0; i < (await selects.count()); i++) {
              await selects.nth(i).selectOption({ index: 1 });
            }
          }

          console.log("clicking on submit button");
          await page.waitForTimeout(2000);
          await page.click('button[data-bdd="signup-submit"]', { force: true });
        }
      } catch (error) {
        console.log("error clicking on submit button", error);
      }
      await page.waitForTimeout(2000);

      // do we have an unexpected error?
      // data-bdd="message-box-message"
      // data-bdd="field-error-message"

      try {
        console.log("checking for unexpected error");
        await page.waitForSelector('div[data-bdd="message-box-message"]', {
          timeout: 2000,
        });
        reject("Random");
      } catch (error) {
        console.log("error while checking unexpected error lmao");
      }

      try {
        console.log("checking for used number");
        await page.waitForSelector('div[data-bdd="field-error-message"]', {
          timeout: 2000,
        });
        reject(`Phone: ${phone} is already used for this event`);
      } catch (error) {
        console.log("error while checking used number");
      }

      console.log("Waiting for network idle");
      // await page.waitForLoadState("networkidle");

      await page.waitForTimeout(4000);

      console.log("waiting for iframe");

      let elementHandle = await page.waitForSelector("iframe", {
        timeout: 6000,
      });

      try {
        console.log("get 1st frame if there are multiple");
        elementHandle = elementHandle[0];
      } catch (error) {
        console.log("error getting 1st frame");
      }

      let frame = await elementHandle.contentFrame();

      const frameDetached = frame.isDetached();

      if (frameDetached) {
        console.log("frame detached");
        frame = page.mainFrame().childFrames()[-1];
      }

      console.log("waiting for SMS");
      await frame.waitForLoadState();
      await frame.waitForTimeout(2000); // Wait for the frame to be detached if the parent frame is navigated away from or closed
      await frame.waitForSelector("label[for='SMS']", { timeout: 120000 });
      await frame.locator("label[for='SMS']")?.click();

      console.log("waiting for next button");
      await frame.waitForSelector('button[data-bdd="otp-option-select-next"]', {
        timeout: 120000,
      });
      await frame.click('button[data-bdd="otp-option-select-next"]');

      // check if there was an error, need to restart it
      try {
        await page.waitForSelector('div[data-bdd="otp-option-error"', {
          timeout: 3000,
        });
        return reject("Poll Expired");
      } catch (error) {
        console.log("no error");
      }

      await frame.waitForLoadState();

      // record the time when the OTP was requested
      const otpRequestedTime = moment().tz("EST").add(1, "hour");
      console.log(
        "OTP requested at EST: ",
        otpRequestedTime.format("YYYY-MM-DD HH:mm:ss")
      );

      try {
        console.log("waiting for OTP");
        await frame.waitForSelector('input[name="otp"]', { timeout: 15000 });
      } catch (error) {
        reject("Random");
      }

      console.log("Fetching sims");
      const simsResponse = await fetchSims(user.id);
      if (!simsResponse.status) {
        return reject(
          `${email}: ❌ ===> error fetching sims. ${simsResponse.message}`
        );
      }

      const sims = simsResponse.data.data;

      console.log("finding sim");
      const sim = sims?.find((sim: {number: number, port: string}) => String(sim.number) === String(phone));
      if (!sim) {
        return reject(`${email}: ❌ ===> sim not found.`);
      }

      const { port, gatewayID } = sim;

      const slotCooldowns = await fetchSlotCooldowns();
      const now = moment().utc();

      const slots = slotCooldowns?.data?.data;
      const slot = slots.find((slot: any) => {
        // if slot hasn't been turned on within 3 minutes, ignore it
        const { gateway, lastActivation } = slot;

        const easternTime = moment.tz(lastActivation, "EST");
        const cooldownTime = easternTime.utc();

        const diffInMinutes = cooldownTime.diff(now, "minutes");
        // console.log(diffInMinutes);
        // console.log(cooldownTime);
        // console.log(now);
        return gateway == gatewayID && Math.abs(diffInMinutes) >= 3;
      });

      if (slot) {
        console.log("checking to see if we should activate the slot");
        // ie. port: '48B',  // 48 = slot, B = port where A=1, B=2, C=3 ... up to 8
        const slotNumber = port.slice(0, -1); // 48
        const portChar = port.slice(-1); // B
        const portNumber = portChar.charCodeAt(0) - 64; // 2

        console.log("activating slot", gatewayID, port);
        const activateSlotResponse = await activateSlot(gatewayID, String(portNumber));
        if (!activateSlotResponse.status) {
          return reject(
            `${email}: ❌ ===> error activating slot. ${activateSlotResponse.message}`
          );
        }
      }

      // wait for the OTP to be received
      // keep polling the API to check if the OTP has been received fetchMessages
      // if it has, then type it in the OTP field
      // if it hasn't, then wait for 5 seconds and try again
      // if it hasn't been received after 3 minutes, then reject the promise
      const startTime = new Date().getTime();
      const maxTime = 3 * 60 * 1000; // 4 minutes, then restart
      const fetchMessagesInterval = 20 * 1000; // 20 seconds
      let otp = null;

      console.log("waiting for OTP to be received");
      console.log(
        `Going to poll every ${fetchMessagesInterval / 1000} seconds for ${
          maxTime / 1000
        } seconds max until OTP is received`
      );
      // delay for 3 seconds before starting to poll
      await page.waitForTimeout(3000);
      let otps = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        console.log("retrieving messages");
        const fetchMessagesResponse = await fetchMessages(user.id);
        const messages = fetchMessagesResponse?.data?.data;

        // search within recent 5 messages which has Ticketmaster in the content
        // and received after the OTP was requested
        console.log("finding message");
        const message = messages?.filter((message: {content: string, date: string, receiver: string}) => {
          const messageContent = message.content.toLowerCase();

          // remove T and .000Z from the date string i.e. 2023-03-27T02:52:59.000Z
          // and convert it to local time
          const messageDate = message.date
            .replace("T", " ")
            .replace(".000Z", "");

          const messageReceiveDate = moment.tz(messageDate, "EST");

          // console.log(otpRequestedTime);
          // console.log(messageReceiveDate);
          // console.log(message.receiver);

          const cond1 = messageContent.includes("ticketmaster");
          const cond2 = messageReceiveDate.isAfter(otpRequestedTime);
          const cond3 = message.receiver == phone;
          return cond1 && cond2 && cond3;
        });
        if (message.length > 0) {
          // some scenarios there are 2 ... use 1st then 2nd
          otps = message;
          otp = otps[0].content.match(/\d+/)[0];
          if (otp?.length !== 6) {
            otp = null;
          } else {
            console.log(`OTP found: ${otp}`);
            break;
          }
        }

        const currentTime = new Date().getTime();
        if (currentTime - startTime > maxTime) {
          // return reject(`OTP`);
          // resend after 4 minutes, get wrong on purpose
          otp = "123456";
          break;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, fetchMessagesInterval)
        );
      }

      console.log("typing OTP");
      // await frame.type('input[name="otp"]', otp);
      await simulateHumanTyping(frame, 'input[name="otp"]', otp);

      try {
        console.log("waiting for submit button");
        await frame
          .locator('button[type="submit"]', { timeout: 2000 })
          ?.click();
        console.log("Clicked on submit button");
      } catch (error) {
        console.log("error waiting for submit button");
      }

      // check for invalid OTP. get the other one
      try {
        await frame.waitForSelector('div[id="input-otp-error-message"]', {
          timeout: 2000,
        });

        console.log("got an invalid OTP, waiting to fetch again, clear it");
        await frame.locator('input[name="otp"]').fill("");

        // try the other one before requesting again
        if (otps.length > 1) {
          try {
            otp = otps[1].content.match(/\d+/)[0];
            await simulateHumanTyping(frame, 'input[name="otp"]', otp);

            console.log("waiting for submit button");
            await frame.locator('button[type="submit"]')?.click();
            console.log("Clicked on submit button");
            console.log("checking if successfully submitted");
            await page.waitForLoadState();
            if (
              page.url().endsWith("/entry") ||
              (await page.$('button[data-bdd="edit-entry-link"]:visible')) !==
              null
            ) {
              console.log("Successfully submitted");
              resolve(`${email}: ✅ ===> submitted`);
            }
          } catch (error) {
            console.log("error waiting for submit button");
          }
        }

        // click on resend OTP
        // gather msgs again, ticketmaster sends twice for some reason sometimes... try 1 more time ..
        console.log("resending OTP");
        await frame.waitForSelector(`a:has-text("Request a new code.")`);
        await frame.click(`a:has-text("Request a new code.")`);

        // wait 10 seconds before fetching again
        await frame.waitForTimeout(10000);
        console.log("retrieving messages");
        const fetchMessagesResponse = await fetchMessages(user.id);
        const messages = fetchMessagesResponse?.data?.data;

        console.log("finding message");
        const message = messages?.filter((message: {content: string, date: string, receiver: string}) => {
          const messageContent = message.content.toLowerCase();

          // remove T and .000Z from the date string i.e. 2023-03-27T02:52:59.000Z
          // and convert it to local time
          const messageDate = message.date
            .replace("T", " ")
            .replace(".000Z", "");

          const easternTime = moment.tz(messageDate, "EST");
          const messageReceiveDate = easternTime.utc();

          const cond1 = messageContent.includes("ticketmaster");
          const cond2 = messageReceiveDate.isAfter(otpRequestedTime);
          const cond3 = message.receiver == phone;

          return cond1 && cond2 && cond3;
        });
        if (message) {
          otp = message[0].content.match(/\d+/)[0];
          if (otp?.length !== 6) {
            otp = null;
          } else {
            console.log(`OTP found: ${otp}`);
            console.log("typing OTP");
            // await frame.type('input[name="otp"]', otp);
            await simulateHumanTyping(frame, 'input[name="otp"]', otp);

            console.log("waiting for submit button");
            await frame.locator('button[type="submit"]')?.click();
            console.log("Clicked on submit button");
          }
        }

        // check again
        await frame.waitForSelector('div[id="input-otp-error-message"]', {
          timeout: 2000,
        });
        reject("OTP");
      } catch (error) {
        console.log("error checking for invalid OTP");
      }

      try {
        console.log("checking if successfully submitted");
        await page.waitForLoadState();
        if (
          page.url().endsWith("/entry") ||
          (await page.$('button[data-bdd="edit-entry-link"]:visible')) !== null
        ) {
          console.log("Successfully submitted");
          resolve(`${email}: ✅ ===> submitted`);
        }
      } catch (error) {
        console.log("error checking if already submitted");
      }

      // delay 5 seconds
      await page.waitForTimeout(5000);

      resolve(`[double check]${email}: ✅ ===> submitted`);
    } catch (error) {
      return reject(error);
    }
  });
}

export default bot;

