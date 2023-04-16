// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import { addExtra, chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import { parse } from 'csv-parse/lib/sync';
import { ProxyRouter } from '@extra/proxy-router';
import { log } from './utils';
import bot from './bot';
import { fetchSims, login } from './basicSmsServices';

const stealth = StealthPlugin();

interface RowInterface {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  zip: string;
  phone: string;
  proxyInfo?: string;
}

interface DataInterface {
  concurrency: number;
  useProxy: boolean;
  runHeadless: boolean;
  buyUrl: string;
  maxRetries: number;
  rows: Array<RowInterface>;
}

async function main(data: DataInterface) {

// create logs file if not exists
  if (!fs.existsSync('misc/window/bot/logs.txt')) {
    fs.writeFileSync('misc/window/bot/logs.txt', '', { flag: 'a', mode: 0o777 });
  }

// create bought file if not exists
  if (!fs.existsSync('misc/window/bot/bought.csv')) {
    fs.writeFileSync('misc/window/bot/bought.csv', 'email', { flag: 'a', mode: 0o777 });
  }

// create bad file if not exists
  if (!fs.existsSync('misc/window/bot/bad.csv')) {
    fs.writeFileSync('misc/window/bot/bad.csv', 'email', { flag: 'a', mode: 0o777 });
  }

// Insert current date and time
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const timeStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  const dateTimeStr = `${dateStr} ${timeStr}`;
  fs.appendFileSync(
    'misc/window/bot/logs.txt',
    `#################### ${dateTimeStr} ####################\n`,
  );

  let initialRows: Array<RowInterface> = data.rows;

  console.log(`total rows: ${initialRows.length}`);

  interface IBoughtRow {
    email: string;
  }

// filter out rows where row email is present in bought.csv
  const boughtRows: Array<IBoughtRow> = parse(fs.readFileSync('misc/window/bot/bought.csv'), {
    columns: true,
    skip_empty_lines: true,
  });
  const boughtEmails = boughtRows.map((row) => row.email);

  interface IBadRow {
    email: string;
  }

  const badRows: Array<IBadRow> = parse(fs.readFileSync('misc/window/bot/bad.csv'), {
    columns: true,
    skip_empty_lines: true,
  });
  const badEmails = badRows.map((row) => row.email);

  console.log(`already processed emails: ${boughtEmails.length}`);
  console.log(`bad emails: ${badEmails.length}`);

  initialRows = initialRows.filter((row) => {
    return !boughtEmails.includes(row.email) && !badEmails.includes(row.email);
  });

  console.log(`remaining rows before sim check: ${initialRows.length}`);

  if (!initialRows.length) {
    console.log('no rows to process, exiting...');
    process.exit(0);
  }

// create browsers array and create chromium instances for each row
  const browsers: Array<any> = [];
  for (let i = 0; i < initialRows.length; i++) {
    browsers.push(addExtra(chromium).use(stealth));
  }

// get proxy list from all the rows
  const proxyList = initialRows.map((row) => row.proxyInfo);

  console.log('starting bot...');

  console.log(`Logging in into basic sms...`);
  const firstRow = {
    email: 'nathanmoser38@gmail.com',
    password: 'Basicsms1!',
  };

  login(firstRow.email, firstRow.password)
    .then(async (response) => {
      const { status, message } = response;
      console.log('data.data.user', response.data.data.user);
      if (!status) {
        log(`[${firstRow.email}] error: ${message}`);
        return;
      }
      const user = response.data.data.user;

      // here, lets gather all users sims
      const simsResponse = await fetchSims(user.id);
      const sims = simsResponse.data.data;

      const userNumbers = initialRows.map((row) => row.phone);
      const numbersToRow = {};
      initialRows.forEach((row) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        numbersToRow[row.phone] = row;
      });

      const gatewayOrder: any = {};

      interface ISim {
        number: string;
        port: string;
        gatewayID: number;
      }

      // organize sims
      sims.forEach((sim: ISim) => {
        const { number, gatewayID } = sim;

        let port = sim.port;

        // 1b => 01b
        port = port.length == 2 ? `0${port[0]}${port[1]}` : port;

        // 01b => b01
        port = `${port[2]}${port[0]}${port[1]}`;

        if (userNumbers.includes(number)) {
          if (gatewayOrder[gatewayID])
            gatewayOrder[gatewayID].push({ number, port });
          else gatewayOrder[gatewayID] = [{ number, port }];
        }
      });

      // console.log("gatewayOrder?", gatewayOrder);

      // needs to go 1 gateway @ a time & have it be sorted by port
      Object.keys(gatewayOrder).forEach((gatewayId) => {
        const numbersInfo = gatewayOrder[gatewayId];
        gatewayOrder[gatewayId] = numbersInfo.sort((a: { number: number, port: string }, b: { number: number, port: string }) => {
          if (a.port < b.port) {
            return -1;
          }
          if (a.port > b.port) {
            return 1;
          }
          return 0;
        });
      });

      const tmpInitialRows: any = [];
      Object.keys(gatewayOrder).forEach((gatewayId) => {
        const numbersInfo = gatewayOrder[gatewayId];
        numbersInfo.forEach((sim: { number: number, port: string }) => {
          const { number } = sim;
          tmpInitialRows.push(numbersToRow[number as keyof typeof numbersToRow]);
        });
      });
      // console.log(gatewayOrder);
      initialRows = tmpInitialRows;

      console.log(`remaining rows after sim check: ${initialRows.length}`);

      if (initialRows.length) {
        runBot(user, browsers, proxyList, data)
          .then(() => {
            console.log('done');
          })
          .catch((error) => {
            console.log('error', error);
          });
      }
      else {
        console.log('no rows to process, exiting...');
        alert('no rows to process, exiting...');
      }
    });
}

// run the number of browsers equal to the concurrency at a time
async function runBot(user: any, browsers: any, proxyList: any, data: DataInterface) {
  const { concurrency, useProxy, runHeadless, buyUrl, maxRetries, rows } = data;

  let count = 0;
  for (let i = 0; i < browsers.length; i + concurrency) {
    const browserPromises = browsers
      .slice(i, i + concurrency)
      .map(async (browser: any, index: number) => {
        const row = rows[count];

        console.log('row', row);
        console.log('url', buyUrl);

        // use proxy if enabled
        if (useProxy) {
          console.log('using proxy...');
          const proxy = proxyList[count].split(':');
          const proxyHost = proxy[0];
          const proxyPort = proxy[1];
          const proxyUsername = proxy[2];
          const proxyPassword = proxy[3];

          // DEFAULT: 'http://user:pass@proxyhost:port',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const proxyRouter = new ProxyRouter({
            proxies: {
              DEFAULT: `http://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`,
            },
          });

          browser.use(proxyRouter);
        }

        let retries = 0;
        let success = false;
        let message: unknown = '';

        const inst = await browser.launch({
          headless: runHeadless,
          args: ['--disable-features=site-per-process'],
        });

        let page = await inst.newPage();
        await page.setDefaultTimeout(120000);

        while (!success && retries < maxRetries) {
          try {
            message = await bot(page, row, index, user, buyUrl);
            log(`[${row.email}] ${message} for url: ${buyUrl}`);
            success = true;
            fs.appendFileSync('misc/window/bot/bought.csv', `\n${row.email}`);
          } catch (error) {
            log(`[${row.email}] error: ${error} for url: ${buyUrl}`);
            // potential infinite loop but probs not
            const errorCodes = [
              'Frame was detached',
              'Poll Expired',
              'Random',
              'OTP',
            ];
            const cond1 = error.message && error.message.includes('iframe');
            const cond2 = typeof error == 'string' && errorCodes.includes(error);
            if (cond1 || cond2) {
              await page.close();
              retries++;
              page = await inst.newPage();
              await page.setDefaultTimeout(120000);

              try {
                message = await bot(page, row, index, user, buyUrl);
                log(`[${row.email}] ${message} for url: ${buyUrl}`);
                success = true;
                fs.appendFileSync('misc/window/bot/bought.csv', `\n${row.email}`);
              } catch (error) {
                log(`[${row.email}] error: ${error} for url: ${buyUrl}`);
                // let it continue will address in logs. big problem
              }
            } else {
              message = error;
              break;
            }
          }
        }

        if (!success) {
          log(
            `[${row.email}] failed after ${maxRetries} attempts: ${message} for url: ${buyUrl}`,
          );
          fs.appendFileSync('misc/window/bot/bad.csv', `\n${row.email}`);
        }

        log('\n');

        await inst.close();
        count++;
      });
    await Promise.all(browserPromises);
    await Promise.all(browsers.map((browser: any) => browser.close()));
  }
}

export default main;
