# OSPACE WEB

## Source

- [figma](https://www.figma.com/file/ZrrGFocvQzNw49bW1bRb84/volleyball-web-project_0116?node-id=69%3A17276&t=33rTk9rxC04Hud6W-1)

## Stack

- Nextjs 13.1.1 stable version
  - mostly SSR with client fetching
  - except for global var
- Tailwindcss 3.2.6
- Axios (api fetch)
- React Query (client fetch)
- Typescript
- Zod (validation)

## Folder Structure

```
-- ui
  |_ atoms
  |_ molecules
  |_ organisms
  |_ components - used on page
__ page
__ helpers
__ hooks (mostly for useQuery)
__ constant
__ public
  |_ assets
    |_ app-icons.svg - sprite for small icons so it will be statically generated

```

## TODO

- [] language
- [] tickets
- [] login / email
- [] pagination
- [] max img size
