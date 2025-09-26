# Etherlink developer documentation

This repository has the source code for the Etherlink documentation at https://docs.etherlink.com.

The source code for Etherlink itself (including the kernel and node) are in the repository https://gitlab.com/tezos/tezos/-/tree/master/etherlink?ref_type=heads.

## Build instructions

1. Clone this repository and run `npm install`.
1. Get a Thirdweb client ID from https://thirdweb.com.
1. Copy the `.env.example` file from the root of this repository to the file `.env` and put the Thirdweb client ID as the value of the `THIRDWEB_CLIENT_ID` variable.
1. Run `npm run start` to run a development version of the documentation.

## Styling note
- Use `h3` for Admonition title, see example in `docs/building-on-etherlink/bridging-xtz.md`
- We have a custom table class in global `custom.css` `.customTableContainer`
- Apply `customTableContainerWrapper` to `customTableContainer` if the bottom scroll bar is out of table