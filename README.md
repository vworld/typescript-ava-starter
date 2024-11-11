# simple-typescript-ava-starter

This is a simple starter for TS projects with linting and ava.

## Includes

- `typescript: "^5.6.3"`
- `@ava/typescript: "^5.0.0"`
- `eslint": "^8.57.1"` (later versions require flat file configs)
- `@typescript-eslint/eslint-plugin": "^8.13.0"`
- `@typescript-eslint/parser": "^8.13.0"`
- `c8": "^10.1.2"` - for coverage
- `eslint-config-prettier": "^9.1.0"`
- `eslint-plugin-ava": "^14.0.0"`
- `eslint-plugin-eslint-comments": "^3.2.0"`
- `eslint-plugin-import": "^2.31.0"`
- `prettier": "^3.3.3"`
- `ts-node": "^10.9.2"`

## Why

Many awesome starters exist. This is useful when you quickly want to get started with just the basics.
This is primarily a bookmark project for myself, but if you find it useful I would love to know that.

## Environment Variables

- uses package `@dotenvx/dotenvx`
- Default variables can be saved in .env file. All environment specific variables can be set in their respective
  file (`.env.production`, `.env.development` and `.env.testing`)
- Environment specific file `.env.(production|development|testing` would override the values set in `.env`
- This pattern can be used to avoid unnecessary repetition.
- All environment variables should be re-exported from `src/utils/env.ts`

## Logging

- Logging is done via winston. A few utilities have been added

## How to use

- Clone the repository with `git clone`
- install dependencies with `npm install`

## Use without cloning

1. Setup Directories
    ```shell
    mkdir src
    mkdir src/tests
    mkdir src/types
    ```
2. install dependencies using npm (or yarn or pnpm)
   ```shell
   # ts, ts-node. eslint@8, prettier, node types (eslint8.x works with .eslintrc.json; latest requires flat file config
   npm install --save-dev typescript ts-node eslint@8 prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-eslint-comments eslint-plugin-import @types/node
   
   # ava
   npm install --save-dev ava @ava/typescript eslint-plugin-ava@14
   
   # coverage
   npm install --save-dev c8
   
   # optionally typedoc to generate html or json from comments
   npm install --save-dev typedoc
   ```
3. Edit package.json
    1. add scripts
       ```json
       {
          "scripts": {
             "build": "tsc",
              "lint": "eslint src",
              "lint:fix": "eslint src --fix",
              "prettier": "prettier \"src/**/*.ts\" --list-different",
              "prettier:fix": "prettier \"src/**/*.ts\" --write",
              "test": "ava",
              "test:build": "npm run build && ava",
              "coverage": "c8 ava",
              "coverage:build": "npm run build && c8 ava"
          }
       }
       ```
    2. add ava configs
       ```json
       {
          "ava": {
             "concurrency": 5,
             "failFast": true,
             "tap": false,
             "verbose": true,
             "files": [
                "src/tests/**/*.test.ts"
             ],
             "typescript": {
                "rewritePaths": {
                   "src/": "build/"
                },
                "compile": false
             },
             "timeout": "60s"
          }
       }
       ```
    3. You can always check the `package.json` file in this repository
4. copy the following files
    1. `.eslintrc.json`
    2. `.gitignore`
    3. `.prettierignore`
    4. `tsconfig.json`

## Found this useful

Awesome, feel free to fork or leave a start.

## Other full-featured starters

- https://github.com/bitjson/typescript-starter (when creating library)
- https://github.com/ljlm0402/typescript-express-starter - (full-featured)

## TODO
 - Automate runtime env type validation and conversion from string 