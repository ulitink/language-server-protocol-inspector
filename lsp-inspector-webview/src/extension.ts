import * as fs from 'fs'
import * as path from 'path'
import * as vscode from 'vscode'
import { Server } from 'ws'
import { WSServer } from './server'

export function activate(context: vscode.ExtensionContext) {
  let lspInspector: LSPInspector

  context.subscriptions.push(
    vscode.commands.registerCommand('lspInspector.start', () => {
      lspInspector = new LSPInspector(context.extensionPath, context.extensionUri)
    })
  )
}

class LSPInspector {
  static viewType: 'lspInspector'

  private readonly _resourceRoot: string
  private readonly _extensionUri: vscode.Uri;
  private _panel: vscode.WebviewPanel
  private _wsserver: Server

  constructor(extensionPath: string, extensionUri: vscode.Uri) {
    this._resourceRoot = path.join(extensionPath, 'dist/webview')
    this._extensionUri = extensionUri
    this._panel = vscode.window.createWebviewPanel(LSPInspector.viewType, 'LSP Inspector', 2, {
      enableScripts: true,
      enableFindWidget: true,
      retainContextWhenHidden: true,
    })
    this._setHTMLContent()

    const lspInspectorConfig = vscode.workspace.getConfiguration('lspInspector')

    this._wsserver = new Server({ port: lspInspectorConfig.get('port') })
    this._wsserver.on('connection', (conn) => {
      conn.on('message', (msg) => {
        this.message(msg.toString())
      })
    })
  }

  message(data: string) {
    this._panel.webview.postMessage(data)
  }

  private _setHTMLContent() {

    const webview = this._panel.webview
    const appStyleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview/css', 'app.8acc7258.css'));
    const chunkStyleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview/css', 'chunk-vendors.c05bff2f.css'));
    const appScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview/js', 'app.79049a29.js'));
    const chunkScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview/js', 'chunk-vendors.3486d69f.js'));
    const html = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel=icon href=/language-server-protocol/img/favicon.png>
    <title>LSP Inspector</title>
    <link href="${appStyleUri}" />
    <link href="${chunkStyleUri}" />
    <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; font-src ${webview.cspSource} https:; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline' ;">
  </head>

  <body>
    <div id="app"></div>
    <script src="${appScriptUri}"></script>
    <script src="${chunkScriptUri}"></script>
  </body>
</html>

    `
    this._panel.webview.html = html
  }

  private getResourceUri(p: string) {
    return vscode.Uri.file(path.join(this._resourceRoot, p)).with({ scheme: 'vscode-webview-resource' })
  }
}
