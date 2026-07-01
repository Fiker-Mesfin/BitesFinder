// Allow TypeScript to import JSX files without type errors
declare module "*.jsx" {
  const Component: any;
  export default Component;
}
