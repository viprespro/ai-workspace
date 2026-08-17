/**
 * @Author: Ares
 */
"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** 把 ReactNode（含高亮后的 span 元素树）拍平成纯文本，供复制按钮使用 */
function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    // React 19 类型下 ReactElement.props 默认为 unknown，这里只取 children
    return extractText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractText(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 忽略剪贴板权限等异常
    }
  };

  return (
    <div className="md-codeblock group/code relative my-4 overflow-hidden rounded-xl border border-border bg-muted/70">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="hljs font-mono">{children}</code>
      </pre>
    </div>
  );
}

const components: Components = {
  // 代码块：react-markdown 会把 <pre><code className="language-xx"> 传入这里，完全接管渲染
  pre({ children }) {
    const codeEl = Children.toArray(children).find(isValidElement);
    const props = (codeEl?.props ?? {}) as { className?: string; children?: ReactNode };
    const langMatch = /language-([\w+-]+)/.exec(props.className ?? "");
    const language = langMatch?.[1] ?? "text";
    return (
      <CodeBlock language={language}>{props.children ?? children}</CodeBlock>
    );
  },
  // 行内代码（块级代码已被 pre 组件接管，不会走到这里）
  code({ className, children }) {
    return (
      <code
        className={cn(
          "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground",
          className
        )}
      >
        {children}
      </code>
    );
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
      >
        {children}
      </a>
    );
  },
  h1({ children }) {
    return (
      <h1 className="mb-3 mt-6 text-xl font-semibold tracking-tight first:mt-0">
        {children}
      </h1>
    );
  },
  h2({ children }) {
    return (
      <h2 className="mb-2.5 mt-5 text-lg font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    );
  },
  h3({ children }) {
    return (
      <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0">{children}</h3>
    );
  },
  h4({ children }) {
    return (
      <h4 className="mb-2 mt-3.5 text-[15px] font-semibold first:mt-0">
        {children}
      </h4>
    );
  },
  p({ children }) {
    return <p className="my-3 first:mt-0 last:mb-0">{children}</p>;
  },
  ul({ children }) {
    return <ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="my-3 border-l-2 border-muted-foreground/30 pl-4 text-muted-foreground">
        {children}
      </blockquote>
    );
  },
  hr() {
    return <hr className="my-6 border-border" />;
  },
  table({ children }) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border-b border-border bg-muted px-3 py-2 text-left font-medium">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="border-b border-border px-3 py-2">{children}</td>;
  },
  input(props) {
    // react-markdown 注入的 node 仅内部使用，不能透传到 DOM 上
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { node, ...inputProps } = props;
    return (
      <input
        {...inputProps}
        className="mr-1.5 inline-block size-3.5 align-middle accent-blue-600"
      />
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
