import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Mermaid } from 'fumadocs-mermaid/ui';
import type { MDXComponents } from 'mdx/types';
import React from 'react';

function Diagram({ children, name }: { children?: React.ReactNode; name?: string }) {
  return <div className="my-6">{children}</div>;
}

function Steps({ children }: { children?: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function Step({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="border border-3/4 p-4 rounded-md">
      {title && <h4 className="font-bold mb-2">{title}</h4>}
      <div>{children}</div>
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Mermaid,
    Diagram,
    Steps,
    Step,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
