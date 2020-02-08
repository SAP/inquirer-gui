import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {RpcExtension} from '@sap-devx/webview-rpc/out.ext/rpc-extension';
import { InquirerGui } from './inquirer-gui';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('inquirerUiExample.show', () => {
			InquirerUIPanel.createOrShow(context.extensionPath);
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(InquirerUIPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				InquirerUIPanel.revive(webviewPanel, context.extensionPath);
			}
		});
	}
}

/**
 * Manages webview panels
 */
class InquirerUIPanel {
	/**
	 * Track the currently panel. Only allow a single panel to exist at a time.
	 */
	public static currentPanel: InquirerUIPanel | undefined;

	public static readonly viewType = 'inquirerGuiExample';

	private rpc: RpcExtension;
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];
	private inquirerGui: InquirerGui;

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (InquirerUIPanel.currentPanel) {
			InquirerUIPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			InquirerUIPanel.viewType,
			'Inquirer UI Example',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'dist'))]
			}
		);

		InquirerUIPanel.currentPanel = new InquirerUIPanel(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		InquirerUIPanel.currentPanel = new InquirerUIPanel(panel, extensionPath);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;
		this.rpc = new RpcExtension(this._panel.webview);
		this.inquirerGui = new InquirerGui(this.rpc, showOpenDialog);

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' });
	}

	public dispose() {
		InquirerUIPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'Inquirer UI Example';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
			// TODO: don't use sync
			let indexHtml: string = fs.readFileSync(path.join(this._extensionPath, 'dist', 'index.html'), "utf8");
			if (indexHtml) {
				// Local path to main script run in the webview
				const scriptPathOnDisk = vscode.Uri.file(path.join(this._extensionPath, 'dist', path.sep));
				const scriptUri = this._panel.webview.asWebviewUri(scriptPathOnDisk);
	
				// TODO: very fragile: assuming double quotes and src is first attribute
				// specifically, doesn't work when building vue for development (vue-cli-service build --mode development)
				indexHtml = indexHtml.replace(/<link href=\//g, `<link href=${scriptUri.toString()}`);
				indexHtml = indexHtml.replace(/<script src=\//g, `<script src=${scriptUri.toString()}`);
				indexHtml = indexHtml.replace(/<img src=\//g, `<img src=${scriptUri.toString()}`);
			}
			
			return indexHtml;
		}
	}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function showOpenDialog(currentPath: string): Promise<string> {
	let uri;
	try {
		uri = vscode.Uri.file(currentPath);
	} catch (e) {
		uri = vscode.Uri.file('/');
	}

	try {
		let filePath = await vscode.window.showOpenDialog({
			canSelectFiles: true,
			defaultUri: uri
		});
		return (filePath as Array<vscode.Uri>)[0].fsPath;
	} catch (e) {
		return currentPath;
	}
}
