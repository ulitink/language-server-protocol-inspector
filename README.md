<p>
  <h2 align="center">Language Server Protocol Inspector</h2>
</p>

<p align="center">
  <a href="https://travis-ci.org/Microsoft/language-server-protocol-inspector">
    <img src="https://img.shields.io/travis/Microsoft/language-server-protocol-inspector.svg?style=flat-square">
  </a>
</p>

## Note
Due to the original project is no longer maintain, i fork it makes the web lsp-inspector worked, and redeploy to my github.io.
Try it at https://iwanabethatguy.github.io/language-server-protocol-inspector/.

## Motivation

When you are using [vscode-languageserver-node](https://github.com/Microsoft/vscode-languageserver-node) to develop a language server, it's possible to specify a setting `"[langId].trace.server": "verbose"` to make the Language Client log the LSP communication. This log is useful for developing and testing the Language Server, but the log can be lengthy — using the editor for 5 seconds could generate 5000 lines of LSP log. This makes it hard to gain insight from the logs.

This inspector visualizes the logs to make it easy to understand the communication between the Language Client / Server. It also lets you filter the logs by search query or language features, so you can quickly identify the logs you are interested in.

![lsp-inspector](https://user-images.githubusercontent.com/4033249/41323525-ba73697a-6e63-11e8-92a3-c655b34126f6.gif)

## Usage

- A log file (log from html Language Server) is loaded by default.
- Click each LSP item to expand its parameters.
- Type a query into the search bar to filter the logs.
- Select a language feature area to filter the logs.
- Collect your own logs and inspect them! For example:
  - Set `css.trace.server: "verbose"` in VS Code.
  - Open a CSS file.
  - Copy everything inside `CSS Language Server` channel into a log file `css.log`.
  - Load it from the web app.
- You can try it on real-world logs file at `/tests/unit/logParser/fixture`.

## Log Format

The Inspector takes two log formats: `text` and `json`.

- `text`:
  - Logs generated by setting `"[langId].trace.server": "verbose"`.
  - Logs generated by setting `"[langId].trace.server": { "format": "Text" }`
- `json`: Logs generated by setting: `"[langId].trace.server": { "format": "JSON" }`

The Inspector could load any JSON logs, as long as they follow this format:

```ts
export type MsgKind =
  | 'send-notification'
  | 'recv-notification'
  | 'send-request'
  | 'recv-request'
  | 'send-response'
  | 'recv-response'

export interface LspItem {
  type: MsgKind
  message: any
  timestamp: unix timestamp
}

```

Each line is terminated with `\r\n`.

Here is a sample:

```
{"type":"receive-response","message":{"jsonrpc":"2.0","id":0,"result":{"capabilities":{"textDocumentSync":1,"completionProvider":{"resolveProvider":true}}}},"timestamp":1534721620392}\r\n
{"type":"send-notification","message":{"jsonrpc":"2.0","method":"initialized","params":{}},"timestamp":1534721620393}\r\n
```

## Running & Developing
Navigate to the sub-folder `lsp-inspector`, and:
- `yarn`
- `yarn serve`

## License

Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the [MIT](LICENSE) License.
