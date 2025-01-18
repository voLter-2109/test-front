declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
