# Baseweight.net

## Steps to run locally

1. Fork the repository.
   
2. Clone the fork to your local machine and add upstream remote:

```sh
git clone git@github.com:<yourname>/baseweight.git
cd baseweight
git remote add upstream git@github.com:bebersohl/baseweight.git
```

3. Synchronize your local `development` branch with the upstream one:

```sh
git checkout --track upstream/development
```

`master` is production code.

`development` is next release.

4. If you are creating a PR, create a branch off of development:

```sh
git checkout -b my-topic-branch
```

5. Install dependencies:
```sh
cd frontend && npm i
```

6. Create a firebase project:

https://firebase.google.com/

7. Navigate to project settings, scroll down to "Firebase SDK snippet", click the "Config" radio button. Copy pase the contents of the file into a new env file: `frontend/.env.development`

The contents of the file should look like this:
```
REACT_APP_API_KEY=<your api key>
REACT_APP_AUTH_DOMAIN=<Your auth domain>
REACT_APP_DATABASE_URL=<Your database url>
REACT_APP_PROJECT_ID=<Your project id>
REACT_APP_STORAGE_BUCKET=<Your storage bucket>
REACT_APP_MESSAGING_SENDER_ID=<Your messaging sender id>
REACT_APP_APP_ID=<Your app id>
REACT_APP_MEASUREMENT_ID=<Your measurement id>
```

1. Click "Authentication" and enable "Email/Password" and "Google" Authentication.

2. Click "Database" and enable "Cloud Firestore"
   
3.   Start the project:

(Make sure you are in the `frontend` directory)
```sh
npm start
```

1.  Navigate to localhost:3000


## Adding test data to your project

1. In the firebase console, navigate to Settings, click "Service Accounts" tab, click "Generate new private key"

2. Copy paste the contents of the downloaded file to `/db/serviceAccount.json`

3. Install dependencies:
```sh
cd db && npm i
```

4. Ensure the scripts you want are uncommeneted in `/db/index.ts`

`batchInsertTestSuggestions()` inserts test suggestions to the db

`insertDemoList()` inserts demo.json (the demo list on the homepage) to the db

`batchInsertTestGearLists()` inserts test gearLists to the db. Requires `/db/userIds.json` to exist. `userIds.json` is an array of userIds that you want gearLists generated for.

Example of `userIds.json` file contents:
```
[
  "1237&SYDAsdh12he127eh&DHSHDAS",
  "12783ASHDH123jsdjasdhj123hj12j",
  "123712381277sae7d78asd78127888"
]
```

These should be user uid's that currently exist in your firebase project. The uid's can be found under the authentication tab.

5. Run the script.

(Make sure you are in the `/db` directory)
```sh
npm run start
```

6. Navigate to the Database tab in the firebase console of your project and verify that new data has been added.