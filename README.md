# Punk Orbis Groups Template

This template is built using the [Orbis SDK](https://orbis.club/developers) that developers can use to created decentralized and composable social applications / features very easily. The SDK documentation can be accessed [here](https://orbis.club/developers).

In order to customize this template for your community, you will need to do the following:

1. Create an Orbis group for your own community on the [orbis.club](https://orbis.club/) website.
2. Copy the newly created group's ID (check the URL) and paste it here in `pages/_app.js` --> `GROUP_ID`.
3. Change the values in the `components/User.js` file.
4. Change `groupLogoUrl` in the `components/GroupDetails.js` file.

## Preview

![](/public/preview.png)

## Getting Started

Install JS packages:

```bash
npm install
# or
yarn install
```

Then run the app:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website.
